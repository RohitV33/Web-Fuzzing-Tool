import { useState } from "react";
import { motion } from "framer-motion";

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function Hero({ onSubmit }) {
  const [value, setValue] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = () => {
    if (!isValidUrl(value)) {
      setErr("Invalid URL. Please enter a valid URL (e.g., https://example.com)");
      return;
    }
    setErr("");
    if (onSubmit) onSubmit(value);
  };

  const onKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <section
      id="scan"
      className="relative overflow-hidden flex flex-col items-center justify-center text-center py-28 bg-gradient-to-b from-white via-[#f8fbff] to-[#e6f1ff]"
    >
      {/* Floating background glow blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 2 }}
        className="absolute -top-20 left-0 w-[500px] h-[500px] bg-gradient-to-r from-blue-400/40 to-cyan-400/30 blur-3xl rounded-full rotate-12"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 2 }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/40 to-cyan-300/30 blur-3xl rounded-full -rotate-12"
      ></motion.div>

      {/* Hero Content */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl sm:text-6xl font-extrabold text-textPrimary mb-4 tracking-tight"
      >
        Discover & Secure Your Web Apps
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-lg text-textSecondary max-w-2xl mb-10"
      >
        VulnScan helps developers identify vulnerabilities before attackers do — fast, accurate, and developer-friendly.
      </motion.p>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-2xl"
      >
        <input
          type="url"
          inputMode="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          placeholder="Enter website URL (e.g., https://example.com)"
          className="flex-1 p-4 rounded-lg bg-white border border-borderGray placeholder-textMuted text-textPrimary focus:ring-2 focus:ring-primary focus:outline-none shadow-lg shadow-blue-100/40 transition-all"
          aria-label="Target website URL"
        />
        <button
          className="relative px-6 py-3 font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:scale-[1.03] transition-transform focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
          onClick={handleSubmit}
        >
          Scan Now
        </button>
      </motion.div>

      {/* Legal note */}
      {err && (
        <p className="text-red-600 mt-3 font-medium" role="alert">
          {err}
        </p>
      )}
      <p className="text-xs text-textMuted mt-4">
        <strong>Legal:</strong> Only scan websites you own or have explicit permission to test.
      </p>

      {/* Decorative tilt background line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "80%" }}
        transition={{ duration: 1.2, delay: 0.6 }}
        className="absolute bottom-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-primary rounded-full"
      ></motion.div>
    </section>
  );
}
