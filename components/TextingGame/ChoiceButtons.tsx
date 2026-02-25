"use client";

import { motion } from "framer-motion";
import { UserChoice } from "./types";

interface ChoiceButtonsProps {
  choices: UserChoice[];
  onChoose: (choice: UserChoice) => void;
  disabled: boolean;
}

export function ChoiceButtons({ choices, onChoose, disabled }: ChoiceButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-2.5 mt-4 mb-2 px-1"
    >
      {choices.map((choice, index) => (
        <motion.button
          key={choice.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: index * 0.1,
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => !disabled && onChoose(choice)}
          disabled={disabled}
          className={`
            w-full text-left px-4 py-3 rounded-2xl rounded-br-md
            bg-gradient-to-r from-stone-100/80 to-stone-50/80
            border border-stone-200/60
            text-stone-700 text-[0.875rem] font-sans
            shadow-sm
            active:bg-stone-200/60
            disabled:opacity-50
            transition-colors duration-200
          `}
        >
          {choice.text}
        </motion.button>
      ))}
    </motion.div>
  );
}
