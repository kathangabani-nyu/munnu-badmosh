"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { getMediaForFolder } from "@/data/media";
import { SpotDefinition } from "@/data/spots";
import { Note } from "./Note";
import { PinnedPhoto } from "./PinnedPhoto";

interface SpotProps {
  spot: SpotDefinition;
  index: number;
}

export function Spot({ spot, index }: SpotProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.5, margin: "-12% 0px -12% 0px" });

  const media = useMemo(() => getMediaForFolder(spot.photoFolder), [spot.photoFolder]);

  // Stagger orientation per spot for visual rhythm
  const isLeftAligned = index % 2 === 0;

  return (
    <section
      ref={ref}
      className="relative z-10 min-h-[100vh] py-32 px-5 md:px-12 flex items-center"
    >
      <motion.div
        animate={{ opacity: inView ? 1 : 0.55 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`mx-auto w-full max-w-6xl ${isLeftAligned ? "md:pr-16" : "md:pl-16 md:ml-auto md:max-w-5xl"}`}
      >
        {/* Catalog tag — tiny, brutalist */}
        <p className="label-mono mb-3 opacity-60">{spot.catalogTag}</p>

        {/* Subtitle — small, unfussy */}
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-mute)] mb-2">
          {spot.place}
        </p>

        {/* Display title — Claude editorial scale */}
        <h2 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] text-[var(--map-ink)] mb-1 max-w-3xl">
          {spot.name}
        </h2>

        {/* Handwritten note — sits right under the title */}
        <Note text={spot.note} className="mb-10 max-w-2xl font-hand text-[1.35rem] md:text-[1.45rem] text-[var(--ink-soft)]" />

        {/* Layout switcher; empty folders intentionally render no photo grid */}
        {media.length === 0 ? null : (
          <>
            {spot.layout === "hero" && media[0] && (
              <PinnedPhoto media={media[0]} variant="hero" rotation={-1.2} />
            )}

            {spot.layout === "scatter" && (
              <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-3 mt-6">
                {media.slice(0, 4).map((m, i) => {
                  const placements = [
                    "md:col-span-7 md:col-start-1 md:row-start-1",
                    "md:col-span-5 md:col-start-8 md:row-start-1 md:mt-12",
                    "md:col-span-4 md:col-start-2 md:row-start-2 md:mt-8",
                    "md:col-span-6 md:col-start-7 md:row-start-2",
                  ];
                  return (
                    <div key={`${spot.id}-${m.id}`} className={placements[i] ?? ""}>
                      <PinnedPhoto
                        media={m}
                        variant="scatter"
                        rotation={[-2.4, 1.6, -1.1, 2.0][i] ?? 0}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {spot.layout === "cluster" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
                {media.slice(0, 6).map((m, i) => (
                  <PinnedPhoto
                    key={`${spot.id}-${m.id}`}
                    media={m}
                    variant="cluster"
                    rotation={[-1.5, 0.8, -0.4, 1.2, -0.9, 0.6][i] ?? 0}
                  />
                ))}
              </div>
            )}

            {spot.layout === "cinematic" && media[0] && (
              <PinnedPhoto media={media[0]} variant="cinematic" rotation={0.4} showCaption />
            )}

            {spot.layout === "annotated" && media[0] && (
              <div className="md:grid md:grid-cols-[1.6fr_1fr] gap-10 items-start">
                <PinnedPhoto media={media[0]} variant="annotated" rotation={-0.8} />
                {media[1] && (
                  <div className="mt-6 md:mt-24">
                    <PinnedPhoto media={media[1]} variant="cluster" rotation={1.6} />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </motion.div>
    </section>
  );
}
