import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Globe, Zap, AlertTriangle, Search,
  Play, Square, RotateCcw, FileText, Activity,
  CheckCircle, Server, ChevronDown, ChevronUp,
  Cpu, Lock, TrendingUp, Eye
} from 'lucide-react'
import { useFuzzer } from '../hooks/useFuzzer'
import { WORDLIST_OPTIONS } from '../data/payloads'

/* ── Animated counter ───────────────────────────────────────── */
function LiveNumber({ value, color }) {
  const [disp, setDisp] = useState(0)
  const ref = useRef(0)
  useEffect(() => {
    const from = ref.current, to = value, steps = 18
    if (from === to) { setDisp(to); return }
    let s = 0
    const id = setInterval(() => {
      s++; setDisp(Math.round(from + (to - from) * (s / steps)))
      if (s >= steps) { clearInterval(id); ref.current = to }
    }, 28)
    return () => clearInterval(id)
  }, [value])
  return <span style={{ color, fontVariantNumeric: 'tabular-nums' }}>{disp.toLocaleString()}</span>
}

/* ── Status code badge ──────────────────────────────────────── */
function StatusBadge({ code }) {
  const [c, bg] =
    code >= 200 && code < 300 ? ['var(--success)', 'var(--success-bg)'] :
    code >= 300 && code < 400 ? ['var(--warning)', 'var(--warning-bg)'] :
    code >= 400 && code < 500 ? ['#f97316',        'rgba(249,115,22,0.1)'] :
    code >= 500               ? ['var(--danger)',   'var(--danger-bg)'] :
                                ['var(--text-muted)', 'var(--bg-surface)']
  return (
    <span style={{
      fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
      padding: '2px 8px', borderRadius: '5px', color: c, background: bg,
      border: `1px solid ${c}30`,
    }}>{code}</span>
  )
}

/* ── Vuln severity badge ────────────────────────────────────── */
function SeverityBadge({ vuln }) {
  if (!vuln) return <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>—</span>
  const s = vuln.severity
  const cfg = {
    critical: { color: 'var(--danger)',   bg: 'var(--danger-bg)',   label: 'CRITICAL' },
    high:     { color: '#f97316',         bg: 'rgba(249,115,22,0.1)', label: 'HIGH' },
    medium:   { color: 'var(--warning)',  bg: 'var(--warning-bg)', label: 'MEDIUM' },
    low:      { color: 'var(--success)',  bg: 'var(--success-bg)', label: 'LOW' },
  }[s] || { color: 'var(--text-muted)', bg: 'var(--bg-surface)', label: s?.toUpperCase() }
  return (
    <span style={{
      fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
      padding: '2px 7px', borderRadius: '5px',
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30`,
      animation: s === 'critical' ? 'vulnPulse 1.5s ease infinite' : 'none',
    }}>
      {vuln.type} <span style={{ opacity: 0.7 }}>· {cfg.label}</span>
    </span>
  )
}

/* ── Scan Mode Card ─────────────────────────────────────────── */
function ModeCard({ icon: Icon, label, desc, value, active, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        textAlign: 'left', padding: '0.75rem', borderRadius: 'var(--radius-sm)',
        border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border)'}`,
        background: active ? 'var(--accent-light)' : 'transparent',
        color: active ? 'var(--text-accent)' : 'var(--text-muted)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease', opacity: disabled ? 0.5 : 1,
        boxShadow: active ? 'var(--shadow-accent)' : 'none',
      }}
      onMouseEnter={e => {
        if (!disabled && !active) {
          e.currentTarget.style.borderColor = 'var(--border-hover)'
          e.currentTarget.style.background = 'var(--bg-hover)'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }
      }}
      onMouseLeave={e => {
        if (!disabled && !active) {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--text-muted)'
        }
      }}
    >
      <Icon size={13} style={{ marginBottom: '5px', display: 'block' }} />
      <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '2px', fontFamily: 'var(--font-display)' }}>{label}</div>
      <div style={{ fontSize: '0.67rem', opacity: 0.65, lineHeight: 1.3 }}>{desc}</div>
    </button>
  )
}

/* ════════════════════════════════════════════════════════════ */
export default function Scanner() {
  const { status, results, progress, stats, scanId, backendOk, start, stop, reset } = useFuzzer()
  const navigate = useNavigate()

  const [targetUrl,  setTargetUrl]  = useState('')
  const [scanMode,   setScanMode]   = useState('dir')
  const [wordlistKey,setWordlistKey]= useState('common')
  const [threads,    setThreads]    = useState(10)
  const [showAdv,    setShowAdv]    = useState(false)
  const [filterVuln, setFilterVuln] = useState(false)
  const [newIds,     setNewIds]     = useState(new Set())
  const prevLen = useRef(0)

  const isRunning = status === 'running'
  const isDone    = status === 'done'
  const displayed = filterVuln ? results.filter(r => r.vulnerability) : results

  /* highlight new rows */
  useEffect(() => {
    if (results.length > prevLen.current) {
      const fresh = new Set(results.slice(0, results.length - prevLen.current).map(r => r.id))
      setNewIds(fresh)
      const t = setTimeout(() => setNewIds(new Set()), 700)
      prevLen.current = results.length
      return () => clearTimeout(t)
    }
    if (results.length === 0) prevLen.current = 0
  }, [results])

  const handleStart = () => {
    if (!targetUrl.trim()) return
    start({ targetUrl: targetUrl.trim(), scanMode, wordlistKey, threads, extensions: [], excludeStatus: '404' })
  }

  const SCAN_MODES = [
    { value: 'dir',   icon: Globe,         label: 'Directory',   desc: 'Enumerate paths & files'     },
    { value: 'vuln',  icon: AlertTriangle,  label: 'Vuln Scan',   desc: 'SQLi, XSS, LFI & more'      },
    { value: 'param', icon: Search,         label: 'Param Fuzz',  desc: 'Discover input parameters'   },
    { value: 'deep',  icon: Zap,            label: 'Deep Scan',   desc: 'Comprehensive all-payload'   },
  ]

  const STATS = [
    { label: 'Requests', val: stats.total,  icon: Activity,   color: 'var(--text-accent)' },
    { label: 'Found',    val: stats.found,  icon: CheckCircle,color: 'var(--success)'     },
    { label: 'Errors',   val: stats.errors, icon: Server,     color: 'var(--warning)'     },
    { label: 'Vulns',    val: stats.vulns,  icon: Shield,     color: 'var(--danger)'      },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: '72px', paddingBottom: '3rem' }}>

      <style>{`
        @keyframes vulnPulse { 0%,100%{box-shadow:none} 50%{box-shadow:0 0 0 3px rgba(248,113,113,0.2)} }
        @keyframes rowSlide  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
        @keyframes rowFlash  { 0%{background:var(--accent-light)} 100%{background:transparent} }
        @keyframes shimmer   { from{background-position:200% center} to{background-position:-200% center} }
        @keyframes popIn     { 0%{transform:scale(0.95);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes liveGlow  { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0)} 50%{box-shadow:0 0 0 4px rgba(74,222,128,0.25)} }

        .scanner-row-new  { animation: rowFlash 0.7s ease forwards; }
        .scanner-row      { transition: background 0.15s ease; }
        .scanner-row:hover{ background: var(--bg-hover) !important; }
        .mode-card-active { animation: popIn 0.2s ease; }
        .stat-tile:hover  { transform: translateY(-2px); border-color: var(--border-accent) !important; box-shadow: var(--shadow-accent) !important; }

        .start-btn-glow:not(:disabled):hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 32px var(--accent-glow) !important;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 3px; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--accent-light)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={15} style={{ color: 'var(--text-accent)' }} />
                </div>
                <h1 style={{ margin: 0, fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
                  Web Scanner
                </h1>
                {isRunning && (
                  <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span className="live-dot" style={{ width: '6px', height: '6px' }} /> Live
                  </span>
                )}
                {isDone && <span className="badge badge-indigo">Complete</span>}
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Configure a target and launch an intelligent vulnerability scan
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {backendOk === true  && <span style={{ color: 'var(--success)' }}>✓ Backend live</span>}
              {backendOk === false && <span style={{ color: 'var(--warning)' }}>⚠ Demo mode</span>}
              {scanId && <span style={{ color: 'var(--text-muted)' }}>· ID {String(scanId).slice(-8)}</span>}
            </div>
          </div>
        </div>

        {/* ── Report banner ── */}
        {isDone && scanId && backendOk && (
          <div style={{ marginBottom: '1.5rem', padding: '0.9rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', animation: 'popIn 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={15} style={{ color: 'var(--text-accent)' }} />
              <span style={{ color: 'var(--text-accent)', fontWeight: 600, fontSize: '0.9rem' }}>Security report generated</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Your scan results have been saved.</span>
            </div>
            <button
              onClick={() => navigate(`/reports/${scanId}`)}
              className="btn-primary"
              style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
            >
              <Eye size={13} /> View Report
            </button>
          </div>
        )}

        {/* ── Main grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.25rem', alignItems: 'start' }}>

          {/* ═══ LEFT: Config Card ═══ */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'sticky', top: '80px', transition: 'border-color 0.2s' }}>

            {/* Scan progress ring indicator */}
            {(isRunning || isDone) && (
              <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {isDone ? '✓ Scan complete' : 'Scanning…'}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-accent)' }}>{progress}%</span>
                </div>
                <div className="progress-bar">
                  <div style={{
                    height: '100%', borderRadius: '2px',
                    width: `${progress}%`, transition: 'width 0.4s ease',
                    backgroundImage: isDone
                      ? 'linear-gradient(90deg, var(--success), #86efac)'
                      : 'linear-gradient(90deg, var(--accent), #a5b4fc, var(--accent))',
                    backgroundSize: '200% auto',
                    animation: isRunning ? 'shimmer 1.8s linear infinite' : 'none',
                    boxShadow: isRunning ? '0 0 8px var(--accent-glow)' : 'none',
                  }} />
                </div>
              </div>
            )}

            {/* Target URL */}
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '7px' }}>
                <Globe size={10} /> Target URL
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="cyber-input"
                  value={targetUrl}
                  onChange={e => setTargetUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleStart()}
                  placeholder="https://example.com"
                  disabled={isRunning}
                />
              </div>
            </div>

            {/* Scan mode */}
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '7px' }}>
                <Zap size={10} /> Scan Mode
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {SCAN_MODES.map(m => (
                  <ModeCard
                    key={m.value} {...m}
                    active={scanMode === m.value}
                    onClick={() => setScanMode(m.value)}
                    disabled={isRunning}
                  />
                ))}
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--border)', margin: '1.1rem 0' }} />

            {/* Advanced toggle */}
            <button
              onClick={() => setShowAdv(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', padding: '0', fontFamily: 'var(--font-body)', marginBottom: showAdv ? '0.85rem' : '1.1rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Lock size={12} />
              <span style={{ fontWeight: 500 }}>Advanced Settings</span>
              <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>{showAdv ? <ChevronUp size={13} /> : <ChevronDown size={13} />}</span>
            </button>

            {showAdv && (
              <div style={{ marginBottom: '1.1rem', padding: '1rem', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', animation: 'popIn 0.2s ease', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Wordlist</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      className="cyber-select"
                      value={wordlistKey}
                      onChange={e => setWordlistKey(e.target.value)}
                      disabled={isRunning}
                    >
                      {WORDLIST_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label} — {o.count}</option>)}
                    </select>
                    <ChevronDown size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Threads — <span style={{ color: 'var(--text-accent)', fontFamily: 'var(--font-mono)' }}>{threads}</span>
                  </label>
                  <input type="range" min={1} max={50} value={threads} onChange={e => setThreads(Number(e.target.value))} disabled={isRunning} className="cyber-range" style={{ width: '100%' }} />
                </div>
              </div>
            )}

            {/* Primary action */}
            {!isRunning ? (
              <button
                className="btn-primary start-btn-glow"
                onClick={handleStart}
                disabled={!targetUrl.trim() || isDone}
                style={{ width: '100%', justifyContent: 'center', transition: 'all 0.2s ease', opacity: (!targetUrl.trim() || isDone) ? 0.45 : 1 }}
              >
                <Play size={15} fill="currentColor" />
                {isDone ? 'Scan Finished' : 'Start Scan'}
              </button>
            ) : (
              <button
                onClick={stop}
                className="btn-outline"
                style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)', borderColor: 'rgba(248,113,113,0.3)', background: 'var(--danger-bg)' }}
              >
                <Square size={13} fill="currentColor" /> Stop Scan
              </button>
            )}

            {(results.length > 0 || isDone) && (
              <button
                onClick={reset}
                className="btn-outline"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px', fontSize: '0.82rem', padding: '0.55rem 1rem' }}
              >
                <RotateCcw size={12} /> Reset
              </button>
            )}
          </div>

          {/* ═══ RIGHT: Output ═══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Stat tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>
              {STATS.map(({ label, val, icon: Icon, color }) => (
                <div
                  key={label}
                  className="stat-tile"
                  style={{
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: '1rem 1.1rem',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={13} style={{ color }} />
                    </div>
                    {isRunning && val > 0 && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, animation: 'liveGlow 1.5s ease infinite' }} />}
                  </div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                    <LiveNumber value={val} color={color} />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px', fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Results card */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>

              {/* shimmer beam while scanning */}
              {isRunning && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  backgroundImage: 'linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)',
                  animation: 'shimmer 1.5s linear infinite',
                  backgroundSize: '200% auto', zIndex: 2,
                }} />
              )}

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={14} style={{ color: 'var(--text-accent)' }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-display)' }}>Results</span>
                  {results.length > 0 && (
                    <span className="badge badge-neutral">{results.length}</span>
                  )}
                  {isRunning && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
                      <span className="live-dot" style={{ width: '5px', height: '5px' }} /> streaming
                    </span>
                  )}
                </div>
                {results.some(r => r.vulnerability) && (
                  <button
                    onClick={() => setFilterVuln(v => !v)}
                    className={filterVuln ? 'badge badge-red' : 'badge badge-neutral'}
                    style={{ border: filterVuln ? '1px solid rgba(248,113,113,0.35)' : '1px solid var(--border)', cursor: 'pointer', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <AlertTriangle size={9} />
                    {filterVuln ? 'Vulns only' : 'All results'}
                  </button>
                )}
              </div>

              {/* Table header */}
              {results.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 70px 1fr', gap: 0, padding: '0.45rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface-2)' }}>
                  {['#', 'Path', 'Status', 'Finding'].map(h => (
                    <span key={h} style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: 'var(--font-mono)' }}>{h}</span>
                  ))}
                </div>
              )}

              {/* Rows or empty state */}
              <div style={{ maxHeight: '460px', overflowY: 'auto' }}>
                {displayed.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', gap: '0.85rem', textAlign: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Shield size={22} style={{ color: 'var(--text-accent)', opacity: 0.6 }} />
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', margin: '0 0 3px' }}>
                        {isRunning ? 'Scan running…' : 'Configure & start a scan'}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0 }}>
                        {isRunning ? 'Results will appear here in real time' : 'Enter a target URL and click Start Scan'}
                      </p>
                    </div>
                  </div>
                ) : (
                  displayed.map((r, i) => (
                    <div
                      key={r.id || i}
                      className={`scanner-row${newIds.has(r.id) ? ' scanner-row-new' : ''}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '44px 1fr 70px 1fr',
                        gap: 0, padding: '0.55rem 1.25rem',
                        borderBottom: '1px solid var(--border)',
                        alignItems: 'center',
                        background: r.vulnerability ? 'rgba(248,113,113,0.03)' : 'transparent',
                        animation: newIds.has(r.id) ? 'rowSlide 0.25s ease' : 'none',
                      }}
                    >
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{results.length - i}</span>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: r.vulnerability ? 'var(--text-primary)' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '12px' }}>{r.path}</span>
                      <StatusBadge code={r.status} />
                      <div style={{ paddingLeft: '8px' }}><SeverityBadge vuln={r.vulnerability} /></div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media(max-width:900px){
            [data-scanner-grid]{grid-template-columns:1fr!important;}
            [data-stat-grid]{grid-template-columns:repeat(2,1fr)!important;}
          }
        `}</style>
      </div>
    </div>
  )
}
