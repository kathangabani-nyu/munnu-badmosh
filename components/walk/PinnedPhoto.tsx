"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MediaItem } from "@/data/media";

type PinnedVariant = "hero" | "scatter" | "cluster" | "cinematic" | "annotated";

interface PinnedPhotoProps {
  media: MediaItem;
  variant: PinnedVariant;
  rotation?: number;
  showCaption?: boolean;
}

const aspect: Record<PinnedVariant, string> = {
  hero: "aspect-[4/5] md:aspect-[16/10]",
  scatter: "aspect-[4/5]",
  cluster: "aspect-square",
  cinematic: "aspect-[16/9]",
  annotated: "aspect-[4/5]",
};

export function PinnedPhoto({ media, variant, rotation = 0, showCaption = false }: PinnedPhotoProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 28, rotate: rotation * 0.6 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ rotate: rotation * 0.5, y: -2 }}
      className="relative"
    >
      {/* Push-pin */}
      <div
        aria-hidden
        className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 w-2.5 h-2.5 rounded-full bg-[var(--map-accent)] shadow-[0_2px_3px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]"
      />

      {/* Washi tape — top corner */}
      <div
        aria-hidden
        className="absolute -top-2 right-4 z-20 w-16 h-5 rotate-[6deg] rounded-[1px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(217,158,87,0.55) 0%, rgba(217,158,87,0.42) 50%, rgba(217,158,87,0.55) 100%)",
          boxShadow: "0 1px 1px rgba(0,0,0,0.05)",
        }}
      />

      {/* The image / video itself */}
      <div
        className={`relative ${aspect[variant]} overflow-hidden bg-[var(--paper-shadow)] shadow-[0_18px_40px_-22px_rgba(31,29,26,0.55),0_4px_10px_-4px_rgba(31,29,26,0.18)] ring-1 ring-black/5`}
      >
        {!loaded && <div className="absolute inset-0 bg-[var(--paper-shadow)] animate-pulse" />}
        {media.type === "photo" ? (
          <img
            src={media.src}
            alt=""
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={media.src}
            playsInline
            muted
            loop
            preload="metadata"
            controls
            onLoadedData={() => setLoaded(true)}
            className="w-full h-full object-cover bg-black"
          />
        )}
        {/* Gentle vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.08] via-transparent to-black/[0.02]" />
      </div>

      {/* Caption tape — pulls from her existing captions */}
      {media.caption && (showCaption || variant !== "cluster") && (
        <figcaption className="mt-3">
          <span className="font-mono text-[11px] leading-relaxed text-[var(--ink-mute)] tracking-[0.02em]">
            {media.caption}
          </span>
        </figcaption>
      )}
    </motion.figure>
  );
}
