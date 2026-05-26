"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ArchiveNode } from "./stages";
import type { MediaItem } from "@/data/media";

interface LightboxProps {
  nodes: ArchiveNode[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

function ExpandedMedia({ item }: { item: MediaItem }) {
  if (item.type === "video") {
    return (
      <video
        src={item.src}
        className="cosmic-lightbox-media"
        muted
        loop
        playsInline
        autoPlay
        controls={false}
      />
    );
  }

  return <img src={item.src} alt="" className="cosmic-lightbox-media" draggable={false} />;
}

export function Lightbox({ nodes, index, onIndexChange, onClose }: LightboxProps) {
  const touchStartX = useRef(0);
  const open = index !== null && nodes[index];
  const active = open ? nodes[index] : null;

  const go = (delta: number) => {
    if (index === null || nodes.length < 1) return;
    onIndexChange((index + delta + nodes.length) % nodes.length);
  };

  useEffect(() => {
    if (!open) return undefined;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, nodes.length, onClose, open]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="cosmic-lightbox"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
        >
          <button type="button" className="cosmic-lightbox-close" onClick={onClose} aria-label="close">
            ×
          </button>
          <button
            type="button"
            className="cosmic-lightbox-arrow cosmic-lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
            }}
            aria-label="previous"
          >
            ‹
          </button>
          <motion.div
            key={active.id}
            className={`cosmic-lightbox-frame ${active.items.length > 1 ? "paired" : ""}`}
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0]?.clientX ?? 0;
            }}
            onTouchEnd={(event) => {
              const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
              const delta = touchStartX.current - endX;
              if (Math.abs(delta) > 42) go(delta > 0 ? 1 : -1);
            }}
            initial={{ y: 24, scale: 0.96, filter: "blur(12px)" }}
            animate={{ y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ y: -24, scale: 0.96, filter: "blur(12px)" }}
            transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
          >
            {active.items.map((item) => (
              <ExpandedMedia key={item.src} item={item} />
            ))}
          </motion.div>
          <button
            type="button"
            className="cosmic-lightbox-arrow cosmic-lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            aria-label="next"
          >
            ›
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
