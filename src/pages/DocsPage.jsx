import { motion } from "framer-motion";

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      content:
        "Install VulnScan and begin scanning your web apps in minutes. Simply input your target URL and start the mock scan.",
      icon: "🚀",
    },
    {
      title: "Scan Modes",
      content:
        "Quick Scan identifies common issues fast, while Deep Scan explores all endpoints and injects advanced payloads.",
      icon: "🧩",
    },
    {
      title: "Export & Reports",
      content:
        "Generate shareable vulnerability reports in JSON or PDF for your dev or security teams.",
      icon: "📄",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden"
    >
      {/* Animated background glow */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-0 w-[500px] h-[500px] bg-gradient-to-l from-blue-300/30 to-cyan-200/30 blur-3xl rounded-full -z-10"
      ></motion.div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500"
      >
        Documentation
      </motion.h2>

      {/* Docs sections */}
      <div className="max-w-5xl mx-auto px-6">
        {sections.map((sec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="relative mb-10 p-8 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-100/40 via-cyan-100/30 to-transparent blur-2xl rounded-2xl"></div>

            {/* Floating icon */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl mb-4 relative z-10"
            >
              {sec.icon}
            </motion.div>

            {/* Title */}
            <h3 className="text-2xl font-semibold text-blue-600 mb-2 relative z-10">
              {sec.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed relative z-10">
              {sec.content}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bottom gradient blur */}
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-cyan-100 to-transparent blur-3xl -z-10"
      ></motion.div>
    </motion.section>
  );
}
