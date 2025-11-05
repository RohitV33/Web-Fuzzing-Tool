import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import ScanResults from "../components/ScanResults.jsx";

// --- mock data
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
      title: "IDOR",
      severity: "Medium",
      endpoint: "/api/user?id=123",
      samplePayload: "/api/user?id=124",
      description: "Changing the object id exposes other users' data.",
    },
  ],
};

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const progTimer = useRef(null);

  // simulate scanning progress
  const startProgress = () => {
    setProgress(0);
    clearInterval(progTimer.current);
    progTimer.current = setInterval(() => {
      setProgress((p) => (p >= 98 ? 98 : p + (Math.random() * 7 + 3)));
    }, 120);
  };
  const finishProgress = () => {
    clearInterval(progTimer.current);
    setProgress(100);
    setTimeout(() => setProgress(0), 500);
  };

  const handleScan = (url) => {
    setError("");
    setSummary(null);
    setResults(null);
    setLoading(true);
    startProgress();

    setTimeout(() => {
      setSummary(MOCK.summary);
      setResults(MOCK.findings);
      setLoading(false);
      finishProgress();

      const el = document.querySelector("#results");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 2000);
  };

  return (
    <>
      {loading && <ProgressBar percent={progress} />}

      {/* HERO */}
      <Hero onSubmit={handleScan} />

      {/* SCAN RESULTS */}
      <ScanResults results={results} summary={summary} error={error} />

      {/* HOW IT WORKS */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <HowItWorks />
      </motion.section>

      {/* TRUSTED BY COMPANIES */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <section className="py-20 bg-gradient-to-b from-surface via-white to-surface border-t border-borderGray text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-textPrimary mb-10"
          >
            Trusted by Leading Companies
          </motion.h2>

          <p className="text-textSecondary mb-12 max-w-2xl mx-auto">
            Thousands of developers and security teams use VulnScan to strengthen their web apps.
          </p>

          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-center px-6">
            {[
              {
                name: "Google",
                img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
              },
              {
                name: "Amazon",
                img: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
              },
              {
                name: "Microsoft",
                img: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
              },
              {
                name: "IBM",
                img: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
              },
              {
                name: "Cloudflare",
                img: "https://imgs.search.brave.com/oESMDK1O49OvS0EmkdL2zsUL87obvr1cUQB3zu9kSAw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi80LzRiL0Ns/b3VkZmxhcmVfTG9n/by5zdmcvMjUwcHgt/Q2xvdWRmbGFyZV9M/b2dvLnN2Zy5wbmc",
              },
              {
                name: "GitHub",
                img: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
              },
            ].map((logo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex justify-center items-center"
              >
                <motion.img
                  src={logo.img}
                  alt={logo.name}
                  className="h-10 sm:h-12 w-auto grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    y: [0, -8, 0],
                    transition: { repeat: Infinity, duration: 6 + i, ease: "easeInOut" },
                  }}
                />
              </motion.div>
            ))}
          </div>
        </section>
      </motion.section>

      {/* REVIEWS */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <section className="relative py-28 overflow-hidden bg-gradient-to-b from-white via-surface to-white border-t border-borderGray">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.15 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="absolute -top-40 right-0 w-[500px] h-[500px] bg-gradient-to-r from-primary/20 to-secondary/10 blur-3xl rounded-full"
          ></motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-textPrimary text-center mb-16"
          >
            Loved by Developers Worldwide 🌎
          </motion.h2>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-4">
            {[
              {
                name: "Arjun Patel",
                title: "Security Engineer, SafeTech",
                quote:
                  "VulnScan simplified our vulnerability discovery process. The UI is clean, fast, and surprisingly accurate for a mock scanner!",
                img: "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
              },
              {
                name: "Priya Singh",
                title: "Frontend Developer",
                quote:
                  "I love how easy it is to plug VulnScan into CI/CD. The design and feedback make it perfect for dev teams learning security.",
                img: "https://cdn-icons-png.flaticon.com/512/4140/4140057.png",
              },
              {
                name: "Ravi Sharma",
                title: "DevOps Lead, SecureCloud",
                quote:
                  "Great educational tool for fuzzing concepts. We use it in our internal workshops — reliable and intuitive.",
                img: "https://cdn-icons-png.flaticon.com/512/219/219969.png",
              },
            ].map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white border border-borderGray rounded-2xl shadow-md hover:shadow-xl transition-all p-8 flex flex-col items-center"
              >
                <motion.img
                  src={r.img}
                  alt={r.name}
                  className="w-20 h-20 rounded-full border-4 border-primary shadow-md mb-5 hover:scale-105 transition-transform"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <p className="text-textSecondary italic mb-6 leading-relaxed">“{r.quote}”</p>
                <div className="font-semibold text-textPrimary text-lg">{r.name}</div>
                <div className="text-textMuted text-sm">{r.title}</div>
                <span className="absolute -top-4 left-6 text-6xl text-primary/10 select-none">“</span>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.section>
    </>
  );
}
