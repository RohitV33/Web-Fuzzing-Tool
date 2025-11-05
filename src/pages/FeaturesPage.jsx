import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      title: "Automated Fuzzing Engine",
      desc: "Discover input vulnerabilities automatically with our advanced engine.",
      icon: "🧩",
    },
    {
      title: "Real-Time Scan Reports",
      desc: "Visualize vulnerabilities instantly with interactive reports and dashboards.",
      icon: "⚡",
    },
    {
      title: "CI/CD Integration",
      desc: "Plug VulnScan into your DevOps pipeline for continuous testing.",
      icon: "🧠",
    },
    {
      title: "Authenticated Scanning",
      desc: "Handle login sessions and cookies to test secured endpoints deeply.",
      icon: "🔐",
    },
    {
      title: "Payload Library",
      desc: "Pre-built and customizable payloads for rapid testing of multiple vectors.",
      icon: "💣",
    },
    {
      title: "Detailed Vulnerability Reports",
      desc: "Comprehensive analysis with severity ranking and remediation tips.",
      icon: "📊",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen py-24 px-6 bg-gradient-to-b from-white via-surface to-white overflow-hidden"
    >
      {/* Animated Background Glow */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/40 to-cyan-300/30 blur-3xl rounded-full -z-10"
      />

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500"
      >
        Powerful Features
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center text-textSecondary mb-16 max-w-3xl mx-auto"
      >
        VulnScan provides everything you need to identify, understand, and fix vulnerabilities effectively.
      </motion.p>

      {/* Feature Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            viewport={{ once: true }}
            className="relative bg-white border border-borderGray rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-10 group overflow-hidden"
          >
            {/* Glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-100/40 via-cyan-100/30 to-transparent blur-2xl"></div>

            {/* Floating Icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl mb-5 drop-shadow-sm"
            >
              {feature.icon}
            </motion.div>

            {/* Text */}
            <h3 className="text-xl font-semibold text-textPrimary mb-3 relative z-10">
              {feature.title}
            </h3>
            <p className="text-textSecondary leading-relaxed relative z-10">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Decorative bottom gradient */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-cyan-100 to-transparent blur-2xl -z-10"
      ></motion.div>
    </motion.section>
  );
}
