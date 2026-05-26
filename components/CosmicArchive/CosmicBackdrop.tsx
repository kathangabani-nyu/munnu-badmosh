"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import type { CosmicStageConfig } from "./stages";

interface CosmicBackdropProps {
  stages: CosmicStageConfig[];
  activeIndex: number;
  direction: number;
  reducedMotion: boolean;
}

export function CosmicBackdrop({ stages, activeIndex, direction, reducedMotion }: CosmicBackdropProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const activeDepth = stages[activeIndex]?.cameraDepth ?? 0;
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

  useEffect(() => {
    if (reducedMotion || !backdropRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cosmic-sparse-stars i",
        { y: direction > 0 ? 18 : -18, opacity: 0.05 },
        {
          y: 0,
          opacity: (index) => 0.18 + (index % 5) * 0.055,
          duration: 1.18,
          stagger: { amount: 0.42, from: direction > 0 ? "start" : "end" },
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        ".cosmic-backdrop-veil",
        { opacity: 0.72 },
        { opacity: 1, duration: 1.24, ease: "sine.out" }
      );
    }, backdropRef);

    return () => ctx.revert();
  }, [activeIndex, direction, reducedMotion]);

  return (
    <div ref={backdropRef} className="cosmic-backdrop" aria-hidden>
      {stages.map((stage, index) => {
        const active = index === activeIndex;
        const depthDelta = stage.cameraDepth - activeDepth;
        const activeScale = Math.max(0.92, 1.1 - activeDepth * 0.032);
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
              scale: reducedMotion ? 1 : active ? activeScale : activeScale + 0.12 + depthDelta * 0.025,
              y: reducedMotion || active ? 0 : direction > 0 ? -18 : 18,
            }}
            transition={{ duration: reducedMotion ? 0.01 : 1.22, ease: [0.16, 1, 0.3, 1] }}
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
