import { motion } from "framer-motion";
<motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="py-20 bg-background text-center"
>
  {/* content here */}
</motion.section>

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "Run mock scans and view example vulnerabilities.",
      features: ["Basic scan results", "Community support", "No signup required"],
    },
    {
      name: "Pro",
      price: "$29/mo",
      desc: "Advanced scanning tools for professionals.",
      features: [
        "Unlimited mock scans",
        "Detailed vulnerability data",
        "Priority email support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Enterprise-grade security with API access.",
      features: [
        "Dedicated dashboard",
        "SSO & team management",
        "Custom integrations & SLA",
      ],
    },
  ];

  return (
    <section className="py-20 bg-background text-center">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-textPrimary mb-4">
          Choose the Right Plan for You
        </h2>
        <p className="text-textSecondary max-w-2xl mx-auto mb-12">
          Start free or upgrade anytime — flexible options for developers and enterprises.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <div
              key={i}
              className="bg-surface border border-borderGray rounded-xl shadow-md hover:shadow-lg transition-all p-8 flex flex-col"
            >
              <h3 className="text-xl font-semibold text-textPrimary mb-2">{p.name}</h3>
              <div className="text-4xl font-bold text-primary mb-3">{p.price}</div>
              <p className="text-textMuted mb-6">{p.desc}</p>

              <ul className="text-left space-y-2 flex-1 mb-6">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-textSecondary">
                    <span className="text-primary mt-1">✔</span> {f}
                  </li>
                ))}
              </ul>

              <button
                className={`px-5 py-3 rounded-lg font-semibold transition-colors ${
                  p.name === "Pro"
                    ? "bg-primary text-white hover:bg-secondary"
                    : "border border-primary text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {p.name === "Enterprise" ? "Contact Us" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
