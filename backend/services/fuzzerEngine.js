/**
 * VulnScan Fuzzing Engine (PRO FIXED VERSION)
 */

const axios = require('axios')
const https = require('https')
const { WORDLISTS, VULNERABILITY_PAYLOADS } = require('../config/payloads')

// 🔥 Real browser headers (WAF bypass basic)
const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive',
}

// -------------------- DETECTION --------------------
function detectVulnerability({ url, path, status, body, payload, time, baseline }) {
  const b = (body || '').toLowerCase()

  // 🚫 WAF / Blocking
  if (status === 403 || status === 429) {
    return { type: 'Blocked by WAF / Rate Limit', severity: 'info' }
  }

  // 🔁 Redirect (auth required)
  if (status === 301 || status === 302) {
    return { type: 'Redirect (Possible Auth Required)', severity: 'info' }
  }

  // 🔥 Sensitive files
  if (!payload && path.match(/\.(env|git|bak|backup|sql|config)$/i) && status === 200) {
    return { type: 'Sensitive File Exposure', severity: 'high' }
  }

  // ---------------- PAYLOAD BASED ----------------
  if (payload) {
    const encodedPayload = encodeURIComponent(payload)

    // 🔥 Reflection detection (VERY IMPORTANT)
    if (
      body.includes(payload) ||
      body.includes(encodedPayload) ||
      body.includes(payload.slice(0, 5))
    ) {
      return { type: 'Input Reflection (Possible XSS)', severity: 'medium' }
    }

    // 🔥 SQLi error (still useful sometimes)
    if (
      b.includes('sql') ||
      b.includes('syntax') ||
      b.includes('mysql') ||
      b.includes('query failed') ||
      b.includes('database error')
    ) {
      return { type: 'Possible SQL Injection (Error)', severity: 'high' }
    }

    // 🔥 Response diff (SMART FIX)
    if (baseline && Math.abs(baseline.size - body.length) > baseline.size * 0.05) {
      return { type: 'Response Anomaly Detected', severity: 'medium' }
    }

    // 🔥 Time-based
    if (baseline && time > baseline.time + 2000) {
      return { type: 'Possible Time-Based Injection', severity: 'high' }
    }

    // 🔥 Command injection hint
    if (b.includes('root') || b.includes('www-data')) {
      return { type: 'Possible Command Injection', severity: 'critical' }
    }
  }

  return null
}

// -------------------- REQUEST --------------------
async function makeRequest(url, headers) {
  const start = Date.now()

  try {
    const res = await axios({
      url,
      method: 'GET',
      headers,
      timeout: 10000,
      validateStatus: () => true,
      maxRedirects: 5,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    })

    const body =
      typeof res.data === 'string'
        ? res.data.slice(0, 8000)
        : JSON.stringify(res.data).slice(0, 8000)

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
    scanMode = 'vuln',
    customPayloads = [],
    cookies = '',
    extraHeaders = {},
  } = config

  // 🔥 Build headers with cookies
  const headers = {
    ...DEFAULT_HEADERS,
    ...extraHeaders,
    ...(cookies ? { Cookie: cookies } : {}),
  }

  let testUrl = targetUrl

  // 🔥 Ensure at least one param exists
  if (!targetUrl.includes('?')) {
    testUrl += '?q=test'
  }

  const urlObj = new URL(testUrl)
  const params = Array.from(urlObj.searchParams.keys())

  // 🔥 Baseline request
  const baseline = await makeRequest(testUrl, headers)

  const payloads = customPayloads.length
    ? customPayloads
    : VULNERABILITY_PAYLOADS

  let processed = 0
  const stats = { total: payloads.length, found: 0, vulns: 0, errors: 0 }

  for (const payload of payloads) {
    if (signal?.aborted) break

    const test = new URL(testUrl)

    // 🔥 Inject payload into all params
    params.forEach(p => {
      test.searchParams.set(p, encodeURIComponent(payload))
    })

    const res = await makeRequest(test.toString(), headers)

    const vuln = detectVulnerability({
      url: test.toString(),
      path: test.pathname,
      status: res.status,
      body: res.body,
      payload,
      time: res.time,
      baseline,
    })

    if (res.status !== 0) stats.found++
    else stats.errors++

    if (vuln) stats.vulns++

    onResult({
      url: test.toString(),
      path: test.pathname,
      status: res.status,
      size: res.size,
      time: res.time,
      payload,
      vulnerability: vuln,
    })

    processed++
    onProgress({
      progress: Math.round((processed / payloads.length) * 100),
      stats,
    })

    // 🔥 Slow down (avoid WAF)
    await delay(800 + Math.random() * 1200)
  }

  return stats
}

module.exports = { runFuzz }