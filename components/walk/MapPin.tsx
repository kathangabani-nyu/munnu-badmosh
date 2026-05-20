"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface MapPinProps {
  x: number;
  y: number;
  label: string;
  catalogTag: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}

export function MapPin({ x, y, label, catalogTag, progress, start, end }: MapPinProps) {
  const fadeStart = Math.max(0, start - 0.03);
  const fadeEnd = Math.min(1, end + 0.03);
  const active = useTransform(progress, [fadeStart, start, end, fadeEnd], [0.28, 1, 1, 0.28]);
  const labelOpacity = useTransform(progress, [fadeStart, start, end, fadeEnd], [0, 1, 1, 0]);

  return (
    <motion.div className="absolute" style={{ left: `${x}%`, top: `${y}%`, opacity: active }}>
      <div className="relative">
        <div className="w-[18px] h-[18px] rounded-full border-2 border-[var(--map-accent)] bg-white/95 shadow-sm" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-[var(--map-accent)]" />
      </div>
      <motion.div style={{ opacity: labelOpacity }} className="absolute top-[-2px] left-6 whitespace-nowrap">
        <p className="label-mono text-[10px]">{catalogTag}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-[var(--map-ink)]">{label}</p>
      </motion.div>
    </motion.div>
  );
}
