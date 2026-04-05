import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { Shield, Search, Zap, FileText, Package, AlertTriangle, ChevronDown, Github, Play } from 'lucide-react'
import MatrixRain from '../components/MatrixRain'
// import { useScrollReveal } from '../hooks/useScrollReveal'

const SCAN_LINES = [
  { text: '→ Scanning /admin ...', status: '200 ✓', color: '#22c55e' },
  { text: '→ Scanning /api/v1 ...', status: '301', color: '#fbbf24' },
  { text: '→ Scanning /config ...', status: '403', color: '#f87171' },
  { text: '→ Scanning /.env ...', status: '200 ✓ [VULN]', color: '#ef4444' },
  { text: '→ Scanning /login ...', status: '200 ✓', color: '#22c55e' },
]

function TerminalDemo() {
  const outputRef = useRef(null)
  useEffect(() => {
    let idx = 0
    const run = () => {
      if (!outputRef.current) return
      if (idx >= SCAN_LINES.length) { idx = 0; outputRef.current.innerHTML = '' }
      const line = SCAN_LINES[idx++]
      const div = document.createElement('div')
      div.className = 'flex items-center gap-2 text-xs'
      div.innerHTML = `<span class="text-slate-500">${line.text}</span><span style="color:${line.color};font-weight:600">${line.status}</span>`
      div.style.cssText = 'opacity:0;transform:translateX(-10px);transition:all 0.3s ease'
      outputRef.current.appendChild(div)
      requestAnimationFrame(() => { div.style.opacity='1'; div.style.transform='translateX(0)' })
      setTimeout(run, 600 + idx * 100)
    }
    const t = setTimeout(run, 900)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="code-block text-left" style={{ boxShadow: '0 0 60px rgba(34,197,94,0.15), 0 30px 80px rgba(0,0,0,0.5)' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-slate-500 text-xs ml-2 font-mono">vulnscan ~ terminal</span>
      </div>
      <div className="space-y-2 text-sm">
        <div><span className="text-green-400">$</span> <span className="text-slate-300"> vulnscan --target https://example.com --wordlist common</span></div>
        <div className="text-slate-500 text-xs">Initializing scan engine v1.0.0 ...</div>
        <div ref={outputRef} className="space-y-1" />
        <div className="terminal-cursor text-green-400 text-xs" />
      </div>
    </div>
  )
}

const FEATURES = [
  {
    icon: Search, color: '#22c55e', border: 'rgba(34,197,94,0.25)',
    title: 'Directory Fuzzing',
    desc: 'Enumerate hidden files, directories, and endpoints using wordlist-based discovery with configurable depth and extensions.',
    tags: [{ label: 'Recursive', cls: 'badge-green' }, { label: 'Custom Ext', cls: 'badge-cyan' }],
  },
  {
    icon: Shield, color: '#22d3ee', border: 'rgba(6,182,212,0.25)',
    title: 'Vulnerability Scanning',
    desc: 'Automatically detect XSS, SQLi, LFI, RFI, SSRF, XXE and more using curated payload libraries and response analysis.',
    tags: [{ label: 'XSS', cls: 'badge-red' }, { label: 'SQLi', cls: 'badge-red' }, { label: 'LFI', cls: 'badge-red' }],
  },
  {
    icon: Zap, color: '#a78bfa', border: 'rgba(167,139,250,0.25)',
    title: 'Real-Time Results',
    desc: 'Watch scan results stream live with filtering, status code analysis, response size comparison, and response time metrics.',
    tags: [{ label: 'Live Stream', cls: 'badge-green' }, { label: 'Filtered', cls: 'badge-cyan' }],
  },
  {
    icon: Package, color: '#fbbf24', border: 'rgba(251,191,36,0.25)',
    title: 'Custom Wordlists',
    desc: 'Choose from curated security-focused collections or upload your own. Supports multiple formats and payload types.',
    tags: [{ label: 'Built-in', cls: 'badge-green' }, { label: 'Custom Upload', cls: 'badge-cyan' }],
  },
  {
    icon: AlertTriangle, color: '#f97316', border: 'rgba(249,115,22,0.25)',
    title: 'Vuln Detection Engine',
    desc: 'Pattern matching on responses detects anomalies indicating SQLi, XSS, LFI and auth bypass vulnerabilities automatically.',
    tags: [{ label: 'Auto-Detect', cls: 'badge-red' }, { label: 'Severity', cls: 'badge-yellow' }],
  },
  {
    icon: FileText, color: '#f87171', border: 'rgba(248,113,113,0.25)',
    title: 'Report Generation',
    desc: 'Export detailed reports in JSON or CSV. Structured findings with severity levels, URLs, payloads, and recommendations.',
    tags: [{ label: 'JSON', cls: 'badge-green' }, { label: 'CSV', cls: 'badge-cyan' }],
  },
]

const STEPS = [
  { num: '01', color: '#22c55e', title: 'Configure Target', desc: 'Enter the target URL, select scan mode, configure HTTP method, headers, and authentication.' },
  { num: '02', color: '#22d3ee', title: 'Select Wordlist',  desc: 'Choose built-in wordlists (directories, subdomains, parameters) or upload a custom payload list.' },
  { num: '03', color: '#a78bfa', title: 'Run Fuzzer',       desc: 'Fire off concurrent requests and watch real-time results with status codes, sizes, and time metrics.' },
  { num: '04', color: '#fbbf24', title: 'Analyze & Export', desc: 'Filter findings, identify critical vulnerabilities, and export comprehensive reports for remediation.' },
]

const TECH = [
  { emoji: '⚛️', name: 'React 19',       role: 'UI Framework',   w: 0.95 },
  { emoji: '⚡', name: 'Vite',           role: 'Build Tool',      w: 0.92 },
  { emoji: '🎨', name: 'Tailwind CSS',   role: 'Styling',         w: 0.98 },
  { emoji: '🎬', name: 'Framer Motion',  role: 'Animations',      w: 0.88 },
  { emoji: '🛣️', name: 'React Router 7', role: 'Navigation',      w: 0.85 },
  { emoji: '🔍', name: 'ESLint',         role: 'Code Quality',    w: 0.90 },
  { emoji: '📦', name: 'PostCSS',        role: 'CSS Processing',  w: 0.82 },
  { emoji: '🚀', name: 'Vercel',         role: 'Deployment',      w: 0.93 },
]

export default function Landing() {
  useScrollReveal()

  // Card mouse glow
  useEffect(() => {
    const handler = e => {
      const card = e.currentTarget
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%')
      card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%')
    }
    const cards = document.querySelectorAll('.feature-card')
    cards.forEach(c => c.addEventListener('mousemove', handler))
    return () => cards.forEach(c => c.removeEventListener('mousemove', handler))
  }, [])

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center hero-grid scan-overlay overflow-hidden pt-20">
        <MatrixRain count={28} />
        <div className="orb w-96 h-96 bg-green-500 opacity-5" style={{ top: '-10%', left: '-5%', animationDuration: '10s' }} />
        <div className="orb w-72 h-72 bg-cyan-500 opacity-5" style={{ bottom: '10%', right: '-5%', animationDuration: '12s', animationDelay: '3s' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(34,197,94,0.08) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center py-24">
          <div className="reveal flex justify-center mb-8">
            <span className="badge badge-green flex items-center gap-2 py-2 px-4 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
              Advanced Web Security Testing Platform
            </span>
          </div>

          <div className="reveal" style={{ transitionDelay: '0.1s' }}>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-4 leading-none font-display">
              <span className="glitch gradient-text" data-text="VulnScan">VulnScan</span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-light text-slate-300 mb-4">
              Web <span className="gradient-text-cyan font-semibold">Fuzzing</span> Tool
            </h2>
          </div>

          <div className="reveal" style={{ transitionDelay: '0.2s' }}>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover hidden vulnerabilities, enumerate directories, and test web applications with intelligent fuzzing algorithms — built with React 19 + Vite.
            </p>
          </div>

          <div className="reveal flex flex-col sm:flex-row gap-4 justify-center mb-16" style={{ transitionDelay: '0.3s' }}>
            <NavLink to="/scanner" className="btn-primary justify-center">
              <Play size={16} /> Launch Scanner
            </NavLink>
            <a href="https://github.com/RohitV33/Web-Fuzzing-Tool" target="_blank" rel="noreferrer" className="btn-outline justify-center">
              <Github size={16} /> View Source
            </a>
          </div>

          <div className="reveal max-w-2xl mx-auto" style={{ transitionDelay: '0.4s' }}>
            <TerminalDemo />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
          <span className="text-xs text-slate-500 font-mono">scroll</span>
          <ChevronDown size={18} className="text-slate-500" />
        </div>
      </section>

      <div className="cyber-divider" />

      {/* ── STATS ── */}
      <section className="py-20 px-6 hex-bg relative stat-section">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { val: 200, suffix: '+', label: 'Wordlist Payloads' },
            { val: 6,   suffix: '',  label: 'Vulnerability Types' },
            { val: 500, suffix: '',  label: 'Req/Second' },
            { val: 4,   suffix: '',  label: 'Export Formats' },
          ].map((s, i) => (
            <div key={i} className="stat-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="text-3xl font-bold gradient-text mb-1 counter" data-target={s.val} data-suffix={s.suffix}>0</div>
              <div className="text-slate-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="cyber-divider" />

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge badge-cyan mb-4 inline-block">Core Features</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              Everything you need for <span className="gradient-text">web fuzzing</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A comprehensive toolkit for security researchers, penetration testers, and developers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card reveal" style={{ transitionDelay: `${i * 0.07}s` }}>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}18`, border: `1px solid ${f.border}` }}
                >
                  <f.icon size={22} color={f.color} strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{f.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map((t, ti) => <span key={ti} className={`badge ${t.cls}`}>{t.label}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cyber-divider" />

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 hex-bg relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge badge-green mb-4 inline-block">Workflow</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              How it <span className="gradient-text">works</span>
            </h2>
            <p className="text-slate-400 text-lg">Get scanning in minutes with our streamlined workflow</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              {STEPS.map((s, i) => (
                <div key={i} className="step-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-mono font-bold text-sm"
                      style={{ background: `${s.color}18`, border: `1px solid ${s.color}50`, color: s.color }}
                    >
                      {s.num}
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{s.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal-right">
              <div className="code-block" style={{ boxShadow: '0 0 60px rgba(34,197,94,0.08), 0 20px 60px rgba(0,0,0,0.4)' }}>
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700 border-opacity-40">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-slate-600 text-xs ml-2">useFuzzer.js</span>
                </div>
                <pre className="text-xs leading-relaxed overflow-x-auto"><code
                  dangerouslySetInnerHTML={{ __html: `<span style="color:#c084fc">const</span> <span style="color:#93c5fd">fuzzTarget</span> <span style="color:#94a3b8">=</span> <span style="color:#fde68a">async</span> <span style="color:#e2e8f0">(config) => {</span>
  <span style="color:#c084fc">const</span> <span style="color:#e2e8f0">{ url, wordlist, threads } = config;</span>
  <span style="color:#c084fc">const</span> <span style="color:#93c5fd">results</span> <span style="color:#94a3b8">=</span> <span style="color:#e2e8f0">[];</span>
  <span style="color:#c084fc">const</span> <span style="color:#93c5fd">queue</span> <span style="color:#94a3b8">=</span> <span style="color:#fde68a">new</span> <span style="color:#67e8f9">RequestQueue</span><span style="color:#e2e8f0">(threads);</span>

  <span style="color:#64748b">// Process each payload concurrently</span>
  <span style="color:#fde68a">for</span> <span style="color:#e2e8f0">(</span><span style="color:#c084fc">const</span> <span style="color:#93c5fd">word</span> <span style="color:#fde68a">of</span> <span style="color:#93c5fd">wordlist</span><span style="color:#e2e8f0">) {</span>
    <span style="color:#fde68a">await</span> <span style="color:#93c5fd">queue</span><span style="color:#e2e8f0">.</span><span style="color:#fde68a">add</span><span style="color:#e2e8f0">(() =>
      </span><span style="color:#93c5fd">fetch</span><span style="color:#e2e8f0">(\`\${url}/\${word}\`)
        .</span><span style="color:#fde68a">then</span><span style="color:#e2e8f0">(r => {
          </span><span style="color:#c084fc">if</span><span style="color:#e2e8f0"> (r.status !== </span><span style="color:#4ade80">404</span><span style="color:#e2e8f0">)
            results.push({ word, status: r.status });
        })
    );
  }
  </span><span style="color:#fde68a">return</span><span style="color:#e2e8f0"> results;
};</span>` }}
                /></pre>
              </div>

              <div className="mt-4 neon-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-green-400 text-xs font-mono font-bold">SCAN RESULTS</span>
                  <span className="badge badge-green">Live</span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  {[
                    { s: '200', c: '#22c55e', p: '/admin', sz: '1.2 KB' },
                    { s: '200', c: '#22c55e', p: '/login', sz: '3.8 KB' },
                    { s: '301', c: '#fbbf24', p: '/api/v1', sz: '0.4 KB' },
                    { s: '403', c: '#f87171', p: '/config', sz: '0.1 KB' },
                    { s: '200', c: '#ef4444', p: '/.env [CRITICAL]', sz: '2.1 KB' },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-300">
                      <span style={{ color: r.c }} className="w-10">{r.s}</span>
                      <span className="text-slate-500 flex-1">{r.p}</span>
                      <span className="text-slate-600">{r.sz}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cyber-divider" />

      {/* ── TECH STACK ── */}
      <section id="tech" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge badge-cyan mb-4 inline-block">Tech Stack</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              Built with modern <span className="gradient-text">technologies</span>
            </h2>
            <p className="text-slate-400 text-lg">Industry-leading tools for performance and developer experience</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {TECH.map((t, i) => (
              <div key={i} className="feature-card reveal text-center" style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="text-4xl mb-3">{t.emoji}</div>
                <div className="font-bold text-white mb-1 text-sm">{t.name}</div>
                <div className="text-slate-500 text-xs mb-3">{t.role}</div>
                <div className="progress-bar">
                  <div className="progress-fill" data-width={t.w} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cyber-divider" />

      {/* ── CTA ── */}
      <section className="py-24 px-6 hex-bg relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 70%)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="reveal">
            <span className="badge badge-green mb-6 inline-block">Open Source</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">
              Ready to find <span className="gradient-text">vulnerabilities?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Clone the repository, install dependencies, and start scanning in under 2 minutes. VulnScan is fully open-source under MIT license.
            </p>
          </div>

          <div className="reveal code-block text-left mb-8" style={{ transitionDelay: '0.1s' }}>
            <div className="space-y-2 text-sm font-mono">
              <div><span className="text-green-400">$</span> <span className="text-slate-300"> git clone https://github.com/RohitV33/Web-Fuzzing-Tool</span></div>
              <div><span className="text-green-400">$</span> <span className="text-slate-300"> cd Web-Fuzzing-Tool && npm install</span></div>
              <div><span className="text-green-400">$</span> <span className="text-slate-300"> npm run dev</span></div>
              <div className="text-green-400 text-xs mt-2">✓  Server running at http://localhost:5173</div>
            </div>
          </div>

          <div className="reveal flex flex-col sm:flex-row gap-4 justify-center" style={{ transitionDelay: '0.2s' }}>
            <a href="https://github.com/RohitV33/Web-Fuzzing-Tool" target="_blank" rel="noreferrer" className="btn-primary justify-center">
              <Github size={18} /> Star on GitHub
            </a>
            <NavLink to="/scanner" className="btn-outline justify-center">
              <Play size={18} /> Try the Scanner
            </NavLink>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 border-t border-slate-800 border-opacity-40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(34,197,94,0.3)' }}>
              <Shield size={14} color="white" />
            </div>
            <span className="font-bold font-display">Vuln<span className="gradient-text">Scan</span></span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <a href="https://github.com/RohitV33/Web-Fuzzing-Tool" target="_blank" rel="noreferrer" className="hover:text-green-400 transition-colors">GitHub</a>
            <span>·</span>
            <span>Built by <a href="https://github.com/RohitV33" target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-300 transition-colors">@RohitV33</a></span>
            <span>·</span>
            <span>MIT License</span>
          </div>
          <div className="text-slate-600 text-xs font-mono">v1.0.0 · React 19 · Vite</div>
        </div>
      </footer>
    </>
  )
}