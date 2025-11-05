import { motion } from "framer-motion";

const items = [
  {
    title: "Payload engine",
    desc: "Extensive payload library with customizable templates and rules.",
  },
  {
    title: "Authenticated scanning",
    desc: "Handle login flows, sessions, and cookies for deeper coverage.",
  },
  {
    title: "CI/CD integration",
    desc: "Automate scans in pipelines and create issues on failures.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-semibold text-center mb-10">Features</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((f) => (
            <article
              key={f.title}
              className="bg-[#0b1220] border border-gray-800 rounded p-6 hover:border-cyanaccent transition-colors"
              role="article"
              tabIndex={0}
            >
              <h4 className="text-lg font-semibold">{f.title}</h4>
              <p className="text-gray-400 mt-2">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
