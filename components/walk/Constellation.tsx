"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { constellationFinalLine, constellationStars } from "@/data/constellation";
import { useHaptics } from "./useHaptics";

export function Constellation() {
  const { tap } = useHaptics();
  const [lit, setLit] = useState<Record<string, boolean>>({});

  const litCount = useMemo(
    () => constellationStars.filter((star) => lit[star.id]).length,
    [lit]
  );
  const allLit = litCount === constellationStars.length;

  const handleTap = (id: string) => {
    if (lit[id]) return;
    tap(12);
    setLit((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="mt-10 border border-[var(--hairline)] bg-[rgba(14,17,28,0.96)] text-white p-4 md:p-6">
      <p className="label-mono text-white/55 mb-4">constellation protocol</p>
      <div className="relative w-full aspect-[16/10] border border-white/10 overflow-hidden">
        {constellationStars.map((star) => (
          <button
            key={star.id}
            type="button"
            onClick={() => handleTap(star.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            aria-label={`light ${star.label}`}
          >
            <motion.div
              className={`rounded-full ${lit[star.id] ? "bg-[var(--map-accent)]" : "bg-white/35"}`}
              animate={lit[star.id] ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.7 }}
              style={{ width: 10, height: 10 }}
            />
          </button>
        ))}

        {allLit && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polyline
              points={constellationStars
                .map((star) => `${star.x}% ${star.y}%`)
                .join(" ")}
              fill="none"
              stroke="rgba(200,71,43,0.72)"
              strokeWidth="2"
            />
          </svg>
        )}
      </div>

      <div className="mt-4 space-y-1.5">
        {constellationStars
          .filter((star) => lit[star.id])
          .map((star) => (
            <p key={star.id} className="font-mono text-[12px] text-white/82">
              {star.line}
            </p>
          ))}
      </div>

      {allLit && (
        <p className="mt-4 font-display-italic text-[1.1rem] md:text-[1.25rem] text-white/92 leading-relaxed">
          {constellationFinalLine}
        </p>
      )}
    </div>
  );
}
