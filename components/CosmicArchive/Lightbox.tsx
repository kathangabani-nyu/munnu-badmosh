"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
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
  const [direction, setDirection] = useState(1);
  const open = index !== null && nodes[index];
  const active = open ? nodes[index] : null;

  const go = (delta: number) => {
    if (index === null || nodes.length < 1) return;
    setDirection(delta > 0 ? 1 : -1);
    onIndexChange((index + delta + nodes.length) % nodes.length);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const enoughDistance = Math.abs(info.offset.x) > 64;
    const enoughVelocity = Math.abs(info.velocity.x) > 430;
    if (!enoughDistance && !enoughVelocity) return;

    go(info.offset.x < 0 ? 1 : -1);
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
            <span aria-hidden />
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
            <span aria-hidden />
          </button>
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={active.id}
              className={`cosmic-lightbox-frame ${active.items.length > 1 ? "paired" : ""}`}
              onClick={(event) => event.stopPropagation()}
              custom={direction}
              drag="x"
              dragElastic={0.18}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              initial={{
                x: direction > 0 ? 140 : -140,
                rotateY: direction > 0 ? -13 : 13,
                scale: 0.92,
                opacity: 0,
                filter: "blur(16px)",
              }}
              animate={{ x: 0, rotateY: 0, scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{
                x: direction > 0 ? -140 : 140,
                rotateY: direction > 0 ? 13 : -13,
                scale: 0.92,
                opacity: 0,
                filter: "blur(16px)",
              }}
              transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
            >
              {active.items.map((item) => (
                <ExpandedMedia key={item.src} item={item} />
              ))}
            </motion.div>
          </AnimatePresence>
          <button
            type="button"
            className="cosmic-lightbox-arrow cosmic-lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            aria-label="next"
          >
            <span aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
