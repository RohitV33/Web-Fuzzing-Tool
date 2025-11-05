import { motion } from "framer-motion";

export default function AboutPage() {
  const team = [
    {
      name: "Rohit Verma",
      role: "Founder & Lead Security Engineer",
      img: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    },
    {
      name: "Nitin Mathur",
      role: "Frontend Developer",
      img: "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
    },
    {
      name: "Rohit Mathur",
      role: "Cybersecurity Analyst",
       img: "https://cdn-icons-png.flaticon.com/512/4140/4140057.png",
    },
    {
      name: "Rohit Sharma",
      role: "Ui/UX Designer",
       img: "https://cdn-icons-png.flaticon.com/128/4140/4140037.png",
    },

  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-20 bg-background text-center"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Title */}
        <h2 className="text-3xl font-bold text-textPrimary mb-4">About VulnScan</h2>
        <p className="text-textSecondary max-w-3xl mx-auto mb-12">
          VulnScan is a modern web fuzzing and vulnerability discovery tool built for developers,
          ethical hackers, and enterprises. Our mission is to make web security accessible,
          fast, and reliable — empowering teams to find vulnerabilities before attackers do.
        </p>

        {/* Mission Section */}
        <div className="bg-surface border border-borderGray rounded-lg shadow-sm p-8 mb-16">
          <h3 className="text-2xl font-semibold text-primary mb-3">Our Mission</h3>
          <p className="text-textSecondary max-w-3xl mx-auto">
            We believe every web application deserves robust protection. Our goal is to simplify
            vulnerability scanning and integrate it seamlessly into developers’ workflows —
            ensuring security is part of innovation, not a barrier to it.
          </p>
        </div>

        {/* Team Section */}
        <h3 className="text-2xl font-bold text-textPrimary mb-8">Meet the Team</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-surface border border-borderGray rounded-lg shadow-md hover:shadow-lg p-6 flex flex-col items-center text-center transition-all"
            >
              <motion.img
              animate={{
    y: [0, -10, 0],
  }}
  transition={{
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  }}
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full mb-4 border-2 border-primary shadow-sm"
              />
              <h4 className="text-lg font-semibold text-textPrimary">{member.name}</h4>
              <p className="text-textMuted text-sm mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>

        {/* Company Vision */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-primary mb-4">Our Vision</h3>
          <p className="text-textSecondary">
            At VulnScan, we envision a digital world where web security is built into every layer
            of development — where finding and fixing vulnerabilities is as easy as pushing code.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
