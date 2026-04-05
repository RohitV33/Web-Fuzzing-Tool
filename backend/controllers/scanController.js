const Scan   = require('../models/Scan')
const User   = require('../models/User')
const Report = require('../models/Report')
const { runFuzz } = require('../services/fuzzerEngine')
const { WORDLISTS } = require('../config/payloads')

// Active scan registry (in-memory, per-process)
const activeScans = new Map()

// Build report findings from scan results
function buildFindings(results) {
  const DESCRIPTIONS = {
    'SQL Injection':              { desc: 'SQL injection vulnerability detected. Authentication or data may be compromised.', rec: 'Use parameterized queries or prepared statements. Sanitize all inputs.', cve: 'CWE-89' },
    'Blind SQLi (Time-Based)':   { desc: 'Time-based blind SQL injection detected via response delay.', rec: 'Use parameterized queries. Implement query timeouts.', cve: 'CWE-89' },
    'Reflected XSS':             { desc: 'Reflected XSS detected — user input is echoed unsanitized.', rec: 'Encode all output. Implement Content Security Policy (CSP).', cve: 'CWE-79' },
    'Local File Inclusion':      { desc: 'LFI allows reading sensitive server files like /etc/passwd.', rec: 'Whitelist allowed file paths. Never use user input in file operations.', cve: 'CWE-22' },
    'Remote File Inclusion':     { desc: 'RFI allows loading remote scripts, enabling remote code execution.', rec: 'Disable allow_url_include. Whitelist allowed file sources.', cve: 'CWE-98' },
    'SSRF':                      { desc: 'SSRF allows the server to make requests to internal resources.', rec: 'Whitelist allowed URLs. Block private IP ranges in outbound requests.', cve: 'CWE-918' },
    'Command Injection':         { desc: 'OS command injection detected. Attacker may execute arbitrary commands.', rec: 'Never pass user input to system calls. Use safe APIs.', cve: 'CWE-78' },
    'Sensitive File Exposure':   { desc: 'Sensitive file is publicly accessible, potentially exposing credentials.', rec: 'Block access to sensitive files via web server config. Use a secrets vault.', cve: 'CWE-200' },
    'Admin Panel Exposed':       { desc: 'Admin panel is publicly accessible without IP restriction.', rec: 'Restrict admin access by IP whitelist. Enforce MFA.', cve: 'CWE-284' },
    'Error Information Disclosure': { desc: 'Server returns stack traces, revealing internal implementation details.', rec: 'Implement generic error pages. Disable debug mode in production.', cve: 'CWE-209' },
    'Error Disclosure':          { desc: 'Server returned a 500 error, indicating a possible injection point.', rec: 'Implement proper error handling. Log errors server-side only.', cve: 'CWE-209' },
  }

  return results
    .filter(r => r.vulnerability)
    .map(r => {
      const meta = DESCRIPTIONS[r.vulnerability.type] || { desc: 'Vulnerability detected.', rec: 'Review and remediate.', cve: 'CWE-0' }
      return {
        type:           r.vulnerability.type,
        severity:       r.vulnerability.severity,
        url:            r.url,
        path:           r.path,
        payload:        r.payload || null,
        status:         r.status,
        description:    meta.desc,
        recommendation: meta.rec,
        cve:            meta.cve,
        timestamp:      r.timestamp,
      }
    })
}

function calcRiskScore(summary) {
  return Math.min(10, (
    summary.critical * 3 +
    summary.high     * 2 +
    summary.medium   * 1 +
    summary.low      * 0.3
  ) / Math.max(1, summary.critical + summary.high + summary.medium + summary.low) * 5
  + Math.min(5, summary.critical * 1.5 + summary.high * 0.5)
  ).toFixed(1)
}

// POST /api/scans  — start a new scan
const startScan = async (req, res, next) => {
  try {
    const { targetUrl, scanMode, wordlistKey, threads, extensions, excludeStatus, customPayloads } = req.body

    if (!targetUrl) return res.status(400).json({ error: 'targetUrl is required' })

    // Validate URL
    try { new URL(targetUrl) } catch {
      return res.status(400).json({ error: 'Invalid target URL' })
    }

    // Create scan document
    const scan = await Scan.create({
      user:         req.user._id,
      targetUrl,
      scanMode:     scanMode || 'dir',
      wordlistKey:  wordlistKey || 'common',
      threads:      Math.min(parseInt(threads) || 10, 50),
      extensions:   extensions || [],
      excludeStatus:excludeStatus || '404',
      status:       'running',
      startedAt:    new Date(),
    })

    // Increment user scan count
    await User.findByIdAndUpdate(req.user._id, { $inc: { scansCount: 1 } })

    // Respond immediately with scan ID
    res.status(201).json({ scanId: scan._id, message: 'Scan started', status: 'running' })

    // Run fuzzer asynchronously
    const signal  = { aborted: false }
    const results = []
    activeScans.set(scan._id.toString(), { signal, scan })

    try {
      await runFuzz(
        { targetUrl, scanMode, wordlistKey, threads: scan.threads, extensions, excludeStatus, customPayloads },
        (result) => {
          results.push(result)
          // Keep max 500 results in memory
          if (results.length > 500) results.shift()
        },
        async ({ progress, stats }) => {
          await Scan.findByIdAndUpdate(scan._id, { progress, stats })
        },
        signal
      )

      const findings = buildFindings(results)
      const summary  = {
        critical: findings.filter(f => f.severity === 'critical').length,
        high:     findings.filter(f => f.severity === 'high').length,
        medium:   findings.filter(f => f.severity === 'medium').length,
        low:      findings.filter(f => f.severity === 'low').length,
      }
      summary.riskScore = parseFloat(calcRiskScore(summary))

      await Scan.findByIdAndUpdate(scan._id, {
        status:      signal.aborted ? 'aborted' : 'completed',
        results:     results.slice(-500),
        completedAt: new Date(),
        duration:    Date.now() - scan.startedAt.getTime(),
        progress:    100,
      })

      // Auto-generate report (always, even if no findings)
      const report = await Report.create({
        user:     req.user._id,
        scan:     scan._id,
        title:    `Scan Report — ${new URL(targetUrl).hostname}`,
        target:   targetUrl,
        findings,
        summary,
      })

      // Link report back to scan
      await Scan.findByIdAndUpdate(scan._id, { report: report._id })
      
    } catch (err) {
      await Scan.findByIdAndUpdate(scan._id, { status: 'failed', error: err.message })
    } finally {
      activeScans.delete(scan._id.toString())
    }
  } catch (err) {
    next(err)
  }
}

// GET /api/scans — list user's scans
const getScans = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 10
    const skip  = (page - 1) * limit

    const [scans, total] = await Promise.all([
      Scan.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-results'),
      Scan.countDocuments({ user: req.user._id }),
    ])

    res.json({ scans, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
}

// GET /api/scans/:id — get single scan with results
const getScan = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, user: req.user._id })
    if (!scan) return res.status(404).json({ error: 'Scan not found' })
    res.json(scan)
  } catch (err) {
    next(err)
  }
}

// GET /api/scans/:id/status — lightweight poll
const getScanStatus = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, user: req.user._id })
      .select('status progress stats startedAt completedAt duration')
    if (!scan) return res.status(404).json({ error: 'Scan not found' })
    res.json(scan)
  } catch (err) {
    next(err)
  }
}

// POST /api/scans/:id/stop — abort a running scan
const stopScan = async (req, res, next) => {
  try {
    const scanId = req.params.id
    const entry  = activeScans.get(scanId)

    if (entry) {
      entry.signal.aborted = true
      activeScans.delete(scanId)
    }

    await Scan.findOneAndUpdate(
      { _id: scanId, user: req.user._id },
      { status: 'aborted' }
    )
    res.json({ message: 'Scan aborted' })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/scans/:id
const deleteScan = async (req, res, next) => {
  try {
    const scan = await Scan.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!scan) return res.status(404).json({ error: 'Scan not found' })
    res.json({ message: 'Scan deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { startScan, getScans, getScan, getScanStatus, stopScan, deleteScan }
