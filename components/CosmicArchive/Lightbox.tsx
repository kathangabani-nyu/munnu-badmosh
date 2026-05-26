"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ArchiveNode } from "./stages";
import type { MediaItem } from "@/data/media";

interface LightboxProps {
  nodes: ArchiveNode[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  reducedMotion: boolean;
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

function mediaLabel(item: MediaItem) {
  const cleanName = item.filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
  return cleanName.length > 42 ? `${cleanName.slice(0, 39).trim()}...` : cleanName;
}

function lightboxInitial(direction: number, reducedMotion: boolean) {
  if (reducedMotion) return { opacity: 0, scale: 0.98, filter: "blur(0px)" };

  return {
    x: direction > 0 ? 140 : -140,
    rotateY: direction > 0 ? -13 : 13,
    scale: 0.92,
    opacity: 0,
    filter: "blur(16px)",
  };
}

function lightboxExit(direction: number, reducedMotion: boolean) {
  if (reducedMotion) return { opacity: 0, scale: 0.98, filter: "blur(0px)" };

  return {
    x: direction > 0 ? -140 : 140,
    rotateY: direction > 0 ? 13 : -13,
    scale: 0.92,
    opacity: 0,
    filter: "blur(16px)",
  };
}

export function Lightbox({ nodes, index, onIndexChange, onClose, reducedMotion }: LightboxProps) {
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
          aria-label={active.label}
        >
          <div className="cosmic-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <p>{active.items[0]?.type === "video" ? "video memory" : "photo memory"}</p>
            <h2>{active.label}</h2>
            <span>
              {index !== null ? index + 1 : 1} / {nodes.length}
            </span>
          </div>

          <Button type="button" variant="glass" size="icon" className="cosmic-lightbox-close" onClick={onClose} aria-label="close">
            <X className="h-5 w-5" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="glass"
            size="icon"
            className="cosmic-lightbox-arrow cosmic-lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
            }}
            aria-label="previous"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Button>
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={active.id}
              className={`cosmic-lightbox-frame ${active.items.length > 1 ? "paired" : ""}`}
              onClick={(event) => event.stopPropagation()}
              custom={direction}
              drag={reducedMotion ? false : "x"}
              dragElastic={reducedMotion ? 0 : 0.18}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={reducedMotion ? undefined : handleDragEnd}
              initial={lightboxInitial(direction, reducedMotion)}
              animate={{ x: 0, rotateY: 0, scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={lightboxExit(direction, reducedMotion)}
              transition={{ duration: reducedMotion ? 0.12 : 0.46, ease: [0.16, 1, 0.3, 1] }}
            >
              {active.items.map((item) => (
                <figure key={item.src} className="cosmic-lightbox-figure">
                  <ExpandedMedia item={item} />
                  <figcaption>{mediaLabel(item)}</figcaption>
                </figure>
              ))}
            </motion.div>
          </AnimatePresence>
          <Button
            type="button"
            variant="glass"
            size="icon"
            className="cosmic-lightbox-arrow cosmic-lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            aria-label="next"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
