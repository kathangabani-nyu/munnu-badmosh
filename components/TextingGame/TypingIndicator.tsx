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
      <div className="bg-white/80 border border-stone-200/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex gap-1 items-center">
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
