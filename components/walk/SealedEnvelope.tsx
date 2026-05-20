"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { UNLOCK_DATE_ISO } from "@/data/unlock";
import { useUnlockDate } from "./useUnlockDate";
import { useHaptics } from "./useHaptics";
import { Constellation } from "./Constellation";

export function SealedEnvelope() {
  const { locked, daysUntil } = useUnlockDate(UNLOCK_DATE_ISO);
  const { tap } = useHaptics();
  const reduce = useReducedMotion();
  const [holding, setHolding] = useState(false);
  const [opened, setOpened] = useState(false);

  const handleTapStart = () => {
    tap(10);
    if (locked) return;
    setHolding(true);
    window.setTimeout(() => {
      setHolding(false);
      setOpened(true);
      tap(28);
    }, 1200);
  };

  const handleTapEnd = () => {
    setHolding(false);
  };

  return (
    <section className="relative z-10 min-h-[100vh] flex flex-col items-center justify-center px-5 py-28">
      <p className="label-mono mb-10 text-center">module 03 · sealed</p>
      <p className="font-hand text-center text-[clamp(1.35rem,3.5vw,2rem)] text-[var(--ink-soft)] max-w-xl mb-12 leading-snug">
        don&apos;t open until june 17. i mean it. munna jhaalim i can see you trying.
      </p>

      <button
        type="button"
        onMouseDown={handleTapStart}
        onMouseUp={handleTapEnd}
        onMouseLeave={handleTapEnd}
        onTouchStart={handleTapStart}
        onTouchEnd={handleTapEnd}
        className="group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--map-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--paper-bg)] rounded-lg"
        aria-label={locked ? "Envelope sealed" : opened ? "Letter opened" : "Open envelope"}
      >
        <motion.div
          animate={locked ? { rotate: [0, -2.2, 2.2, 0], y: [0, -2, 0] } : {}}
          transition={{ repeat: locked ? Infinity : 0, duration: 2.4, ease: "easeInOut" }}
          className="relative w-[min(92vw,420px)]"
        >
          <svg viewBox="0 0 400 280" className="w-full h-auto drop-shadow-[0_28px_60px_-34px_rgba(31,29,26,0.35)]" aria-hidden>
            <defs>
              <linearGradient id="envPaper" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fdfbf7" />
                <stop offset="100%" stopColor="#f3ebe0" />
              </linearGradient>
            </defs>

            <rect x={40} y={96} width={320} height={160} rx={6} fill="url(#envPaper)" stroke="var(--hairline)" strokeWidth={1} />

            <motion.path
              d="M 40 96 L 200 190 L 360 96"
              fill="rgba(250,249,245,0.85)"
              stroke="var(--hairline)"
              strokeWidth={1}
              animate={opened ? { opacity: 0.25 } : { opacity: 1 }}
              transition={{ duration: reduce ? 0.01 : 0.55 }}
            />

            <motion.path
              d="M 40 96 L 200 190 L 360 96 L 40 96 Z"
              fill="rgba(250,249,245,0.55)"
              initial={{ opacity: 1 }}
              animate={{ opacity: opened ? 0.25 : 1 }}
            />

            <motion.g
              style={{ transformOrigin: "200px 175px" }}
              animate={
                opened && !locked
                  ? { rotate: reduce ? 0 : -18, x: reduce ? 0 : -10, opacity: 0.85 }
                  : { rotate: 0, x: 0, opacity: 1 }
              }
              transition={{ duration: reduce ? 0.01 : 0.45 }}
            >
              <circle cx={200} cy={175} r={26} fill="#c8472b" opacity={0.92} />
              <circle cx={200} cy={175} r={26} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={1} />
              <text
                x={200}
                y={182}
                textAnchor="middle"
                fill="#fdf6f0"
                style={{ fontFamily: "var(--font-mono), monospace", fontSize: 13, letterSpacing: "0.08em" }}
              >
                M
              </text>
            </motion.g>

            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: opened && !locked ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <line x1={200} y1={175} x2={170} y2={200} stroke="rgba(255,255,255,0.55)" strokeWidth={2} strokeLinecap="round" />
              <line x1={200} y1={175} x2={230} y2={200} stroke="rgba(255,255,255,0.55)" strokeWidth={2} strokeLinecap="round" />
            </motion.g>
          </svg>
        </motion.div>
      </button>

      <p className="mt-10 label-mono">
        {locked
          ? `unlocks in ${daysUntil} day${daysUntil === 1 ? "" : "s"}`
          : opened
            ? "constellation unlocked"
            : holding
              ? "hold..."
              : "tap and hold to crack"}
      </p>

      <motion.div
        initial={false}
        animate={{ height: opened && !locked ? "auto" : 0, opacity: opened && !locked ? 1 : 0 }}
        className="overflow-hidden max-w-xl text-center mt-10"
      >
        <Constellation />
      </motion.div>
    </section>
  );
}
