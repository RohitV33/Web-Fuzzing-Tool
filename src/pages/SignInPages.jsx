import { motion } from "framer-motion";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    alert(`Welcome back, ${email.split("@")[0]}! (Demo login)`); // demo action
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#f1f8ff] to-[#e0f2fe] overflow-hidden">
      {/* Background glows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
        className="absolute -top-32 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/40 to-cyan-400/30 blur-3xl rounded-full"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-400/40 to-blue-400/30 blur-3xl rounded-full"
      ></motion.div>

      {/* Sign In Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl border border-borderGray shadow-xl rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-textPrimary mb-4">
          Welcome Back 👋
        </h2>
        <p className="text-center text-textSecondary mb-8">
          Sign in to continue to <span className="text-primary font-semibold">VulnScan</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg border border-borderGray focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border border-borderGray focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg transition"
          >
            Sign In
          </motion.button>
        </form>

        <p className="text-sm text-center text-textMuted mt-6">
          Don’t have an account?{" "}
          <a
            href="#"
            className="text-primary hover:underline hover:text-secondary transition"
          >
            Sign Up
          </a>
        </p>
      </motion.div>
    </section>
  );
}
