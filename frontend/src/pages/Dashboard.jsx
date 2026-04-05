import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useResponsive } from '../hooks/useResponsive'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import {
  Shield, Target, FileText, AlertTriangle, Play, Clock,
  CheckCircle, XCircle, TrendingUp, RefreshCw, Activity,
  ArrowUpRight, Zap
} from 'lucide-react'
import { statsAPI } from '../utils/api'
import { useAuth } from '../hooks/useAuth'

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#fbbf24',
  low:      '#22c55e',
}

const STATUS_META = {
  completed: { color: '#22c55e',  label: 'Completed' },
  running:   { color: '#22d3ee',  label: 'Running'   },
  failed:    { color: '#ef4444',  label: 'Failed'    },
  aborted:   { color: '#f97316',  label: 'Aborted'   },
  queued:    { color: '#a78bfa',  label: 'Queued'    },
}

const FALLBACK_STATS = {
  totalScans: 12, completedScans: 9, runningScans: 0, totalReports: 7,
  vulnerabilities: { critical: 3, high: 5, medium: 8, low: 12 },
  recentScans: [
    { _id: '1', targetUrl: 'https://example.com',   status: 'completed', scanMode: 'Directory', stats: { vulns: 2 }, createdAt: new Date().toISOString() },
    { _id: '2', targetUrl: 'https://test-api.com',  status: 'completed', scanMode: 'Vuln',      stats: { vulns: 5 }, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { _id: '3', targetUrl: 'https://staging.app',   status: 'failed',    scanMode: 'Deep',      stats: { vulns: 0 }, createdAt: new Date(Date.now() - 172800000).toISOString() },
  ],
  scanActivity: [
    { _id: 'Mon', count: 2 }, { _id: 'Tue', count: 4 }, { _id: 'Wed', count: 1 },
    { _id: 'Thu', count: 6 }, { _id: 'Fri', count: 3 }, { _id: 'Sat', count: 5 },
    { _id: 'Sun', count: 2 },
  ],
}

function StatCard({ icon: Icon, label, value, color, sub, trend }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: `${color}15`,
          border: `1px solid ${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} style={{ color }} />
        </div>
        {trend && (
          <span style={{
            fontSize: '0.7rem', color: 'var(--text-accent)',
            background: 'var(--accent-light)', border: '1px solid var(--border-accent)',
            borderRadius: '6px', padding: '2px 7px', display: 'flex', alignItems: 'center', gap: '2px'
          }}>
            <ArrowUpRight size={10} /> {trend}
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>
          {value ?? '—'}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
      </div>
    </div>
  )
}

function ScanRow({ scan }) {
  const navigate = useNavigate() 

  const meta = STATUS_META[scan.status] || STATUS_META.completed
  const vulns = scan.stats?.vulns || 0

  return (
    <div
      onClick={() => navigate(`/reports/${scan._id}`)} 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.85rem 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        transition: 'background 0.15s',
        cursor: 'pointer' 
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: meta.color,
        flexShrink: 0,
        boxShadow: `0 0 6px ${meta.color}80`
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.85rem',
          color: '#e5e7eb',
          fontFamily: 'monospace',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {scan.targetUrl}
        </div>

        <div style={{
          fontSize: '0.72rem',
          color: '#4b5563',
          marginTop: '2px'
        }}>
          {scan.scanMode} scan · {new Date(scan.createdAt).toLocaleString()}
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexShrink: 0
      }}>
        {vulns > 0 && (
          <span style={{
            fontSize: '0.7rem',
            color: '#fca5a5',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '6px',
            padding: '2px 8px'
          }}>
            {vulns} vulns
          </span>
        )}

        <span style={{
          fontSize: '0.75rem',
          color: meta.color,
          minWidth: '64px',
          textAlign: 'right'
        }}>
          {meta.label}
        </span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { isMobile, isTablet } = useResponsive()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await statsAPI.dashboard()
      setData(res.data)
      setOffline(false)
    } catch {
      setData(FALLBACK_STATS)
      setOffline(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  const d = data || FALLBACK_STATS
  const totalVulns = Object.values(d.vulnerabilities || {}).reduce((a, b) => a + b, 0)

  const vulnPieData = Object.entries(d.vulnerabilities || {})
    .filter(([k]) => ['critical', 'high', 'medium', 'low'].includes(k))
    .map(([k, v]) => ({ name: k, value: v, color: SEVERITY_COLORS[k] }))

  const activityData = (d.scanActivity || []).map(a => ({
    day: a._id?.slice(-3) || '',
    scans: a.count,
  }))

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          border: '2px solid var(--accent)', borderTopColor: 'transparent',
          animation: 'spin 0.7s linear infinite'
        }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace' }}>Loading dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: '80px', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: isMobile ? 'stretch' : 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
          paddingBottom: '2rem', marginBottom: '2rem',
          borderBottom: '1px solid var(--border)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div className="live-dot" />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-accent)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {offline ? 'Demo Mode' : 'Live'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}>
              Welcome back, <span style={{ color: 'var(--text-accent)' }}>{user?.username || 'Analyst'}</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              {offline ? 'Backend offline — showing demo data' : 'Your security testing overview'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={fetchStats}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '0.45rem 0.9rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '10px', color: 'var(--text-secondary)',
                fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
            <NavLink to="/scanner" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '0.45rem 1rem',
              background: 'var(--accent)',
              borderRadius: '10px', color: '#fff',
              fontSize: '0.85rem', fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.2s',
              boxShadow: 'var(--shadow-accent)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)' }}
            >
              <Zap size={13} /> New Scan
            </NavLink>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <StatCard icon={Target}        label="Total scans"      value={d.totalScans}     color="#22c55e" trend="+12%" />
          <StatCard icon={CheckCircle}   label="Completed"        value={d.completedScans} color="#22d3ee" />
          <StatCard icon={AlertTriangle} label="Vulnerabilities"  value={totalVulns}       color="#ef4444" trend="3 new" />
          <StatCard icon={FileText}      label="Reports"          value={d.totalReports}   color="#a78bfa" />
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 320px', gap: '1rem', marginBottom: '1.5rem' }}>

          {/* Bar Chart */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Activity size={14} style={{ color: 'var(--text-accent)' }} />
              <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>Scan Activity</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>Last 7 days</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={activityData} barSize={18}>
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={20} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: 'var(--text-muted)' }}
                  itemStyle={{ color: 'var(--text-accent)' }}
                  cursor={{ fill: 'var(--bg-hover)' }}
                />
                <Bar dataKey="scans" fill="rgba(99,102,241,0.4)" radius={[4, 4, 0, 0]} activeBar={{ fill: '#6366f1' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Shield size={14} style={{ color: 'var(--danger)' }} />
              <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>Vulnerabilities</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={vulnPieData} cx="50%" cy="50%" innerRadius={32} outerRadius={55} dataKey="value" paddingAngle={3}>
                  {vulnPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v, n) => [v, n.toUpperCase()]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '0.75rem' }}>
              {vulnPieData.map(v => (
                <div key={v.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: v.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'capitalize', flex: 1 }}>{v.name}</span>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: v.color }}>{v.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Scans */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={14} style={{ color: 'var(--text-accent)' }} />
              <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>Recent Scans</span>
            </div>
            <NavLink to="/scanner" style={{
              fontSize: '0.75rem', color: 'var(--text-accent)',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px'
            }}>
              New scan <ArrowUpRight size={11} />
            </NavLink>
          </div>

          {!d.recentScans?.length ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <Target size={28} style={{ color: 'var(--border-accent)', margin: '0 auto 0.75rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>No scans yet</p>
              <NavLink to="/scanner" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '0.5rem 1.25rem', background: 'var(--accent)',
                borderRadius: '8px', color: '#fff', fontWeight: 600,
                fontSize: '0.85rem', textDecoration: 'none'
              }}>
                <Play size={13} /> Start your first scan
              </NavLink>
            </div>
          ) : (
            d.recentScans.map(scan => <ScanRow key={scan._id} scan={scan} />)
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .chart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}