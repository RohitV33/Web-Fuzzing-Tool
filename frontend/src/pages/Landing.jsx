import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Shield, Search, Zap, FileText, Package, AlertTriangle,
  Play, ArrowRight, CheckCircle, Star, ChevronDown
} from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useResponsive } from '../hooks/useResponsive'

/* ─── Unsplash images ─── */
const TEAM_IMG = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop'

/* ─── Animated mock terminal ─── */
const SCAN_LINES = [
  { path: '/admin',          status: 200, vuln: true  },
  { path: '/api/v1/users',   status: 200, vuln: false },
  { path: '/.env',           status: 200, vuln: true  },
  { path: '/config.json',    status: 403, vuln: false },
  { path: '/dashboard',      status: 301, vuln: false },
  { path: '/backup.sql',     status: 200, vuln: true  },
]

const STATUS_COLOR = { 200:'#4ade80', 301:'#fbbf24', 403:'#f87171' }

function LiveTerminal() {
  const ref = useRef(null)
  useEffect(() => {
    let i = 0
    const tick = () => {
      if (!ref.current) return
      if (i >= SCAN_LINES.length) { i = 0; ref.current.innerHTML = '' }
      const r = SCAN_LINES[i++]
      const div = document.createElement('div')
      div.style.cssText = 'display:flex;align-items:center;gap:8px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.05);opacity:0;transform:translateY(4px);transition:all 0.3s'
      div.innerHTML = `
        <span style="min-width:28px;font-weight:700;font-size:0.72rem;color:${STATUS_COLOR[r.status]||'#94a3b8'}">${r.status}</span>
        <span style="flex:1;font-size:0.72rem;color:rgba(255,255,255,0.65);font-family:'JetBrains Mono',monospace">${r.path}</span>
        ${r.vuln ? '<span style="font-size:0.6rem;padding:1px 6px;border-radius:4px;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#f87171;font-weight:700">VULN</span>' : ''}
      `
      ref.current.appendChild(div)
      requestAnimationFrame(() => { div.style.opacity = '1'; div.style.transform = 'translateY(0)' })
      setTimeout(tick, 650)
    }
    const t = setTimeout(tick, 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ background:'rgba(9,9,11,0.85)', border:'1px solid rgba(99,102,241,0.25)', borderRadius:16, overflow:'hidden', backdropFilter:'blur(16px)' }}>
      {/* titlebar */}
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 14px', background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#ef4444' }} />
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#fbbf24' }} />
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e' }} />
        <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.68rem', marginLeft:8, fontFamily:'JetBrains Mono,monospace' }}>vulnscan — fuzzer</span>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', display:'inline-block', animation:'pulse 1.5s infinite' }} />
          <span style={{ color:'#22c55e', fontSize:'0.62rem', fontFamily:'JetBrains Mono,monospace' }}>SCANNING</span>
        </div>
      </div>
      {/* cmd */}
      <div style={{ padding:'8px 14px 4px', fontFamily:'JetBrains Mono,monospace', fontSize:'0.7rem' }}>
        <span style={{ color:'#818cf8' }}>$</span>
        <span style={{ color:'rgba(255,255,255,0.45)', marginLeft:6 }}>./vulnscan --target api.target.io --threads 20</span>
      </div>
      {/* results */}
      <div ref={ref} style={{ padding:'4px 14px 10px', maxHeight:140, overflow:'hidden' }} />
      {/* progress bar */}
      <div style={{ height:2, background:'rgba(255,255,255,0.05)' }}>
        <div style={{ height:'100%', background:'linear-gradient(90deg, #6366f1, #a78bfa)', width:'68%', animation:'progress-grow 3s ease-in-out infinite' }} />
      </div>
    </div>
  )
}

/* ─── Floating stat chip ─── */
function Chip({ icon: Icon, label, val, color, style }) {
  return (
    <div style={{
      position:'absolute', display:'flex', alignItems:'center', gap:8,
      padding:'8px 14px',
      background:'rgba(9,9,11,0.8)',
      border:'1px solid rgba(255,255,255,0.12)',
      borderRadius:12, backdropFilter:'blur(12px)',
      boxShadow:'0 8px 32px rgba(0,0,0,0.3)',
      animation:'float 7s ease-in-out infinite',
      zIndex:10, ...style,
    }}>
      <div style={{ width:28, height:28, borderRadius:8, background:`${color}20`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon size={13} style={{ color }} />
      </div>
      <div>
        <div style={{ color:'white', fontSize:'0.78rem', fontWeight:700, lineHeight:1 }}>{val}</div>
        <div style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.65rem', marginTop:2 }}>{label}</div>
      </div>
    </div>
  )
}

/* ─── Features ─── */
const FEATURES = [
  { icon: Search,        title:'Directory Fuzzing',    desc:'Enumerate hidden files, dirs, and endpoints using wordlist-based discovery with recursion.',            tags:['Recursive','Custom Wordlists'] },
  { icon: Shield,        title:'Vulnerability Detect', desc:'Automatically detect XSS, SQLi, LFI, SSRF using curated payload libraries and response analysis.',      tags:['XSS','SQLi','LFI','SSRF'] },
  { icon: Zap,           title:'Real-Time Streaming',  desc:'Watch scan results stream live with smart filtering, status code analysis, and timing metrics.',         tags:['WebSockets','Filtered'] },
  { icon: Package,       title:'Custom Payloads',      desc:'Choose from security-focused wordlists or upload your own. Supports multiple formats and payload types.', tags:['Built-in','Upload'] },
  { icon: AlertTriangle, title:'Severity Engine',      desc:'Pattern-match on responses to auto-detect anomalies and score findings by CVSS severity level.',          tags:['CVSS Scoring','Auto-Detect'] },
  { icon: FileText,      title:'Report Export',        desc:'Export detailed reports in JSON or CSV with severity levels, URLs, payloads, and remediation steps.',     tags:['JSON','CSV','PDF'] },
]

const STEPS = [
  { num:'01', title:'Configure Target',  desc:'Enter URL, select scan mode, set headers, auth tokens, and thread count.' },
  { num:'02', title:'Choose Wordlist',   desc:'Use built-in security wordlists or upload your own custom payload list.' },
  { num:'03', title:'Launch & Stream',   desc:'Fire concurrent requests and watch live results stream in real-time.' },
  { num:'04', title:'Analyze & Export',  desc:'Filter findings by severity and export comprehensive vulnerability reports.' },
]

const STATS = [
  { val:'200+', label:'Payloads built-in' },
  { val:'6',    label:'Vulnerability types' },
  { val:'500',  label:'Requests / second' },
  { val:'4',    label:'Export formats' },
]

export default function Landing() {
  useScrollReveal()
  const { isMobile, isTablet } = useResponsive()

  /* Parallax */
  const heroImgRef = useRef(null)
  const floatRef   = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (heroImgRef.current) heroImgRef.current.style.transform = `translateY(${y * 0.2}px)`
      if (floatRef.current)   floatRef.current.style.transform   = `translateY(${-y * 0.07}px)`
    }
    window.addEventListener('scroll', onScroll, { passive:true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Card glow on hover */
  useEffect(() => {
    const h = e => {
      const c = e.currentTarget
      const r = c.getBoundingClientRect()
      c.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%')
      c.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%')
    }
    const cards = document.querySelectorAll('.feature-card')
    cards.forEach(c => c.addEventListener('mousemove', h))
    return () => cards.forEach(c => c.removeEventListener('mousemove', h))
  }, [])

  return (
    <>
      <style>{`
        @keyframes progress-grow {
          0%   { width: 10% }
          50%  { width: 80% }
          100% { width: 10% }
        }
        @keyframes float {
          0%,100% { transform: translateY(0) }
          50%      { transform: translateY(-10px) }
        }
        @keyframes pulse {
          0%,100% { opacity:1 }
          50%      { opacity:0.3 }
        }
        @keyframes spin { to { transform: rotate(360deg) } }
        .hero-orb {
          position:absolute; border-radius:50%; pointer-events:none;
          animation: float 12s ease-in-out infinite;
        }
      `}</style>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{
        position:'relative', minHeight:'100vh', overflow:'hidden',
        display:'flex', alignItems:'center',
        paddingTop:60,
        background:'var(--bg-base)',
      }}>
        {/* Grid texture */}
        <div style={{
          position:'absolute', inset:0, opacity:0.035,
          backgroundImage:'linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)',
          backgroundSize:'52px 52px', pointerEvents:'none',
        }} />
        {/* Radial glow centre */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 55% at 30% 50%, rgba(99,102,241,0.09) 0%, transparent 70%)', pointerEvents:'none' }} />
        {/* Gradient bottom fade */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'30%', background:'linear-gradient(to bottom, transparent, var(--bg-base))', pointerEvents:'none' }} />

        <div ref={floatRef} style={{ position:'relative', zIndex:5, width:'100%', maxWidth:1200, margin:'0 auto', padding: isMobile ? '5rem 1.25rem 4rem' : '5rem 2rem', display:'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr', gap: isTablet ? '3rem' : '4rem', alignItems:'center' }}>

          {/* ── Left: copy ── */}
          <div className="reveal">
            {/* Eyebrow */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1.5rem' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', display:'inline-block', animation:'pulse 1.5s infinite', flexShrink:0 }} />
              <span style={{ color:'var(--text-muted)', fontSize:'0.72rem', letterSpacing:'0.12em', fontFamily:'JetBrains Mono,monospace', textTransform:'uppercase' }}>Advanced Web Security Platform</span>
            </div>

            {/* Headline – single line per word, no wrapping issue */}
            <h1 style={{
              fontFamily:'Syne, sans-serif', fontWeight:800,
              fontSize: isMobile ? '2.4rem' : isTablet ? '3.2rem' : '3.8rem',
              letterSpacing:'-0.04em', lineHeight:1.08,
              marginBottom:'1.5rem', color:'var(--text-primary)',
            }}>
              Detect flaws<br />
              <span style={{
                background:'linear-gradient(135deg, #818cf8 0%, #c084fc 60%, #818cf8 100%)',
                backgroundSize:'200% auto',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                animation:'gradient-shift 4s linear infinite',
              }}>before attackers.</span>
            </h1>

            <p style={{ color:'var(--text-secondary)', fontSize: isMobile ? '1rem' : '1.05rem', lineHeight:1.75, marginBottom:'2rem', maxWidth:480 }}>
              Professional-grade vulnerability scanning and directory fuzzing for security researchers.
              Configure once, scan continuously, get actionable results in seconds.
            </p>

            {/* Trust pills */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'2rem' }}>
              {['No setup needed', 'Real-time results', 'Free to use', 'Instant reports'].map(t => (
                <span key={t} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 12px', background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:999, color:'var(--text-secondary)', fontSize:'0.78rem' }}>
                  <CheckCircle size={11} style={{ color:'var(--success)' }} /> {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
              <NavLink to="/scanner" style={{
                display:'flex', alignItems:'center', gap:8,
                padding:'0.75rem 1.75rem', background:'var(--accent)',
                borderRadius:12, color:'#fff', fontWeight:700,
                fontSize:'0.95rem', textDecoration:'none',
                boxShadow:'0 4px 20px var(--accent-glow)',
                transition:'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--accent-hover)'; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--accent)'; e.currentTarget.style.transform='translateY(0)' }}>
                <Play size={15} fill="white" /> Launch Scanner
              </NavLink>
              <NavLink to="/about" style={{
                display:'flex', alignItems:'center', gap:8,
                padding:'0.75rem 1.5rem',
                background:'var(--bg-surface)', border:'1px solid var(--border)',
                borderRadius:12, color:'var(--text-secondary)',
                fontSize:'0.95rem', fontWeight:600, textDecoration:'none',
                transition:'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-hover)'; e.currentTarget.style.color='var(--text-primary)'; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-secondary)'; e.currentTarget.style.transform='translateY(0)' }}>
                Learn More <ArrowRight size={15} />
              </NavLink>
            </div>

            {/* Social proof */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:'1.75rem' }}>
              <div style={{ display:'flex' }}>
                {['#6366f1','#8b5cf6','#a78bfa','#818cf8'].map((c,i) => (
                  <div key={i} style={{ width:26, height:26, borderRadius:'50%', background:c, border:'2px solid var(--bg-base)', marginLeft: i>0?-10:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ color:'white', fontSize:'0.55rem', fontWeight:700 }}>{String.fromCharCode(65+i)}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display:'flex', gap:1 }}>{[1,2,3,4,5].map(s=><Star key={s} size={10} style={{ color:'#fbbf24' }} fill="#fbbf24" />)}</div>
                <span style={{ color:'var(--text-muted)', fontSize:'0.72rem' }}>Trusted by 1,000+ security researchers</span>
              </div>
            </div>
          </div>

          {/* ── Right: visual ── */}
          {!isMobile && (
            <div className="reveal-right" style={{ position:'relative', height: isTablet ? 400 : 500 }}>

              {/* Floating chips */}
              <Chip icon={Shield} label="Vulns found"  val="3 Critical" color="#ef4444" style={{ top:'8%',  left:'-5%', animationDelay:'0s'   }} />
              <Chip icon={Zap}    label="Requests/sec" val="480 req/s"  color="#fbbf24" style={{ bottom:'12%', right:'-4%', animationDelay:'2s'   }} />
              <Chip icon={CheckCircle} label="Endpoints" val="127 found" color="#22c55e" style={{ top:'50%', left:'-8%', animationDelay:'1s' }} />

              {/* Main terminal */}
              <div style={{
                borderRadius:20, overflow:'hidden',
                border:'1px solid rgba(99,102,241,0.3)',
                boxShadow:'0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1)',
                transform:'perspective(1200px) rotateY(-6deg) rotateX(3deg)',
                transformOrigin:'center center',
              }}>
                {/* Mock header bar */}
                <div style={{ background:'linear-gradient(135deg,#0f0f2e,#0b0b1a)', padding:'14px 18px', borderBottom:'1px solid rgba(99,102,241,0.15)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                    <div style={{ width:8,height:8,borderRadius:'50%',background:'#ef4444' }} />
                    <div style={{ width:8,height:8,borderRadius:'50%',background:'#fbbf24' }} />
                    <div style={{ width:8,height:8,borderRadius:'50%',background:'#22c55e' }} />
                    <div style={{ flex:1, height:20, background:'rgba(255,255,255,0.04)', borderRadius:4, border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', padding:'0 8px' }}>
                      <span style={{ color:'rgba(255,255,255,0.25)', fontSize:'0.65rem', fontFamily:'JetBrains Mono,monospace' }}>https://target.example.com</span>
                    </div>
                  </div>

                  {/* Scanner stats row */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                    {[
                      { label:'Scanned',   val:'1,247', color:'#818cf8' },
                      { label:'Found',     val:'89',    color:'#22c55e' },
                      { label:'Vulns',     val:'3',     color:'#ef4444' },
                      { label:'Time',      val:'4.2s',  color:'#fbbf24' },
                    ].map(s => (
                      <div key={s.label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'6px 8px', textAlign:'center' }}>
                        <div style={{ color:s.color, fontSize:'0.82rem', fontWeight:700, fontFamily:'JetBrains Mono,monospace' }}>{s.val}</div>
                        <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.58rem', marginTop:1 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terminal output */}
                <LiveTerminal />
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div style={{ position:'absolute', bottom:'1.5rem', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:4, opacity:0.3, animation:'float 2.5s ease-in-out infinite' }}>
          <ChevronDown size={18} style={{ color:'var(--text-muted)' }} />
        </div>
      </section>

      {/* ══════════════ STATS BAND ══════════════ */}
      <section style={{ padding:'3rem 1.5rem', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', background:'var(--bg-surface)' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap:'1.5rem' }}>
          {STATS.map((s,i) => (
            <div key={i} className="reveal stat-card" style={{ transitionDelay:`${i*0.08}s`, textAlign:'center' }}>
              <div style={{ fontSize:'2rem', fontWeight:800, color:'var(--text-accent)', fontFamily:'Syne,sans-serif', letterSpacing:'-0.04em' }}>{s.val}</div>
              <div style={{ color:'var(--text-muted)', fontSize:'0.8rem', marginTop:3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section style={{ padding:'6rem 1.5rem', position:'relative', overflow:'hidden' }}>
        {/* accent orb */}
        <div style={{ position:'absolute', top:'-100px', right:'-80px', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:'3.5rem' }}>
            <span className="badge badge-indigo" style={{ marginBottom:'1rem', display:'inline-flex' }}>Core Features</span>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:800, letterSpacing:'-0.03em', color:'var(--text-primary)', marginBottom:'0.75rem', lineHeight:1.15 }}>
              Everything you need for{' '}
              <span style={{ background:'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>web security</span>
            </h2>
            <p style={{ color:'var(--text-secondary)', fontSize:'1rem', maxWidth:500, margin:'0 auto' }}>A comprehensive toolkit for security researchers, pentesters, and developers.</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap:'1rem' }}>
            {FEATURES.map((f,i) => (
              <div key={i} className="feature-card reveal" style={{ transitionDelay:`${i*0.07}s` }}>
                <div style={{
                  width:42, height:42, borderRadius:12,
                  background:'var(--accent-light)', border:'1px solid var(--border-accent)',
                  display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem',
                }}>
                  <f.icon size={19} style={{ color:'var(--text-accent)' }} strokeWidth={1.8} />
                </div>
                <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:'0.5rem', color:'var(--text-primary)', fontFamily:'Syne,sans-serif' }}>{f.title}</h3>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem', lineHeight:1.65, marginBottom:'1rem' }}>{f.desc}</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {f.tags.map((t,ti) => (
                    <span key={ti} className="badge badge-neutral">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section style={{ padding:'6rem 1.5rem', background:'var(--bg-surface)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', position:'relative', overflow:'hidden' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:'3.5rem' }}>
            <span className="badge badge-indigo" style={{ marginBottom:'1rem', display:'inline-flex' }}>Workflow</span>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:800, letterSpacing:'-0.03em', color:'var(--text-primary)', lineHeight:1.15 }}>
              Up and running in <span style={{ color:'var(--text-accent)' }}>minutes</span>
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap:'1rem' }}>
            {STEPS.map((s,i) => (
              <div key={i} className="reveal" style={{
                display:'flex', gap:'1rem', alignItems:'flex-start',
                padding:'1.25rem 1.5rem',
                background:'var(--bg-base)',
                border:'1px solid var(--border)',
                borderRadius:16,
                transitionDelay:`${i*0.08}s`,
                transition:'border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-accent)'; e.currentTarget.style.boxShadow='var(--shadow-sm)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none' }}>
                <div style={{
                  width:38, height:38, borderRadius:10, flexShrink:0,
                  background:'var(--accent-light)', border:'1px solid var(--border-accent)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'JetBrains Mono,monospace', fontSize:'0.72rem', fontWeight:700, color:'var(--text-accent)',
                }}>{s.num}</div>
                <div>
                  <h3 style={{ fontWeight:700, color:'var(--text-primary)', marginBottom:4, fontSize:'0.95rem', fontFamily:'Syne,sans-serif' }}>{s.title}</h3>
                  <p style={{ color:'var(--text-secondary)', fontSize:'0.84rem', lineHeight:1.65 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PHOTO BANNER ══════════════ */}
      {!isMobile && (
        <section style={{ position:'relative', overflow:'hidden', height:340 }}>
          <img ref={heroImgRef} src={TEAM_IMG} alt="Security team" style={{ width:'100%', height:'115%', objectFit:'cover', filter:'saturate(0.6) brightness(0.45)', position:'absolute', top:0 }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(9,9,11,0.85) 0%, rgba(9,9,11,0.5) 50%, rgba(9,9,11,0.85) 100%)' }} />
          <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', textAlign:'center', padding:'0 2rem' }}>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'clamp(1.8rem,4vw,3rem)', color:'white', letterSpacing:'-0.04em', marginBottom:'1rem', lineHeight:1.1 }}>
              Built for security professionals.<br />
              <span style={{ color:'#a5b4fc' }}>Used by researchers worldwide.</span>
            </h2>
            <NavLink to="/scanner" style={{ display:'flex', alignItems:'center', gap:8, padding:'0.75rem 2rem', background:'#6366f1', borderRadius:12, color:'white', fontWeight:700, fontSize:'0.95rem', textDecoration:'none', boxShadow:'0 4px 24px rgba(99,102,241,0.4)', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background='#4f46e5'; e.currentTarget.style.transform='translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background='#6366f1'; e.currentTarget.style.transform='translateY(0)' }}>
              Start Scanning Free <ArrowRight size={15} />
            </NavLink>
          </div>
        </section>
      )}

      {/* ══════════════ CTA ══════════════ */}
      <section style={{ padding:'7rem 1.5rem', position:'relative', overflow:'hidden', textAlign:'center' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:600, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div className="reveal">
            <span className="badge badge-indigo" style={{ marginBottom:'1.5rem', display:'inline-flex' }}>Free · No Setup · Instant Results</span>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'clamp(2rem,5vw,3.5rem)', letterSpacing:'-0.04em', color:'var(--text-primary)', marginBottom:'1rem', lineHeight:1.1 }}>
              Ready to find{' '}
              <span style={{ background:'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>vulnerabilities?</span>
            </h2>
            <p style={{ color:'var(--text-secondary)', fontSize:'1.05rem', marginBottom:'2.5rem', lineHeight:1.7 }}>
              Just enter a target URL — no downloads, no configuration, no GitHub required.
              Start scanning in seconds and get a full security report instantly.
            </p>
          </div>
          <div className="reveal" style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap', transitionDelay:'0.15s' }}>
            <NavLink to="/scanner" className="btn-primary" style={{ fontSize:'1rem', padding:'0.8rem 2rem' }}>
              <Play size={17} fill="currentColor" /> Start Scanning Now
            </NavLink>
            <NavLink to="/about" className="btn-outline" style={{ fontSize:'1rem', padding:'0.8rem 1.8rem' }}>
              Learn More <ArrowRight size={15} />
            </NavLink>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{ borderTop:'1px solid var(--border)', padding:'2rem 1.5rem', background:'var(--bg-surface)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent: isMobile ? 'center' : 'space-between', gap:'1rem', textAlign: isMobile ? 'center' : 'left' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Shield size={13} color="white" />
            </div>
            <span style={{ fontWeight:700, fontSize:'0.95rem', color:'var(--text-primary)', fontFamily:'Syne,sans-serif' }}>
              Vuln<span style={{ color:'var(--text-accent)' }}>Scan</span>
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', flexWrap:'wrap', justifyContent:'center' }}>
            <NavLink to="/scanner" style={{ color:'var(--text-muted)', fontSize:'0.85rem', textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color='var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}>Scanner</NavLink>
            <span style={{ color:'var(--border-hover)' }}>·</span>
            <NavLink to="/reports" style={{ color:'var(--text-muted)', fontSize:'0.85rem', textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color='var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}>Reports</NavLink>
            <span style={{ color:'var(--border-hover)' }}>·</span>
            <NavLink to="/about" style={{ color:'var(--text-muted)', fontSize:'0.85rem', textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color='var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}>About</NavLink>
          </div>
          <div style={{ color:'var(--text-muted)', fontSize:'0.75rem', fontFamily:'JetBrains Mono,monospace' }}>VulnScan © 2025</div>
        </div>
      </footer>
    </>
  )
}
