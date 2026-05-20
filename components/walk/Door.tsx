"use client";

import { motion } from "framer-motion";
import { DoorContent } from "@/data/doors";

interface DoorProps {
  door: DoorContent;
  onOpen: (id: string) => void;
}

export function Door({ door, onOpen }: DoorProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(door.id)}
      whileTap={{ scale: 0.992 }}
      className="group w-full py-6 text-left transition-colors hover:bg-[rgba(255,255,255,0.35)] flex items-center justify-between gap-6"
    >
      <div>
        <span className="label-mono mb-2 block opacity-70">{door.label}</span>
        <span className="font-hand text-[clamp(1.25rem,3vw,1.65rem)] text-[var(--map-ink)] leading-snug block">
          {door.title}
        </span>
      </div>
      <span
        aria-hidden
        className="shrink-0 text-2xl opacity-60 group-hover:opacity-100 transition-opacity"
      >
        {door.glyph}
      </span>
    </motion.button>
  );
}
