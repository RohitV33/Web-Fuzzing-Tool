import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText, Download, AlertTriangle, CheckCircle, Info, XCircle, Search, TrendingUp, Trash2, RefreshCw } from 'lucide-react'
import { reportsAPI } from '../utils/api'
import { useAuth } from '../hooks/useAuth'

const SEVERITY_CONFIG = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)',  icon: XCircle,       label: 'CRITICAL' },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)', icon: AlertTriangle, label: 'HIGH'     },
  medium:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', icon: Info,          label: 'MEDIUM'   },
  low:      { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  icon: CheckCircle,   label: 'LOW'      },
}

const SAMPLE_REPORT = {
  _id: 'demo',
  title: 'Demo Security Report — example.com',
  target: 'https://example.com',
  createdAt: new Date().toISOString(),
  summary: { critical: 2, high: 3, medium: 2, low: 1, riskScore: 8.4 },
  findings: [
    { type: 'SQL Injection', severity: 'critical', url: 'https://example.com/login', path: '/login', parameter: 'username', payload: "' OR '1'='1", status: 200, description: 'Login form is vulnerable to SQL injection — authentication can be bypassed.', recommendation: 'Use parameterized queries. Validate and sanitize all user inputs.', cve: 'CWE-89', timestamp: new Date().toISOString() },
    { type: 'Cross-Site Scripting', severity: 'high', url: 'https://example.com/search', path: '/search', parameter: 'q', payload: '<script>alert(document.cookie)</script>', status: 200, description: 'Reflected XSS — search input is echoed unsanitized in the response.', recommendation: 'Encode all output. Implement Content Security Policy (CSP).', cve: 'CWE-79', timestamp: new Date().toISOString() },
    { type: 'Local File Inclusion', severity: 'critical', url: 'https://example.com/file?path=../../../../etc/passwd', path: '/file', parameter: 'path', payload: '../../../../etc/passwd', status: 200, description: 'LFI vulnerability allows reading sensitive server files like /etc/passwd.', recommendation: 'Whitelist allowed file paths. Never use user input in file operations.', cve: 'CWE-22', timestamp: new Date().toISOString() },
    { type: 'Sensitive File Exposure', severity: 'high', url: 'https://example.com/.env', path: '/.env', payload: null, status: 200, description: '.env file is publicly accessible, exposing credentials.', recommendation: 'Block access to .env via server config. Use a secrets vault.', cve: 'CWE-200', timestamp: new Date().toISOString() },
    { type: 'Directory Listing', severity: 'medium', url: 'https://example.com/uploads/', path: '/uploads/', payload: null, status: 200, description: 'Directory listing exposes file names and structure.', recommendation: 'Disable directory listing in web server config.', cve: 'CWE-548', timestamp: new Date().toISOString() },
    { type: 'Error Disclosure', severity: 'medium', url: 'https://example.com/api/users/0', path: '/api/users/0', payload: null, status: 500, description: 'Server returns stack traces on error, leaking internals.', recommendation: 'Use generic error pages in production. Disable debug mode.', cve: 'CWE-209', timestamp: new Date().toISOString() },
    { type: 'Admin Panel Exposed', severity: 'high', url: 'https://example.com/admin', path: '/admin', payload: null, status: 200, description: 'Admin panel is publicly reachable without IP restriction.', recommendation: 'Restrict by IP whitelist. Enforce MFA for admin.', cve: 'CWE-284', timestamp: new Date().toISOString() },
    { type: 'Insecure HTTP Method', severity: 'low', url: 'https://example.com/api/data', path: '/api/data', payload: null, status: 200, description: 'PUT/DELETE allowed without authentication.', recommendation: 'Restrict HTTP methods. Require auth for write operations.', cve: 'CWE-749', timestamp: new Date().toISOString() },
  ],
}

function SeverityBadge({ severity }) {
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.low
  return <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
}

function FindingCard({ f, idx, expanded, onToggle }) {
  const cfg = SEVERITY_CONFIG[f.severity] || SEVERITY_CONFIG.low
  const Icon = cfg.icon
  return (
    <div className="rounded-xl border transition-all duration-200 overflow-hidden" style={{ borderColor: expanded ? cfg.border : 'rgba(34,197,94,0.08)', background: 'rgba(10,26,36,0.7)' }}>
      <button onClick={onToggle} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-green-500 hover:bg-opacity-3 transition-colors">
        <Icon size={18} style={{ color: cfg.color, flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">{f.type}</span>
            <SeverityBadge severity={f.severity} />
            {f.cve && <span className="badge badge-cyan">{f.cve}</span>}
          </div>
          <div className="font-mono text-xs text-slate-500 mt-0.5 truncate">{f.path}</div>
        </div>
        <span className="text-slate-500 text-xs flex-shrink-0">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="px-5 pb-5 border-t border-green-500 border-opacity-5 pt-4 space-y-4">
          <div>
            <div className="text-xs text-slate-500 font-mono mb-1">AFFECTED URL</div>
            <code className="text-xs text-slate-300 px-3 py-2 rounded-lg block break-all font-mono" style={{ background: 'rgba(6,16,24,0.8)' }}>{f.url}</code>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 font-mono mb-1">DESCRIPTION</div>
              <p className="text-sm text-slate-300 leading-relaxed">{f.description}</p>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-mono mb-1">RECOMMENDATION</div>
              <p className="text-sm text-slate-300 leading-relaxed">{f.recommendation}</p>
            </div>
          </div>
          {f.payload && (
            <div>
              <div className="text-xs text-slate-500 font-mono mb-1">PAYLOAD</div>
              <code className="text-xs text-yellow-400 bg-yellow-400 bg-opacity-5 px-3 py-2 rounded-lg block font-mono">{f.payload}</code>
            </div>
          )}
          <div className="flex items-center gap-4 text-xs font-mono flex-wrap">
            {f.parameter && <span className="text-slate-500">Parameter: <span className="text-slate-300">{f.parameter}</span></span>}
            {f.status    && <span className="text-slate-500">Status: <span style={{ color: cfg.color }}>{f.status}</span></span>}
            {f.cve       && <span className="text-slate-500">CWE: <span className="text-cyan-400">{f.cve}</span></span>}
          </div>
        </div>
      )}
    </div>
  )
}

function ReportDetail({ report, onBack, onDelete }) {
  const [filter,   setFilter]   = useState('all')
  const [search,   setSearch]   = useState('')
  const [expanded, setExpanded] = useState(null)
  const findings = report.findings || []
  const s = report.summary || {}

  const filtered = findings.filter(f => {
    const matchSev    = filter === 'all' || f.severity === filter
    const matchSearch = !search || f.type.toLowerCase().includes(search.toLowerCase()) || (f.path||'').includes(search)
    return matchSev && matchSearch
  })

  const exportReport = (fmt) => {
    let content, type, ext
    if (fmt === 'json') {
      content = JSON.stringify({ title: report.title, target: report.target, generated: report.createdAt, summary: s, findings }, null, 2)
      type = 'application/json'; ext = 'json'
    } else {
      const headers = 'Type,Severity,Path,Status,CWE\n'
      const rows = findings.map(f => `"${f.type}",${f.severity},"${f.path}",${f.status||''},"${f.cve||''}"`).join('\n')
      content = headers + rows; type = 'text/csv'; ext = 'csv'
    }
    const blob = new Blob([content], { type })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url; a.download = `vulnscan-report.${ext}`; a.click()
    URL.revokeObjectURL(url)
  }

  const handleExport = async (fmt) => {
    if (report._id === 'demo') { exportReport(fmt); return }
    try {
      const res = await reportsAPI.export(report._id, fmt)
      const blob = new Blob([fmt === 'csv' ? res.data : JSON.stringify(res.data, null, 2)], { type: fmt === 'csv' ? 'text/csv' : 'application/json' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a'); a.href = url; a.download = `vulnscan-report.${fmt}`; a.click()
      URL.revokeObjectURL(url)
    } catch { exportReport(fmt) }
  }

  return (
    <>
      <div className="py-8 border-b border-green-500 border-opacity-10 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <button onClick={onBack} className="text-slate-500 hover:text-green-400 transition-colors text-sm font-mono">← back</button>
              <h2 className="text-xl font-bold font-display gradient-text">{report.title}</h2>
              {report._id === 'demo' && <span className="badge badge-yellow">DEMO</span>}
            </div>
            <p className="text-slate-500 text-sm"><span className="text-green-400">{report.target}</span> · {new Date(report.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            {onDelete && report._id !== 'demo' && (
              <button onClick={() => onDelete(report._id)} className="btn-outline text-sm py-2 px-4" style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}>
                <Trash2 size={14} /> Delete
              </button>
            )}
            <button onClick={() => handleExport('csv')}  className="btn-outline text-sm py-2 px-4"><Download size={14} /> CSV</button>
            <button onClick={() => handleExport('json')} className="btn-primary text-sm py-2 px-4"><Download size={14} /> JSON</button>
          </div>
        </div>
      </div>

      {/* Severity cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {['critical','high','medium','low'].map(sev => {
          const cfg = SEVERITY_CONFIG[sev]; const Icon = cfg.icon
          return (
            <div key={sev} className="stat-card cursor-pointer transition-all" onClick={() => setFilter(filter===sev?'all':sev)} style={filter===sev?{borderColor:cfg.color,boxShadow:`0 0 20px ${cfg.bg}`}:{}}>
              <div className="flex items-center justify-between mb-2"><Icon size={16} style={{color:cfg.color}}/><span className="text-xl font-bold font-mono" style={{color:cfg.color}}>{s[sev]||0}</span></div>
              <div className="text-xs font-mono font-semibold" style={{color:cfg.color}}>{cfg.label}</div>
            </div>
          )
        })}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><TrendingUp size={16} color="#f97316"/><span className="text-xl font-bold font-mono text-orange-400">{s.riskScore||'—'}</span></div>
          <div className="text-xs text-slate-500">Risk / 10</div>
        </div>
      </div>

      {/* Distribution bars */}
      <div className="feature-card !p-5 mb-8">
        <div className="flex items-center gap-2 mb-4"><TrendingUp size={15} color="#22c55e"/><span className="text-sm font-semibold text-white">Severity Distribution</span></div>
        <div className="space-y-3">
          {['critical','high','medium','low'].map(sev => {
            const cfg = SEVERITY_CONFIG[sev]
            const pct = findings.length ? Math.min(((s[sev]||0)/findings.length)*100,100) : 0
            return (
              <div key={sev} className="flex items-center gap-3">
                <span className="text-xs font-mono w-16" style={{color:cfg.color}}>{cfg.label}</span>
                <div className="flex-1 progress-bar"><div className="progress-fill animate" style={{transform:`scaleX(${pct/100})`,background:`linear-gradient(90deg,${cfg.color},${cfg.color}99)`}}/></div>
                <span className="text-xs font-mono text-slate-500 w-6 text-right">{s[sev]||0}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
          <input className="cyber-input !pl-8" placeholder="Search findings…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all','critical','high','medium','low'].map(sv => (
            <button key={sv} onClick={()=>setFilter(sv)} className={`text-xs px-3 py-2 rounded-lg border transition-all capitalize ${filter===sv?'border-green-500 bg-green-500 bg-opacity-10 text-green-400':'border-slate-700 border-opacity-50 text-slate-500 hover:text-slate-300'}`}>{sv}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length===0
          ? <div className="text-center py-12 text-slate-600 text-sm">No findings match your filter.</div>
          : filtered.map((f,i)=><FindingCard key={i} f={f} idx={i} expanded={expanded===i} onToggle={()=>setExpanded(expanded===i?null:i)}/>)
        }
      </div>

      {findings.length>0 && (
        <div className="feature-card !p-0 overflow-hidden mt-8">
          <div className="px-5 py-4 border-b border-green-500 border-opacity-8"><span className="text-sm font-semibold text-white">Summary Table ({findings.length} findings)</span></div>
          <div className="overflow-x-auto">
            <table className="report-table">
              <thead><tr><th>#</th><th>Type</th><th>Severity</th><th>Path</th><th>Status</th><th>CWE</th></tr></thead>
              <tbody>
                {findings.map((f,i)=>(
                  <tr key={i}>
                    <td className="font-mono text-slate-600 text-xs">{i+1}</td>
                    <td className="text-slate-300 text-sm">{f.type}</td>
                    <td><SeverityBadge severity={f.severity}/></td>
                    <td className="font-mono text-xs text-slate-400">{f.path}</td>
                    <td className="font-mono text-xs" style={{color:f.status===200?'#22c55e':f.status>=500?'#ef4444':'#fbbf24'}}>{f.status||'—'}</td>
                    <td>{f.cve&&<span className="badge badge-cyan">{f.cve}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

export default function Reports() {
  const { user } = useAuth()
  const { id: routeId } = useParams()          // scan ID from /reports/:id
  const navigate = useNavigate()
  const [reports,  setReports]  = useState([])
  const [selected, setSelected] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [offline,  setOffline]  = useState(false)

  const fetchReports = async () => {
    if (!user) { setReports([SAMPLE_REPORT]); setLoading(false); setOffline(true); return }
    setLoading(true)
    try {
      const res  = await reportsAPI.list()
      const list = res.data.reports || []
      setReports(list.length > 0 ? list : [SAMPLE_REPORT])
      setOffline(list.length === 0)
    } catch { setReports([SAMPLE_REPORT]); setOffline(true) }
    finally  { setLoading(false) }
  }

  // Auto-open report when navigated from Dashboard via /reports/:scanId
  useEffect(() => {
    if (!routeId || !user) return
    reportsAPI.getByScanId(routeId)
      .then(res => setSelected(res.data))
      .catch(() => {
        // Report not found for this scan — just show the list
        navigate('/reports', { replace: true })
      })
  }, [routeId, user])

  useEffect(() => { fetchReports() }, [user])

  const openReport = async (r) => {
    if (r._id === 'demo' || !user) { setSelected(SAMPLE_REPORT); return }
    try { const res = await reportsAPI.get(r._id); setSelected(res.data) }
    catch { setSelected(r) }
  }

  const deleteReport = async (id) => {
    try { await reportsAPI.delete(id); setReports(p=>p.filter(r=>r._id!==id)); setSelected(null) } catch {}
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20" style={{background:'#020b0f'}}>
      <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  return (
    <div className="min-h-screen pt-20 px-4 md:px-6 pb-12" style={{background:'#020b0f'}}>
      <div className="max-w-6xl mx-auto">
        {selected ? (
          <ReportDetail report={selected} onBack={()=>{ setSelected(null); if (routeId) navigate('/reports', { replace: true }) }} onDelete={deleteReport}/>
        ) : (
          <>
            <div className="py-8 border-b border-green-500 border-opacity-10 mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20 flex items-center justify-center"><FileText size={16} color="#22c55e"/></div>
                    <h1 className="text-2xl font-bold font-display gradient-text">Scan Reports</h1>
                  </div>
                  <p className="text-slate-500 text-sm">{offline ? '⚠️ Demo mode — sign in and run a scan to see real reports.' : `${reports.length} report${reports.length!==1?'s':''}`}</p>
                </div>
                <button onClick={fetchReports} className="btn-outline text-sm py-2 px-4"><RefreshCw size={14}/> Refresh</button>
              </div>
            </div>

            <div className="space-y-3">
              {reports.map(r => {
                const s = r.summary || {}
                const total = (s.critical||0)+(s.high||0)+(s.medium||0)+(s.low||0)
                return (
                  <div key={r._id} className="feature-card cursor-pointer !p-5" onClick={()=>openReport(r)}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className="font-semibold text-white">{r.title}</span>
                          {r._id==='demo'&&<span className="badge badge-yellow">DEMO</span>}
                        </div>
                        <div className="font-mono text-xs text-slate-500 truncate">{r.target}</div>
                        <div className="text-xs text-slate-600 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
                        {s.critical>0&&<span className="badge badge-red">{s.critical} critical</span>}
                        {s.high>0&&<span className="badge" style={{background:'rgba(249,115,22,0.12)',color:'#f97316',border:'1px solid rgba(249,115,22,0.3)'}}>{s.high} high</span>}
                        {total===0&&<span className="badge badge-green">Clean</span>}
                        {s.riskScore&&<span className="font-mono text-xs text-orange-400">Risk: {s.riskScore}/10</span>}
                        <span className="text-green-400 text-sm">View →</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
