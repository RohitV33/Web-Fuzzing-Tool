import { motion, AnimatePresence } from "framer-motion";

export default function ProgressBar({ percent = 0 }) {
  return (
    <AnimatePresence>
      {percent > 0 && (
        <motion.div
          key="progressbar"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 w-full h-1.5 z-50 bg-gray-200 overflow-hidden"
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${percent}%` }}
            transition={{
              ease: "easeInOut",
              duration: 0.25,
            }}
            className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-r-full shadow-[0_0_8px_rgba(14,165,233,0.4)]"
          ></motion.div>

          {/* subtle glow pulse */}
          <motion.div
            className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-secondary/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 1.5,
              ease: "linear",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
