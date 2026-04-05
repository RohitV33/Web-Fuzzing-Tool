/**
 * VulnScan Fuzzing Engine (FINAL FIXED VERSION)
 */
const axios = require('axios')
const { WORDLISTS, VULNERABILITY_PAYLOADS } = require('../config/payloads')

const DEFAULT_HEADERS = {
  'User-Agent': 'VulnScan/1.0 Security Scanner',
  'Accept': '*/*',
  'Connection': 'keep-alive',
}

// -------------------- DETECTION --------------------
function detectVulnerability(path, status, body, payload, responseTime, baseline) {
  const b = (body || '').toLowerCase()
  const p = payload ? payload.toLowerCase() : ''

  // Passive checks
  if (!payload) {
    if (path.match(/\.(env|git|bak|backup|old|sql|conf|config)$/i) && status === 200) {
      return { type: 'Sensitive File Exposure', severity: 'high' }
    }
    if ((path.includes('/admin') || path.includes('/panel')) && status === 200) {
      return { type: 'Admin Panel Exposed', severity: 'high' }
    }
    return null
  }

  // SQLi (error based)
  if (
    b.includes('sql') ||
    b.includes('mysql') ||
    b.includes('syntax') ||
    b.includes('warning') ||
    b.includes('odbc') ||
    b.includes('error in your sql')
  ) {
    return { type: 'SQL Injection', severity: 'critical' }
  }

  // Time-based SQLi
  if (responseTime > 3000 && p.includes('sleep')) {
    return { type: 'Blind SQLi (Time-Based)', severity: 'critical' }
  }

  // Response difference (ADVANCED)
  if (baseline && Math.abs(baseline.size - body.length) > 100) {
    return { type: 'Possible Injection (Response Diff)', severity: 'medium' }
  }

  // XSS
  if ((p.includes('<script>') || p.includes('onerror=')) && body.includes(payload)) {
    return { type: 'Reflected XSS', severity: 'high' }
  }

  // LFI
  if (p.includes('../') && b.includes('root:')) {
    return { type: 'Local File Inclusion', severity: 'critical' }
  }

  return null
}

// -------------------- REQUEST --------------------
async function makeRequest(url) {
  const start = Date.now()
  try {
    const res = await axios({
      url,
      method: 'GET',
      headers: DEFAULT_HEADERS,
      timeout: 8000,
      validateStatus: () => true,
    })

    const body = typeof res.data === 'string'
      ? res.data.slice(0, 1000)
      : JSON.stringify(res.data).slice(0, 1000)

    return {
      status: res.status,
      body,
      size: body.length,
      time: Date.now() - start,
    }
  } catch (err) {
    return { status: 0, body: '', size: 0, time: Date.now() - start }
  }
}

const delay = ms => new Promise(res => setTimeout(res, ms))

// -------------------- MAIN ENGINE --------------------
async function runFuzz(config, onResult, onProgress, signal) {
  const {
    targetUrl,
    scanMode = 'dir',
    wordlistKey = 'common',
    threads = 10,
    extensions = [],
    excludeStatus = '404',
    customPayloads = [],
  } = config

  const wordlist = customPayloads.length
    ? customPayloads
    : (WORDLISTS[wordlistKey] || WORDLISTS.common)

  const stats = { total: 0, found: 0, errors: 0, vulns: 0 }
  let processed = 0

  const hasParams = targetUrl.includes('?')

  // -------------------- PARAM / VULN SCAN --------------------
  if (hasParams && ['param', 'vuln', 'deep'].includes(scanMode)) {
    const urlObj = new URL(targetUrl)
    const params = Array.from(urlObj.searchParams.keys())

    // baseline request
    const baseline = await makeRequest(targetUrl)

    stats.total = VULNERABILITY_PAYLOADS.length

    for (const payload of VULNERABILITY_PAYLOADS) {
      if (signal.aborted) break

      const testUrl = new URL(targetUrl)

      params.forEach(param => {
        testUrl.searchParams.set(param, payload)
      })

      const res = await makeRequest(testUrl.toString())

      const vuln = detectVulnerability(
        testUrl.pathname,
        res.status,
        res.body,
        payload,
        res.time,
        baseline
      )

      if (vuln) stats.vulns++

      onResult({
        url: testUrl.toString(),
        path: testUrl.pathname,
        status: res.status,
        size: res.size,
        time: res.time,
        payload,
        vulnerability: vuln,
        timestamp: new Date().toISOString(),
      })

      processed++
      onProgress({
        progress: Math.round((processed / stats.total) * 100),
        stats
      })

      await delay(300 + Math.random() * 700)
    }

    return stats
  }

  // -------------------- DIR SCAN --------------------
  if (scanMode === 'dir') {
    stats.total = wordlist.length

    for (const word of wordlist) {
      if (signal.aborted) break

      const path = `/${word}`
      const url = targetUrl.replace(/\/$/, '') + path

      const res = await makeRequest(url)

      const vuln = detectVulnerability(path, res.status, res.body, null, res.time)

      if (vuln) stats.vulns++

      onResult({
        url,
        path,
        status: res.status,
        size: res.size,
        time: res.time,
        payload: null,
        vulnerability: vuln,
        timestamp: new Date().toISOString(),
      })

      processed++
      onProgress({
        progress: Math.round((processed / stats.total) * 100),
        stats
      })

      await delay(300 + Math.random() * 700)
    }

    return stats
  }

  return stats
}

module.exports = { runFuzz, makeRequest }