import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useResponsive } from '../hooks/useResponsive'
import { Target, Github, Shield, Zap, Search, ArrowRight, CheckCircle } from 'lucide-react'

/* ── Google colour icon ── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.2 29.2 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.8l5.7-5.7C33.7 7.2 29.1 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c2.8 0 5.3 1 7.2 2.8l5.7-5.7C33.7 7.2 29.1 5 24 5 16.3 5 9.7 9.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 45c5 0 9.6-1.9 13-5l-6-5.2C29.3 36.5 26.8 37.5 24 37.5c-5.1 0-9.5-2.7-11.1-6.9l-6.5 5C9.5 40.7 16.2 45 24 45z"/>
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6 5.2C42.5 34.8 44 30.1 44 25c0-1.3-.1-2.6-.4-3.9z"/>
  </svg>
)

/* ── Mock scan data that animates in the preview panel ── */
const MOCK_RESULTS = [
  { status: 200, path: '/admin',        vuln: true,  size: '1.2 KB' },
  { status: 200, path: '/api/v1/users', vuln: false, size: '3.8 KB' },
  { status: 301, path: '/dashboard',   vuln: false, size: '0.4 KB' },
  { status: 403, path: '/config',      vuln: false, size: '0.1 KB' },
  { status: 200, path: '/.env',        vuln: true,  size: '2.1 KB' },
]

const STATUS_COLORS = { 200: '#4ade80', 301: '#fbbf24', 403: '#f87171' }

function ScanPreview() {
  const rowsRef = useRef(null)
  useEffect(() => {
    let idx = 0
    const tick = () => {
      if (!rowsRef.current) return
      if (idx >= MOCK_RESULTS.length) return
      const r = MOCK_RESULTS[idx++]
      const row = document.createElement('div')
      row.style.cssText = `
        display:flex; align-items:center; gap:10px;
        padding:5px 0; border-bottom:1px solid rgba(255,255,255,0.05);
        opacity:0; transform:translateY(6px);
        transition:all 0.35s ease; font-size:0.72rem;
        font-family:'JetBrains Mono',monospace;
      `
      row.innerHTML = `
        <span style="min-width:30px;font-weight:700;color:${STATUS_COLORS[r.status] || '#94a3b8'}">${r.status}</span>
        <span style="flex:1;color:rgba(255,255,255,0.65)">${r.path}</span>
        ${r.vuln ? '<span style="color:#f87171;font-size:0.62rem;background:rgba(248,113,113,0.12);border:1px solid rgba(248,113,113,0.25);border-radius:4px;padding:1px 5px;font-weight:700">VULN</span>' : ''}
        <span style="color:rgba(255,255,255,0.3);font-size:0.65rem">${r.size}</span>
      `
      rowsRef.current.appendChild(row)
      requestAnimationFrame(() => { row.style.opacity = '1'; row.style.transform = 'translateY(0)' })
      if (idx < MOCK_RESULTS.length) setTimeout(tick, 700)
    }
    const t = setTimeout(tick, 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      background: 'rgba(9,9,11,0.7)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '14px',
      overflow: 'hidden',
      backdropFilter: 'blur(12px)',
    }}>
      {/* terminal bar */}
      <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.03)' }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#ef4444' }} />
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#fbbf24' }} />
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#4ade80' }} />
        <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.7rem', marginLeft:6, fontFamily:'JetBrains Mono,monospace' }}>fuzzer ~ scan in progress</span>
        <span style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', display:'inline-block', animation:'pulse 1.5s infinite' }} />
          <span style={{ color:'#4ade80', fontSize:'0.65rem', fontFamily:'JetBrains Mono,monospace' }}>LIVE</span>
        </span>
      </div>
      {/* cmd line */}
      <div style={{ padding:'8px 14px 4px', fontFamily:'JetBrains Mono,monospace', fontSize:'0.72rem' }}>
        <span style={{ color:'#6366f1' }}>$</span>
        <span style={{ color:'rgba(255,255,255,0.5)', marginLeft:6 }}>vulnscan --target https://target.io --threads 20</span>
      </div>
      {/* rows */}
      <div ref={rowsRef} style={{ padding:'4px 14px 12px', maxHeight:130, overflow:'hidden' }} />
    </div>
  )
}

/* ── Floating stat chips ── */
const CHIPS = [
  { icon: Shield, label: '0 Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', top:'18%', left:'2%',  delay:'0s'  },
  { icon: Search, label: '200+ Payloads', color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)', top:'62%', left:'0%', delay:'1.5s' },
  { icon: Zap,    label: '500 req/s',     color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)', top:'78%', right:'5%', delay:'3s'  },
]

const TRUST = [
  'Zero passwords stored',
  'OAuth 2.0 secured',
  'Open-source & free',
]

export default function AuthPage() {
  const { isMobile, isTablet } = useResponsive()
  const handleGoogle = () => { window.location.href = '/api/auth/google' }
  const handleGithub = () => { window.location.href = '/api/auth/github' }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr',
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    }}>

      {/* ══════════════════════════════════════
          LEFT  –  visual / branding panel (hidden on mobile)
      ══════════════════════════════════════ */}
      {!isTablet && <div style={{
        position: 'relative',
        background: 'linear-gradient(145deg, #0b0b1a 0%, #0f0f2e 40%, #0d0d1f 100%)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem 3rem 3rem 3.5rem',
        overflow: 'hidden',
      }}>

        {/* grid texture */}
        <div style={{
          position:'absolute', inset:0, opacity:0.07,
          backgroundImage:`
            linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)
          `,
          backgroundSize:'44px 44px',
          pointerEvents:'none',
        }} />

        {/* decorative orbs */}
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'340px', height:'340px', borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)', pointerEvents:'none', animation:'float 11s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:'-60px', left:'-40px',  width:'280px', height:'280px', borderRadius:'50%', background:'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)', pointerEvents:'none', animation:'float 14s ease-in-out infinite 3s' }} />

        {/* floating stat chips */}
        {CHIPS.map(c => (
          <div key={c.label} style={{
            position:'absolute', top:c.top, left:c.left, right:c.right,
            display:'flex', alignItems:'center', gap:8,
            padding:'8px 14px',
            background:c.bg, border:`1px solid ${c.border}`,
            borderRadius:12, backdropFilter:'blur(10px)',
            animation:`float 6s ease-in-out infinite ${c.delay}`,
            zIndex:10, width:'fit-content',
          }}>
            <c.icon size={13} style={{ color:c.color }} />
            <span style={{ color:'rgba(255,255,255,0.85)', fontSize:'0.75rem', fontWeight:600, whiteSpace:'nowrap' }}>{c.label}</span>
          </div>
        ))}

        {/* main content */}
        <div style={{ position:'relative', zIndex:5 }}>
          {/* logo */}
          <NavLink to="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none', marginBottom:'2.5rem' }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'#6366f1', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 18px rgba(99,102,241,0.45)' }}>
              <Target size={16} color="white" />
            </div>
            <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1rem', color:'white', letterSpacing:'-0.02em' }}>
              Vuln<span style={{ color:'#a5b4fc' }}>Scan</span>
            </span>
          </NavLink>

          {/* headline */}
          <h1 style={{
            fontFamily:'Syne,sans-serif',
            fontSize:'clamp(2rem, 4vw, 2.8rem)',
            fontWeight:800, lineHeight:1.1,
            letterSpacing:'-0.04em',
            color:'white',
            marginBottom:'1rem',
          }}>
            Find flaws<br />
            <span style={{
              background:'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            }}>before attackers do.</span>
          </h1>

          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.9rem', lineHeight:1.75, marginBottom:'2.5rem', maxWidth:340 }}>
            A professional-grade scanner that enumerates hidden endpoints, detects injection flaws,
            and delivers actionable security reports in seconds.
          </p>

          {/* scan preview terminal */}
          <ScanPreview />

          {/* trust row */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', marginTop:'1.5rem' }}>
            {TRUST.map(t => (
              <div key={t} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <CheckCircle size={12} style={{ color:'#4ade80', flexShrink:0 }} />
                <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.75rem' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* bottom label */}
        <div style={{ position:'absolute', bottom:'1.5rem', left:'3.5rem' }}>
          <span style={{ color:'rgba(255,255,255,0.18)', fontSize:'0.7rem', fontFamily:'JetBrains Mono,monospace' }}>v2.0.0 · MIT License</span>
        </div>
      </div>}

      {/* ══════════════════════════════════════
          RIGHT  –  auth form panel
      ══════════════════════════════════════ */}
      <div style={{
        background: 'var(--bg-base)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '2rem 1.25rem' : '3rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
        minHeight: isTablet ? '100vh' : 'auto',
      }}>
        {/* subtle bg accent */}
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-40px', left:'-40px', width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div style={{ width:'100%', maxWidth:380, position:'relative', zIndex:1 }}>

          {/* eyebrow */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1.5rem' }}>
            <div style={{ flex:1, height:1, background:'var(--border)' }} />
            <span style={{ color:'var(--text-muted)', fontSize:'0.65rem', letterSpacing:'0.14em', fontFamily:'JetBrains Mono,monospace' }}>SECURE ACCESS</span>
            <div style={{ flex:1, height:1, background:'var(--border)' }} />
          </div>

          {/* heading */}
          <div style={{ marginBottom:'2.25rem' }}>
            <h2 style={{
              fontFamily:'Syne,sans-serif',
              fontSize:'2rem', fontWeight:800,
              letterSpacing:'-0.04em', lineHeight:1.15,
              color:'var(--text-primary)',
              marginBottom:'0.5rem',
            }}>
              Welcome back
            </h2>
            <p style={{ color:'var(--text-muted)', fontSize:'0.875rem', lineHeight:1.6 }}>
              Sign in to access your security testing dashboard and reports.
            </p>
          </div>

          {/* ── Auth buttons ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'2rem' }}>

            {/* Google */}
            <button
              id="btn-google-login"
              onClick={handleGoogle}
              style={{
                width:'100%', padding:'0.8rem 1.25rem',
                background:'var(--bg-surface)',
                border:'1px solid var(--border)',
                borderRadius:14,
                color:'var(--text-primary)',
                fontSize:'0.9rem', fontWeight:600,
                cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem',
                transition:'all 0.22s',
                fontFamily:"'Plus Jakarta Sans','Inter',sans-serif",
                letterSpacing:'-0.01em',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-hover)'; e.currentTarget.style.background='var(--bg-hover)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(0,0,0,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg-surface)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* GitHub */}
            <button
              id="btn-github-login"
              onClick={handleGithub}
              style={{
                width:'100%', padding:'0.8rem 1.25rem',
                background:'var(--bg-surface)',
                border:'1px solid var(--border)',
                borderRadius:14,
                color:'var(--text-primary)',
                fontSize:'0.9rem', fontWeight:600,
                cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem',
                transition:'all 0.22s',
                fontFamily:"'Plus Jakarta Sans','Inter',sans-serif",
                letterSpacing:'-0.01em',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-hover)'; e.currentTarget.style.background='var(--bg-hover)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(0,0,0,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg-surface)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
            >
              <Github size={18} />
              Continue with GitHub
            </button>
          </div>

          {/* Security notice */}
          <div style={{
            display:'flex', alignItems:'flex-start', gap:10,
            padding:'0.9rem 1rem',
            background:'var(--accent-light)',
            border:'1px solid var(--border-accent)',
            borderRadius:12,
            marginBottom:'2rem',
          }}>
            <Shield size={14} style={{ color:'var(--text-accent)', flexShrink:0, marginTop:2 }} />
            <div>
              <p style={{ color:'var(--text-accent)', fontSize:'0.75rem', fontWeight:700, marginBottom:2 }}>
                Zero-knowledge authentication
              </p>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.72rem', lineHeight:1.6 }}>
                We never store passwords. All sessions use OAuth 2.0 tokens with AES-256 encryption.
              </p>
            </div>
          </div>

          {/* Mini stats */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.5rem', marginBottom:'2rem' }}>
            {[
              { val:'10K+', label:'Scans run' },
              { val:'6',   label:'Vuln types' },
              { val:'MIT', label:'License' },
            ].map(s => (
              <div key={s.val} style={{
                textAlign:'center', padding:'0.75rem 0.5rem',
                background:'var(--bg-surface)',
                border:'1px solid var(--border)',
                borderRadius:12,
              }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.1rem', color:'var(--text-accent)', letterSpacing:'-0.03em' }}>{s.val}</div>
                <div style={{ color:'var(--text-muted)', fontSize:'0.65rem', marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Footer back link */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
            <NavLink
              to="/"
              style={{
                display:'flex', alignItems:'center', gap:5,
                color:'var(--text-muted)', fontSize:'0.8rem',
                textDecoration:'none', transition:'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color='var(--text-accent)'}
              onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}
            >
              Back to home <ArrowRight size={13} />
            </NavLink>
          </div>
        </div>
      </div>

      {/* ── Responsive: stack on mobile ── */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"],
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}