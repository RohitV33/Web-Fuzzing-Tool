import { useState, useRef, useCallback } from 'react'
import { scansAPI } from '../utils/api'
import { WORDLISTS, VULNERABILITY_PAYLOADS } from '../data/payloads'

const STATUS_COLORS = {
  200: '#22c55e', 201: '#22c55e', 204: '#22c55e',
  301: '#fbbf24', 302: '#fbbf24', 307: '#fbbf24',
  400: '#f97316', 401: '#ef4444', 403: '#ef4444',
  404: '#64748b', 500: '#dc2626', 503: '#dc2626',
}

function simStatus(path) {
  const interesting = ['/admin', '/login', '/api', '/upload', '/config', '/backup', '/.env']
  const forbidden   = ['/secret', '/private', '/internal']
  if (forbidden.some(f  => path.includes(f)))  return Math.random() > 0.3 ? 403 : 200
  if (interesting.some(p => path.includes(p))) return Math.random() > 0.4 ? 200 : 404
  const r = Math.random()
  if (r < 0.08) return 200
  if (r < 0.12) return 301
  if (r < 0.15) return 403
  if (r < 0.17) return 500
  return 404
}
function simSize(s)  { return s === 404 ? Math.floor(Math.random()*300+100) : Math.floor(Math.random()*50000+500) }
function simTime()   { return Math.floor(Math.random()*800+50) }
function simVuln(path, payload) {
  if (!payload) {
    if (path.includes('.env') || path.includes('.git') || path.includes('.bak')) return { type: 'Sensitive File Exposure', severity: 'high' }
    return null
  }
  const p = payload.toLowerCase()
  if (p.includes("'") || p.includes('union')) return { type: 'SQL Injection', severity: 'critical' }
  if (p.includes('<script>')) return { type: 'Reflected XSS', severity: 'high' }
  if (p.includes('../') || p.includes('etc/passwd')) return { type: 'Local File Inclusion', severity: 'critical' }
  return null
}

export function useFuzzer() {
  const [status,    setStatus]    = useState('idle')
  const [results,   setResults]   = useState([])
  const [progress,  setProgress]  = useState(0)
  const [stats,     setStats]     = useState({ total: 0, found: 0, errors: 0, vulns: 0 })
  const [scanId,    setScanId]    = useState(null)
  const [backendOk, setBackendOk] = useState(null)

  const abortRef  = useRef(false)
  const pausedRef = useRef(false)
  const pollRef   = useRef(null)

  const startBackend = useCallback(async (config) => {
    try {
      const res = await scansAPI.start(config)
      const id  = res.data.scanId
      setScanId(id)
      setBackendOk(true)
      setStatus('running')
      pollRef.current = setInterval(async () => {
        if (abortRef.current) { clearInterval(pollRef.current); return }
        try {
          const s = await scansAPI.getStatus(id)
          setProgress(s.data.progress || 0)
          if (s.data.stats) setStats(s.data.stats)
          if (['completed', 'failed', 'aborted'].includes(s.data.status)) {
            clearInterval(pollRef.current)
            setStatus(s.data.status === 'completed' ? 'done' : 'idle')
            const full = await scansAPI.get(id)
            setResults(full.data.results || [])
          }
        } catch { clearInterval(pollRef.current) }
      }, 2000)
      return true
    } catch {
      setBackendOk(false)
      return false
    }
  }, [])

  const startSimulation = useCallback(async (config) => {
    const { targetUrl, scanMode, wordlistKey, threads, extensions, excludeStatus } = config
    const wordlist = WORDLISTS[wordlistKey] || WORDLISTS.common
    const payloads = (scanMode === 'vuln' || scanMode === 'deep') ? VULNERABILITY_PAYLOADS : null
    const excluded = (excludeStatus || '').split(',').map(s => parseInt(s.trim())).filter(Boolean)
    const delay    = ms => new Promise(r => setTimeout(r, ms))
    const tDelay   = Math.max(20, Math.floor(500 / (threads || 10)))
    let found = 0, errors = 0, vulns = 0
    setStats({ total: wordlist.length, found: 0, errors: 0, vulns: 0 })

    for (let i = 0; i < wordlist.length; i++) {
      if (abortRef.current) break
      while (pausedRef.current && !abortRef.current) await delay(100)
      const word = wordlist[i]
      const ext  = extensions?.length ? extensions[Math.floor(Math.random() * extensions.length)] : ''
      const path = `/${word}${ext}`
      const payload    = payloads ? payloads[i % payloads.length] : null
      const httpStatus = simStatus(path)
      const size       = simSize(httpStatus)
      const time       = simTime()
      const vuln       = simVuln(path, payload)
      if (!excluded.includes(httpStatus)) {
        if (httpStatus !== 404) found++
        if (httpStatus >= 500) errors++
        if (vuln) vulns++
        if (httpStatus !== 404 || scanMode === 'deep') {
          setResults(prev => [{ id: Date.now() + i, url: targetUrl.replace(/\/$/, '') + path, path, status: httpStatus, size, time, payload, vulnerability: vuln, timestamp: new Date().toISOString() }, ...prev.slice(0, 499)])
        }
      }
      setProgress(Math.round(((i + 1) / wordlist.length) * 100))
      setStats({ total: wordlist.length, found, errors, vulns })
      await delay(tDelay)
    }
    if (!abortRef.current) setStatus('done')
    else setStatus('idle')
  }, [])

  const start = useCallback(async (config) => {
    setResults([]); setProgress(0); setStats({ total: 0, found: 0, errors: 0, vulns: 0 })
    setStatus('running'); abortRef.current = false; pausedRef.current = false
    const token = localStorage.getItem('vs_token')
    if (token) {
      const ok = await startBackend(config)
      if (ok) return
    }
    setBackendOk(false)
    startSimulation(config)
  }, [startBackend, startSimulation])

  const pause  = useCallback(() => { pausedRef.current = true;  setStatus('paused') }, [])
  const resume = useCallback(() => { pausedRef.current = false; setStatus('running') }, [])
  const stop   = useCallback(async () => {
    abortRef.current = true; pausedRef.current = false
    clearInterval(pollRef.current)
    if (scanId) { try { await scansAPI.stop(scanId) } catch {} }
    setStatus('idle')
  }, [scanId])
  const reset = useCallback(() => {
    stop(); setResults([]); setProgress(0); setScanId(null)
    setStats({ total: 0, found: 0, errors: 0, vulns: 0 })
  }, [stop])

  return { status, results, progress, stats, scanId, backendOk, start, pause, resume, stop, reset, STATUS_COLORS }
}
