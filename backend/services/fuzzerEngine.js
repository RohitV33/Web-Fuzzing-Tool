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

  // Passive checks (no payload)
  if (!payload) {
    if (path.match(/\.(env|git|bak|backup|old|sql|conf|config)$/i) && status === 200) {
      return { type: 'Sensitive File Exposure', severity: 'high' }
    }
    if ((path.includes('/admin') || path.includes('/panel')) && status === 200) {
      return { type: 'Admin Panel Exposed', severity: 'high' }
    }
    return null
  }

  // ---- SQL Injection: Error-Based ----
  if (
    b.includes('you have an error in your sql syntax') ||
    b.includes('warning: mysql') ||
    b.includes('unclosed quotation mark') ||
    b.includes('quoted string not properly terminated') ||
    b.includes('error in your sql') ||
    b.includes('mysql_fetch') ||
    b.includes('mysql_num_rows') ||
    b.includes('ora-01756') ||
    b.includes('sqlite3::') ||
    b.includes('pg_query()') ||
    b.includes('supplied argument is not a valid mysql') ||
    b.includes('odbc_exec') ||
    b.includes('sqlstate') ||
    b.includes('syntax error') ||
    b.includes('microsoft ole db provider for sql server') ||
    b.includes('mysql server version for the right syntax')
  ) {
    return { type: 'SQL Injection (Error-Based)', severity: 'critical' }
  }

  // ---- SQL Injection: Boolean/Data Leak (DVWA style) ----
  if (
    p.includes('or 1=1') ||
    p.includes("' or '1'='1") ||
    p.includes('or 1') ||
    p.includes("'--") ||
    p.includes('"--') ||
    p.includes('1 or 1') ||
    p.includes('union select')
  ) {
    // DVWA returns "First name:" / "Surname:" on successful SQLi
    if (
      b.includes('first name') ||
      b.includes('surname') ||
      b.includes('username') ||
      b.includes('password') ||
      b.includes('email')
    ) {
      return { type: 'SQL Injection (Boolean/Data Leak)', severity: 'critical' }
    }

    // Generic: response significantly bigger than baseline = data dump
    if (baseline && body.length > baseline.size * 1.3) {
      return { type: 'SQL Injection (Response Inflation)', severity: 'high' }
    }
  }

  // ---- SQL Injection: UNION-Based ----
  if (p.includes('union') && p.includes('select')) {
    if (
      b.includes('information_schema') ||
      b.includes('table_name') ||
      b.includes('column_name') ||
      (baseline && body.length > baseline.size * 1.2)
    ) {
      return { type: 'SQL Injection (UNION-Based)', severity: 'critical' }
    }
  }

  // ---- Blind SQLi: Time-Based ----
  if (responseTime > 4000 && (p.includes('sleep') || p.includes('waitfor') || p.includes('benchmark'))) {
    return { type: 'Blind SQLi (Time-Based)', severity: 'critical' }
  }

  // ---- Response Difference (generic anomaly) ----
  if (baseline && Math.abs(baseline.size - body.length) > 200) {
    return { type: 'Possible Injection (Response Diff)', severity: 'medium' }
  }

  // ---- XSS: Reflected ----
  if (
    (p.includes('<script>') || p.includes('onerror=') || p.includes('javascript:')) &&
    (b.includes('<script>') || b.includes('onerror=') || b.includes('javascript:'))
  ) {
    return { type: 'Reflected XSS', severity: 'high' }
  }

  // ---- LFI ----
  if (
    p.includes('../') &&
    (b.includes('root:') || b.includes('/bin/bash') || b.includes('[boot loader]'))
  ) {
    return { type: 'Local File Inclusion (LFI)', severity: 'critical' }
  }

  // ---- RFI ----
  if (
    (p.includes('http://evil') || p.includes('https://attacker')) &&
    status === 200 &&
    baseline &&
    body.length !== baseline.size
  ) {
    return { type: 'Remote File Inclusion (RFI)', severity: 'critical' }
  }

  // ---- Command Injection ----
  if (
    p.includes('whoami') ||
    p.includes('cat /etc/passwd') ||
    p.includes('echo vuln')
  ) {
    if (
      b.includes('root') ||
      b.includes('www-data') ||
      b.includes('daemon') ||
      b.includes('vuln')
    ) {
      return { type: 'Command Injection', severity: 'critical' }
    }
  }

  // ---- SSRF ----
  if (
    p.includes('127.0.0.1') ||
    p.includes('169.254.169.254') ||
    p.includes('file:///')
  ) {
    if (status === 200 && baseline && body.length !== baseline.size) {
      return { type: 'Possible SSRF', severity: 'high' }
    }
  }

  return null
}

// -------------------- REQUEST --------------------
async function makeRequest(url, headers = DEFAULT_HEADERS) {
  const start = Date.now()
  try {
    const res = await axios({
      url,
      method: 'GET',
      headers,
      timeout: 8000,
      validateStatus: () => true,
      maxRedirects: 5,
    })

    // Increased from 1000 to 5000 chars for better detection
    const body = typeof res.data === 'string'
      ? res.data.slice(0, 5000)
      : JSON.stringify(res.data).slice(0, 5000)

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
    cookies = '',        // FIX: accept session cookies from frontend
    extraHeaders = {},   // FIX: accept any extra headers
  } = config

  // FIX: Build headers with cookies for authenticated scanning
  const requestHeaders = {
    ...DEFAULT_HEADERS,
    ...extraHeaders,
    ...(cookies ? { Cookie: cookies } : {}),
  }

  const wordlist = customPayloads.length
    ? customPayloads
    : (WORDLISTS[wordlistKey] || WORDLISTS.common)

  const stats = { total: 0, found: 0, errors: 0, vulns: 0 }
  let processed = 0

  // -------------------- PARAM / VULN / DEEP SCAN --------------------
  // FIX: Removed hasParams gate — vuln/deep/param scan always runs payload injection
  if (['param', 'vuln', 'deep'].includes(scanMode)) {

    // FIX: If URL has no query params, auto-inject common param
    let testTargetUrl = targetUrl
    if (!targetUrl.includes('?')) {
      testTargetUrl = targetUrl + '?id=1'
      console.log(`[VulnScan] No params found in URL, auto-injecting: ${testTargetUrl}`)
    }

    const urlObj = new URL(testTargetUrl)
    const params = Array.from(urlObj.searchParams.keys())

    // Baseline request to compare response diffs
    const baseline = await makeRequest(testTargetUrl, requestHeaders)
    console.log(`[VulnScan] Baseline: status=${baseline.status}, size=${baseline.size}`)

    const payloadsToTest = VULNERABILITY_PAYLOADS

    stats.total = payloadsToTest.length * params.length

    for (const payload of payloadsToTest) {
      if (signal.aborted) break

      const testUrl = new URL(testTargetUrl)

      // Inject payload into every param found
      params.forEach(param => {
        testUrl.searchParams.set(param, payload)
      })

      const res = await makeRequest(testUrl.toString(), requestHeaders)

      const vuln = detectVulnerability(
        testUrl.pathname,
        res.status,
        res.body,
        payload,
        res.time,
        baseline
      )

      if (vuln) stats.vulns++
      if (res.status !== 0) stats.found++
      else stats.errors++

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
      stats.total = payloadsToTest.length
      onProgress({
        progress: Math.round((processed / payloadsToTest.length) * 100),
        stats,
      })

      await delay(200 + Math.random() * 500)
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

      const res = await makeRequest(url, requestHeaders)

      const excluded = excludeStatus
        .split(',')
        .map(s => parseInt(s.trim()))
        .includes(res.status)

      const vuln = detectVulnerability(path, res.status, res.body, null, res.time)

      if (!excluded && res.status !== 0) stats.found++
      else if (res.status === 0) stats.errors++
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
        stats,
      })

      await delay(200 + Math.random() * 500)
    }

    return stats
  }

  // -------------------- PARAM FUZZ SCAN --------------------
  // Discovers hidden parameters by fuzzing parameter names
  if (scanMode === 'paramfuzz') {
    const baseUrl = targetUrl.split('?')[0]
    const paramWordlist = WORDLISTS.parameters || WORDLISTS.common
    stats.total = paramWordlist.length

    const baseline = await makeRequest(baseUrl, requestHeaders)

    for (const paramName of paramWordlist) {
      if (signal.aborted) break

      const testUrl = `${baseUrl}?${paramName}=1`
      const res = await makeRequest(testUrl, requestHeaders)

      // If response differs from baseline, param likely exists
      const isDifferent = Math.abs(res.size - baseline.size) > 50 || res.status !== baseline.status

      const vuln = isDifferent
        ? { type: `Hidden Parameter Found: ${paramName}`, severity: 'info' }
        : null

      if (isDifferent) stats.found++
      if (res.status === 0) stats.errors++

      onResult({
        url: testUrl,
        path: `/?${paramName}=1`,
        status: res.status,
        size: res.size,
        time: res.time,
        payload: paramName,
        vulnerability: vuln,
        timestamp: new Date().toISOString(),
      })

      processed++
      onProgress({
        progress: Math.round((processed / stats.total) * 100),
        stats,
      })

      await delay(200 + Math.random() * 400)
    }

    return stats
  }

  return stats
}

module.exports = { runFuzz, makeRequest }