"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-start mb-3"
    >
      <div className="flex items-center gap-1 rounded-[1.1rem] rounded-bl-sm bg-white/82 px-3.5 py-2.5 shadow-[0_12px_28px_-24px_rgba(29,29,31,0.55)] ring-1 ring-black/[0.04] backdrop-blur-xl">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-[6px] h-[6px] rounded-full bg-stone-400"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
