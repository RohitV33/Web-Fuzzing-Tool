const axios = require('axios')
const https = require('https')
const cheerio = require('cheerio')
const { WORDLISTS, VULNERABILITY_PAYLOADS } = require('../config/payloads')

// 🔥 Real browser headers (WAF bypass basic)
const DEFAULT_HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection':      'keep-alive',
  'Upgrade-Insecure-Requests': '1',
}

// Security Strings to look for in bypasses
const BYPASS_KEYWORDS = ['logout', 'sign off', 'signoff', 'sign out', 'my account', 'profile', 'welcome', 'hello', 'logged in', 'account.jsp', 'main.jsp', 'doLogout']
const ERROR_PATTERNS  = [
  // SQLi
  'sql syntax', 'mysql_fetch_array', 'oracle error', 'postgresql error', 'sqlite3::', 'db2_execute', 'odbc driver',
  'sql exception', 'exception occurred', 'system error', 'unhandled exception', 'query failed', 'database error',
  'invalid sql', 'unexpected end of stream', 'missing )', 'incorrect syntax near',
  // Local File Inclusion / System
  'root:x:0:0', 'boot.ini', 'windows/system32', 'sh: 1: ', 'uid=0(root)',
]

// -------------------- DETECTION --------------------
function detectVulnerability({ url, path, status, body, payload, time, baseline, finalUrl }) {
  const b = (body || '').toLowerCase()

  // 🚫 WAF / Blocking
  if (status === 403 || status === 429) return { type: 'Blocked by WAF / Rate Limit', severity: 'info' }

  // ---------------- PAYLOAD BASED ----------------
  if (payload) {
    const p = payload.toLowerCase()
    const encoded = encodeURIComponent(payload).toLowerCase()
    
    // HTML Entity encoding commonly used by JSP/ASP/PHP
    const htmlEncoded = payload
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .toLowerCase()

    // 🔥 Reflection detection (Case-insensitive & Encoding aware)
    if (b.includes(p) || b.includes(encoded) || b.includes(htmlEncoded)) {
      // If we see <script> or alert(1) it's HIGH, otherwise MEDIUM
      const isDangerous = p.includes('<script') || p.includes('alert(') || p.includes('onerror=')
      return { type: 'Input Reflection (Possible XSS)', severity: isDangerous ? 'high' : 'medium' }
    }

    // 🔥 SQLi / System Error Patterns
    if (ERROR_PATTERNS.some(pat => b.includes(pat))) {
      return { type: 'Server Error Disclosure (Possible Injection)', severity: 'high' }
    }

    // 🔥 Login Bypass Heuristics
    // If the URL changed from login to something else AND we see bypass keywords
    if (finalUrl && url !== finalUrl && (path.includes('login') || path.includes('auth'))) {
      if (BYPASS_KEYWORDS.some(word => b.includes(word))) {
        return { type: 'Login Bypass Detected (High Confidence)', severity: 'critical' }
      }
    }

    // fallback bypass detection based on sheer content change if baseline exists
    if (baseline && baseline.status === 200 && status === 200) {
      const pageChangedState = BYPASS_KEYWORDS.some(word => b.includes(word) && !baseline.body.toLowerCase().includes(word))
      if (pageChangedState) return { type: 'Authentication Bypass Detected (Heuristic)', severity: 'critical' }
    }

    // 🔥 Response diff (Significant structure change)
    if (baseline && baseline.size > 0 && Math.abs(baseline.size - body.length) > baseline.size * 0.25) {
      return { type: 'Major Response Anomaly', severity: 'medium' }
    }

    // 🔥 Time-based
    if (baseline && time > baseline.time + 3000) {
      return { type: 'Possible Time-Based Injection', severity: 'high' }
    }
  }

  return null
}

// -------------------- REQUEST --------------------
async function makeRequest(url, headers, method = 'GET', data = null) {
  const start = Date.now()

  try {
    const res = await axios({
      url,
      method,
      headers,
      data: method === 'POST' ? new URLSearchParams(data) : null,
      timeout: 12000,
      validateStatus: () => true,
      maxRedirects: 8,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    })

    const body = typeof res.data === 'string'
        ? res.data : JSON.stringify(res.data)

    return {
      status:   res.status,
      body:     body.slice(0, 100000),
      size:     body.length,
      time:     Date.now() - start,
      finalUrl: res.request?.res?.responseUrl || url,
    }
  } catch (err) {
    return { status: 0, body: '', size: 0, time: Date.now() - start, finalUrl: url }
  }
}

const delay = ms => new Promise(res => setTimeout(res, ms))

// -------------------- MAIN ENGINE --------------------
async function runFuzz(config, onResult, onProgress, signal) {
  const {
    targetUrl,
    scanMode = 'vuln',
    customPayloads = [],
    cookies = '',
    extraHeaders = {},
  } = config

  const headers = { ...DEFAULT_HEADERS, ...extraHeaders, ...(cookies ? { Cookie: cookies } : {}) }
  
  // 🔥 Initial Baseline & Discovery
  const baseline = await makeRequest(targetUrl, headers)
  const $ = cheerio.load(baseline.body)
  
  // Generic Discovery: Find all forms and their inputs
  const forms = []
  $('form').each((_, el) => {
    const f = $(el)
    const inputs = []
    f.find('input, textarea, select').each((_, input) => {
      const name = $(input).attr('name')
      if (name) inputs.push(name)
    })
    forms.push({
      action: f.attr('action') || '',
      method: (f.attr('method') || 'GET').toUpperCase(),
      inputs
    })
  })

  // Normalize target URL for discovery
  let testUrl = targetUrl
  if (!targetUrl.includes('?') && forms.length === 0) {
    if (targetUrl.includes('login')) testUrl += '?uid=test&pass=test'
    else if (targetUrl.includes('search')) testUrl += '?query=test'
    else testUrl += '?id=1&q=test'
  }

  const urlObj = new URL(testUrl)
  const queryParams = Array.from(urlObj.searchParams.keys())
  const payloads = customPayloads.length ? customPayloads : VULNERABILITY_PAYLOADS
  const totalTasks = payloads.length * (Math.max(1, queryParams.length) + forms.length)
  
  let processed = 0
  const stats = { total: totalTasks, found: 0, vulns: 0, errors: 0 }
  onProgress({ progress: 1, stats })

  for (const payload of payloads) {
    if (signal?.aborted) break

    // 1. Fuzz Query Params (Generic GET)
    if (queryParams.length > 0) {
      const test = new URL(testUrl)
      queryParams.forEach(p => test.searchParams.set(p, payload))
      const res = await makeRequest(test.toString(), headers)
      const vuln = detectVulnerability({ url: test.toString(), path: test.pathname, status: res.status, body: res.body, payload, time: res.time, baseline, finalUrl: res.finalUrl })
      
      if (res.status !== 0) stats.found++
      else stats.errors++
      if (vuln) stats.vulns++

      onResult({ url: test.toString(), path: test.pathname, status: res.status, size: res.size, time: res.time, payload, vulnerability: vuln })
      processed++
      onProgress({ progress: Math.round((processed / totalTasks) * 100), stats })
    } else if (forms.length === 0) {
        // No params and no forms? Just one check
        processed++; onProgress({ progress: Math.round((processed / totalTasks) * 100), stats })
    }

    // 2. Fuzz Forms (Intelligent POST/GET Discovery)
    for (const form of forms) {
      if (signal?.aborted) break
      const actionUrl = new URL(form.action, targetUrl).toString()
      const data = {}
      form.inputs.forEach(input => { data[input] = payload })

      const res = await makeRequest(actionUrl, headers, form.method, data)
      const vuln = detectVulnerability({ url: actionUrl, path: new URL(actionUrl).pathname, status: res.status, body: res.body, payload, time: res.time, baseline, finalUrl: res.finalUrl })

      if (res.status !== 0) stats.found++
      else stats.errors++
      if (vuln) stats.vulns++

      onResult({ url: actionUrl, path: new URL(actionUrl).pathname, status: res.status, size: res.size, time: res.time, payload, vulnerability: vuln })
      processed++
      onProgress({ progress: Math.round((processed / totalTasks) * 100), stats })
    }

    await delay(100 + Math.random() * 200)
  }

  return stats
}

module.exports = { runFuzz }