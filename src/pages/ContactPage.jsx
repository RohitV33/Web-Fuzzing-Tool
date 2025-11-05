import { motion } from "framer-motion";
<motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="py-20 bg-background text-center"
>
  {/* content here */}
</motion.section>


export default function ContactPage() {
  return (
    <section className="py-20 bg-background text-center">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-textPrimary mb-6">Contact Us</h2>
        <p className="text-textSecondary mb-10">
          Have questions or feedback? Send us a message and we’ll get back to you soon.
        </p>

        <form className="text-left space-y-6">
          {/* Name */}
          <div>
            <label className="block text-textPrimary mb-2 font-medium">Name</label>
            <input
              type="text"
              className="w-full p-3 bg-surface border border-borderGray rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-textPrimary mb-2 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 bg-surface border border-borderGray rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-textPrimary mb-2 font-medium">Message</label>
            <textarea
              rows="5"
              className="w-full p-3 bg-surface border border-borderGray rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Write your message here..."
              required
            ></textarea>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
