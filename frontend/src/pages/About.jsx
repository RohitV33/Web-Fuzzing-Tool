import { Shield, Target, Zap, BookOpen, AlertTriangle, TrendingUp, Github, Code2, Users, Lock } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

const OBJECTIVES = [
  { icon: Shield,        color: '#22c55e', title: 'Detect Vulnerabilities',      desc: 'Automatically identify security weaknesses in web applications including SQLi, XSS, LFI, RFI, and more.' },
  { icon: Target,        color: '#22d3ee', title: 'Test Inputs & Endpoints',      desc: 'Fuzz input fields, API routes, and hidden endpoints using predefined and custom wordlists.' },
  { icon: AlertTriangle, color: '#fbbf24', title: 'Identify Auth Flaws',          desc: 'Discover authentication bypasses, weak credentials, and insecure session handling.' },
  { icon: BookOpen,      color: '#a78bfa', title: 'Generate Reports',             desc: 'Export structured reports in JSON and CSV formats for debugging, remediation, and compliance.' },
]

const KEY_FEATURES = [
  'Automated input testing using multiple payload types',
  'Endpoint and hidden route discovery via wordlists',
  'Payload injection using predefined and custom wordlists',
  'Response analysis based on status codes and behavior',
  'Report generation in JSON and CSV format',
  'Support for custom payloads and file extensions',
  'Real-time scan results with live filtering',
  'Severity classification (Critical, High, Medium, Low)',
  'Concurrent multi-threaded request handling',
  'Configurable thread count and scan depth',
]

const TECH_STACK = [
  { cat: 'Frontend',   items: ['React 19', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Router 7'] },
  { cat: 'Libraries',  items: ['Lucide React', 'PostCSS', 'Autoprefixer', 'ESLint'] },
  { cat: 'Optional',   items: ['Node.js backend', 'Axios / Requests', 'BeautifulSoup (Python)', 'Puppeteer'] },
  { cat: 'Database',   items: ['MongoDB', 'PostgreSQL', 'In-memory store'] },
]

const WORKING_PROCESS = [
  { step: '01', title: 'Enter Target', desc: 'User inputs the target URL or API endpoint to test.' },
  { step: '02', title: 'Crawl & Discover', desc: 'Tool crawls the website to find forms, endpoints, and parameters.' },
  { step: '03', title: 'Inject Payloads', desc: 'Payloads are injected into each discovered input and parameter.' },
  { step: '04', title: 'Analyze Responses', desc: 'Responses are analyzed by status codes, delays, body patterns, and anomalies.' },
  { step: '05', title: 'Detect Vulnerabilities', desc: 'Vulnerabilities are flagged based on response anomalies and known patterns.' },
  { step: '06', title: 'Generate Report', desc: 'A structured report is generated in JSON or HTML format for remediation.' },
]

const ADVANTAGES = [
  'Saves significant time compared to manual testing',
  'Helps understand web security concepts practically',
  'Useful for bug bounty hunting and professional testing',
  'Can be extended with custom payloads and modules',
  'Open-source and freely available under MIT license',
]

const LIMITATIONS = [
  'May produce false positives that require manual verification',
  'Cannot fully replace experienced manual penetration testing',
  'Needs proper payload tuning for different target types',
  'Simulated results — production use requires a real backend',
  'Rate limiting may block aggressive scans on live targets',
]

const FUTURE = [
  { icon: '🤖', title: 'AI-Based Payload Generation',        desc: 'Machine learning to generate context-aware payloads based on target behavior.' },
  { icon: '🔗', title: 'Burp Suite Integration',             desc: 'Export and import sessions from Burp Suite for professional workflows.' },
  { icon: '📊', title: 'Real-Time Severity Dashboard',       desc: 'Live dashboard with severity heatmaps, timeline, and trend analysis.' },
  { icon: '⚡', title: 'Faster Multi-Threaded Scanning',     desc: 'Optimized concurrency engine supporting 1000+ req/sec.' },
  { icon: '☁️', title: 'Cloud-Based Deployment',             desc: 'Deploy as a SaaS service with team collaboration and scheduled scans.' },
  { icon: '🔒', title: 'Authenticated Scanning',             desc: 'Support for OAuth2, JWT, and session-based authenticated scanning.' },
]

export default function About() {
  useScrollReveal()

  return (
    <div className="min-h-screen pt-20 px-4 md:px-6 pb-16" style={{ background: '#020b0f' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="py-12 text-center mb-12 reveal">
          <span className="badge badge-cyan mb-4 inline-block">Project Documentation</span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display mb-4">
            About <span className="gradient-text">VulnScan</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            VulnScan is a cybersecurity-based web application designed to test web applications for vulnerabilities
            by sending random, unexpected, or malformed inputs (fuzz data). It helps identify security flaws such as
            input validation errors, crashes, and hidden endpoints.
          </p>
          <p className="text-slate-500 text-sm mt-4">
            This tool is useful for developers, penetration testers, and security researchers to ensure application security.
          </p>
        </div>

        <div className="cyber-divider mb-12" />

        {/* Objectives */}
        <section className="mb-16">
          <div className="reveal mb-8">
            <span className="badge badge-green mb-3 inline-block">Objectives</span>
            <h2 className="text-2xl md:text-3xl font-bold font-display">Project <span className="gradient-text">Goals</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {OBJECTIVES.map((o, i) => (
              <div key={i} className="feature-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${o.color}18`, border: `1px solid ${o.color}30` }}
                  >
                    <o.icon size={20} style={{ color: o.color }} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{o.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{o.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <div className="reveal mb-8">
            <span className="badge badge-cyan mb-3 inline-block">Features</span>
            <h2 className="text-2xl md:text-3xl font-bold font-display">Key <span className="gradient-text">Features</span></h2>
          </div>
          <div className="feature-card reveal">
            <div className="grid md:grid-cols-2 gap-3">
              {KEY_FEATURES.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-green-400 mt-0.5 flex-shrink-0">◆</span>
                  <span className="text-slate-300 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <div className="reveal mb-8">
            <span className="badge badge-purple mb-3 inline-block">Technologies</span>
            <h2 className="text-2xl md:text-3xl font-bold font-display">Tech <span className="gradient-text">Stack</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {TECH_STACK.map((t, i) => (
              <div key={i} className="feature-card reveal !p-4" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="text-xs font-mono font-semibold text-green-400 mb-3 uppercase tracking-wider">{t.cat}</div>
                <ul className="space-y-1.5">
                  {t.items.map((item, j) => (
                    <li key={j} className="text-slate-400 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 bg-opacity-60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Working Process */}
        <section className="mb-16">
          <div className="reveal mb-8">
            <span className="badge badge-green mb-3 inline-block">Workflow</span>
            <h2 className="text-2xl md:text-3xl font-bold font-display">Working <span className="gradient-text">Process</span></h2>
          </div>
          <div className="space-y-3">
            {WORKING_PROCESS.map((s, i) => (
              <div key={i} className="step-card reveal" style={{ transitionDelay: `${i * 0.07}s` }}>
                <div className="flex items-start gap-4">
                  <span
                    className="font-mono font-bold text-sm flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}
                  >
                    {s.step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-0.5">{s.title}</h3>
                    <p className="text-slate-400 text-sm">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Example Use Case */}
        <section className="mb-16">
          <div className="reveal mb-6">
            <span className="badge badge-red mb-3 inline-block">Example</span>
            <h2 className="text-2xl md:text-3xl font-bold font-display">Use <span className="gradient-text">Case</span></h2>
          </div>
          <div className="feature-card reveal">
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              If a login form is vulnerable to SQL Injection, the tool sends a payload like:
            </p>
            <div className="code-block mb-4">
              <div className="text-xs text-slate-500 mb-2">// SQL Injection payload</div>
              <div><span className="text-green-400">POST</span> <span className="text-slate-300">/login</span></div>
              <div className="mt-2">
                <span className="text-yellow-400">username=</span>
                <span className="text-red-400">' OR '1'='1</span>
                <span className="text-slate-500"> &amp;</span>
                <span className="text-yellow-400">password=</span>
                <span className="text-red-400">anything</span>
              </div>
              <div className="mt-3 text-green-400 text-xs">
                → Response: 200 OK — Authentication bypassed! 🔴 CRITICAL vulnerability detected.
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              If authentication is bypassed, VulnScan flags a <span className="text-red-400 font-semibold">CRITICAL</span> vulnerability
              and includes it in the report with the payload used, affected endpoint, and remediation advice.
            </p>
          </div>
        </section>

        {/* Advantages & Limitations */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="reveal mb-6">
                <span className="badge badge-green mb-3 inline-block">Advantages</span>
                <h2 className="text-xl font-bold font-display">Why use <span className="gradient-text">VulnScan</span></h2>
              </div>
              <div className="space-y-3">
                {ADVANTAGES.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-slate-300 text-sm">{a}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="reveal mb-6">
                <span className="badge badge-yellow mb-3 inline-block">Limitations</span>
                <h2 className="text-xl font-bold font-display">Known <span className="gradient-text-cyan">Limitations</span></h2>
              </div>
              <div className="space-y-3">
                {LIMITATIONS.map((l, i) => (
                  <div key={i} className="flex items-start gap-3 reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                    <span className="text-yellow-400 mt-0.5 flex-shrink-0">⚠</span>
                    <span className="text-slate-400 text-sm">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Future Enhancements */}
        <section className="mb-16">
          <div className="reveal mb-8">
            <span className="badge badge-cyan mb-3 inline-block">Roadmap</span>
            <h2 className="text-2xl md:text-3xl font-bold font-display">Future <span className="gradient-text">Enhancements</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FUTURE.map((f, i) => (
              <div key={i} className="feature-card reveal !p-4" style={{ transitionDelay: `${i * 0.07}s` }}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-white text-sm mb-2">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-16">
          <div className="reveal mb-6">
            <span className="badge badge-green mb-3 inline-block">Conclusion</span>
            <h2 className="text-2xl md:text-3xl font-bold font-display">Summary</h2>
          </div>
          <div className="feature-card reveal">
            <p className="text-slate-300 leading-relaxed">
              VulnScan automates vulnerability detection and improves application security by identifying weaknesses early in the development lifecycle.
              It is a valuable tool for cybersecurity learning, bug bounty hunting, and real-world security testing. By combining intelligent fuzzing
              with response analysis and structured reporting, it empowers developers and security professionals to build safer web applications.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center reveal">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="/scanner" className="btn-primary justify-center">
              <Target size={16} /> Try the Scanner
            </NavLink>
            <a href="https://github.com/RohitV33/Web-Fuzzing-Tool" target="_blank" rel="noreferrer" className="btn-outline justify-center">
              <Github size={16} /> View on GitHub
            </a>
          </div>
          <p className="text-slate-600 text-xs mt-6 font-mono">
            Built by <a href="https://github.com/RohitV33" className="text-green-400 hover:text-green-300" target="_blank" rel="noreferrer">@RohitV33</a> · MIT License · v1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}
