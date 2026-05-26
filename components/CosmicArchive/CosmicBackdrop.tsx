"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { CosmicStageConfig } from "./stages";

interface CosmicBackdropProps {
  stages: CosmicStageConfig[];
  activeIndex: number;
  reducedMotion: boolean;
}

export function CosmicBackdrop({ stages, activeIndex, reducedMotion }: CosmicBackdropProps) {
  const stars = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => ({
        id: index,
        x: (index * 37 + 11) % 100,
        y: (index * 53 + 17) % 100,
        size: 1 + (index % 4) * 0.35,
        opacity: 0.18 + (index % 5) * 0.055,
      })),
    []
  );

  return (
    <div className="cosmic-backdrop" aria-hidden>
      {stages.map((stage, index) => {
        const active = index === activeIndex;
        return (
          <motion.div
            key={stage.id}
            className="cosmic-backdrop-layer"
            style={{
              backgroundImage: `url("${stage.backdrop}")`,
              backgroundPosition: stage.backdropPosition ?? "50% 50%",
            }}
            animate={{
              opacity: active ? 1 : 0,
              scale: active ? (reducedMotion ? 1 : 1.06) : 1.16,
            }}
            transition={{ duration: reducedMotion ? 0.01 : 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
      <div className="cosmic-backdrop-veil" />
      <div className="cosmic-sparse-stars">
        {stars.map((star) => (
          <i
            key={star.id}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>
    </div>
  );
}
