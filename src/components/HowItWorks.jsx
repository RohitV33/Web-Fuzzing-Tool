export default function HowItWorks() {
  const steps = [
    { title: "Crawl", desc: "VulnScan crawls your web app to identify endpoints and parameters." },
    { title: "Fuzz", desc: "It injects crafted payloads to find potential vulnerabilities." },
    { title: "Report", desc: "Results are summarized by severity with endpoint details." },
  ];

  return (
    <section className="py-20 bg-surface text-center border-t border-borderGray">
      <h2 className="text-3xl font-bold text-textPrimary mb-8">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {steps.map((s, i) => (
          <div
            key={i}
            className="p-6 bg-white border border-borderGray rounded-lg shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-primary mb-2">{s.title}</h3>
            <p className="text-textSecondary">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
