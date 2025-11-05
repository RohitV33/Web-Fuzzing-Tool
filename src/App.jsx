import { useState, useRef } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import ProgressBar from "./components/ProgressBar.jsx";
import ScanResults from "./components/ScanResults.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Features from "./components/Features.jsx";
import Footer from "./components/Footer.jsx";

/** Mock data returned after "scan" */
const MOCK = {
  summary: { total: 4, critical: 1, high: 2, medium: 1, low: 0, scanTime: "2.3s" },
  findings: [
    {
      id: "F-001",
      title: "SQL Injection (login endpoint)",
      severity: "Critical",
      endpoint: "/api/login",
      samplePayload: "username=admin' OR '1'='1&password=x",
      description: "Unsanitized input in login query allows SQL injection.",
    },
    {
      id: "F-002",
      title: "Reflected XSS",
      severity: "High",
      endpoint: "/search?q=",
      samplePayload: "<script>alert(1)</script>",
      description: "User-supplied query is reflected without encoding.",
    },
    {
      id: "F-003",
      title: "Open Redirect",
      severity: "High",
      endpoint: "/redirect?to=",
      samplePayload: "https://evil.example",
      description: "Unvalidated redirect parameter can lead to phishing.",
    },
    {
      id: "F-004",
      title: "Insecure Direct Object Reference (IDOR)",
      severity: "Medium",
      endpoint: "/api/user?id=123",
      samplePayload: "/api/user?id=124",
      description: "Object identifier can be changed to access other users.",
    },
  ],
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);

  const startProgress = () => {
    setProgress(0);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        const step = Math.random() * 7 + 3; // 3-10%
        if (p >= 98) return 98; // hold before completion
        return Math.min(98, p + step);
      });
    }, 120);
  };

  const stopProgress = () => {
    clearInterval(intervalRef.current);
    setProgress(100);
    setTimeout(() => setProgress(0), 500); // hide after a moment
  };

  const onSubmit = (url) => {
    setError("");
    setSummary(null);
    setResults(null);
    setLoading(true);
    startProgress();

    // simulate API latency
    setTimeout(() => {
      setSummary(MOCK.summary);
      setResults(MOCK.findings);
      setLoading(false);
      stopProgress();

      // scroll to results
      const el = document.querySelector("#results");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] to-[#07090b] text-white">
      <Header />
      {loading && <ProgressBar percent={progress} />}

      <main id="main" className="max-w-6xl mx-auto px-4">
        <Hero onSubmit={onSubmit} />
        <ScanResults results={results} summary={summary} error={error} />
        <HowItWorks />
        <Features />

        {/* Pricing snapshot */}
        <section id="pricing" className="py-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Pricing</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Free trial", price: "$0", desc: "Mock scans, limited features" },
              { name: "Team", price: "$29/mo", desc: "Unlimited mock scans, team seats" },
              { name: "Enterprise", price: "Contact", desc: "SSO, audit logs, SLA" },
            ].map((p) => (
              <div key={p.name} className="bg-[#0b1220] border border-gray-800 rounded p-6 text-center">
                <h4 className="text-lg font-semibold">{p.name}</h4>
                <div className="text-3xl font-bold mt-2">{p.price}</div>
                <p className="text-gray-400 mt-2">{p.desc}</p>
                <button className="mt-4 px-4 py-2 bg-cyanaccent text-black rounded font-semibold hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-cyanaccent">
                  Get started
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
