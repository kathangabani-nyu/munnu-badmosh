"use client";

import { useMemo, useRef } from "react";
import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import { spots } from "@/data/spots";
import { CinematicMap } from "./CinematicMap";
import { Spot } from "./Spot";
import { useScrollCamera, getSpotBands } from "./useScrollCamera";
import { useHaptics } from "./useHaptics";

export function Walk() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, x, y, scale, reducedMotion } = useScrollCamera(containerRef);
  const { tap } = useHaptics();
  const lastBandIndex = useRef<number | null>(null);

  const bands = useMemo(() => getSpotBands(), []);
  useMotionValueEvent(progress, "change", (value) => {
    const idx = bands.findIndex((b) => value >= b.start && value < b.end);
    if (idx === -1) return;
    if (lastBandIndex.current === idx) return;
    lastBandIndex.current = idx;
    tap(9);
  });

  // Map opacity rises during the reveal section, holds, then fades for outro chapters
  const mapOpacity = useTransform(progress, [0, 0.04, 0.08, 0.84, 0.9], [0, 0, 0.95, 0.95, 0.18]);
  const mapBlur = useTransform(progress, [0.84, 0.92], [0, 8]);

  return (
    <div ref={containerRef} className="relative">
      <CinematicMap
        x={x}
        y={y}
        scale={scale}
        opacity={mapOpacity}
        blur={mapBlur}
        scrollProgress={progress}
        reducedMotion={reducedMotion}
      />

      {/* CH 0 — cold open */}
      <ColdOpen />

      {/* CH 1 — map reveal */}
      <MapReveal />

      {/* CH 2..N — the walk */}
      <div className="relative z-10">
        {spots.map((spot, index) => (
          <Spot key={spot.id} spot={spot} index={index} />
        ))}
      </div>
    </div>
  );
}

function ColdOpen() {
  return (
    <section className="relative z-20 min-h-[100vh] flex flex-col items-center justify-center px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="font-hand text-[clamp(4rem,14vw,9rem)] text-[var(--map-ink)]"
      >
        munna,
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="font-display-italic mt-4 text-[clamp(2rem,6vw,4rem)] text-[var(--ink-soft)] max-w-3xl leading-[1.05]"
      >
        i&apos;m taking you somewhere.
      </motion.p>
    </section>
  );
}

function MapReveal() {
  return (
    <section className="relative z-20 min-h-[80vh] flex items-end justify-center pb-24 px-6">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(3rem,11vw,7rem)] text-[var(--map-ink)] tracking-[-0.03em]"
        >
          one last walk.
        </motion.p>
      </div>
    </section>
  );
}
