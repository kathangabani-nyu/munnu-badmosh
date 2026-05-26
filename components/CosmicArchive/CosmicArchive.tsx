"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TouchEvent, WheelEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ConstellationScene } from "./ConstellationScene";
import { CosmicBackdrop } from "./CosmicBackdrop";
import { FigurePhoto } from "./FigurePhoto";
import { Lightbox } from "./Lightbox";
import { COSMIC_STAGES } from "./stages";

const Globe = dynamic(() => import("./Globe").then((mod) => mod.Globe), { ssr: false });

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface CosmicArchiveProps {
  className?: string;
}

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return reduced;
}

function StageTitle({
  kicker,
  title,
  reducedMotion,
}: {
  kicker: string;
  title: string;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className="cosmic-stage-title"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.62, ease: EASE }}
    >
      <p>{kicker}</p>
      <h1>{title}</h1>
    </motion.div>
  );
}

function StageFigures({ stageId }: { stageId: string }) {
  if (stageId === "earth") {
    return (
      <motion.div
        className="cosmic-figure-anchor cosmic-figure-anchor-earth"
        initial={{ opacity: 0, y: 28, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.78, ease: EASE }}
        aria-hidden
      >
        <FigurePhoto kind="codyMay" />
      </motion.div>
    );
  }

  if (stageId === "milky-way") {
    return (
      <motion.div
        className="cosmic-figure-anchor cosmic-figure-anchor-us"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.72, ease: EASE }}
        aria-hidden
      >
        <FigurePhoto kind="cody" />
        <FigurePhoto kind="may" />
      </motion.div>
    );
  }

  if (stageId === "black-hole") {
    return (
      <motion.div
        className="cosmic-figure-anchor cosmic-figure-anchor-final"
        initial={{ opacity: 0, y: 24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.22, duration: 0.76, ease: EASE }}
        aria-hidden
      >
        <FigurePhoto kind="codyMay" />
      </motion.div>
    );
  }

  return null;
}

export function CosmicArchive({ className = "" }: CosmicArchiveProps) {
  const touchStartY = useRef(0);
  const busyRef = useRef(false);
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotionPreference();
  const stage = COSMIC_STAGES[page];

  const goTo = useCallback(
    (nextPage: number) => {
      if (lightboxIndex !== null) return;
      if (busyRef.current || nextPage < 0 || nextPage >= COSMIC_STAGES.length || nextPage === page) return;

      setDirection(nextPage > page ? 1 : -1);
      setPage(nextPage);
      busyRef.current = true;
      if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = setTimeout(() => {
        busyRef.current = false;
      }, reducedMotion ? 80 : 650);
    },
    [lightboxIndex, page, reducedMotion]
  );

  useEffect(() => {
    setLightboxIndex(null);
  }, [page]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "PageDown") goTo(page + 1);
      if (event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "PageUp") goTo(page - 1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goTo, page]);

  useEffect(() => {
    return () => {
      if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current);
    };
  }, []);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (Math.abs(event.deltaY) < 24) return;
    goTo(page + (event.deltaY > 0 ? 1 : -1));
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = event.touches[0]?.clientY ?? 0;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const endY = event.changedTouches[0]?.clientY ?? touchStartY.current;
    const deltaY = touchStartY.current - endY;
    if (Math.abs(deltaY) > 44) goTo(page + (deltaY > 0 ? 1 : -1));
  };

  return (
    <main className={`cosmic-shell ${className}`}>
      <Link href="/imessage" className="cosmic-chat-link" aria-label="open Kathan iMessage">
        Kathan - iMessage
      </Link>

      <div
        className="cosmic-stage"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        aria-label="cosmic memory archive"
      >
        <CosmicBackdrop stages={COSMIC_STAGES} activeIndex={page} reducedMotion={reducedMotion} />
        <Globe visible={stage.id === "earth"} reducedMotion={reducedMotion} />
        <div className="cosmic-vignette" aria-hidden />
        <div className="cosmic-grain" aria-hidden />

        <AnimatePresence initial={false} mode="wait">
          <StageTitle key={`${stage.id}-title`} kicker={stage.kicker} title={stage.title} reducedMotion={reducedMotion} />
        </AnimatePresence>

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.section
            key={stage.id}
            className="cosmic-page"
            custom={direction}
            initial={{ y: direction > 0 ? 70 : -70, opacity: 0, filter: "blur(18px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: direction > 0 ? -70 : 70, opacity: 0, filter: "blur(18px)" }}
            transition={{ duration: reducedMotion ? 0.01 : 0.72, ease: EASE }}
          >
            <ConstellationScene
              stage={stage}
              reducedMotion={reducedMotion}
              onOpen={(index) => setLightboxIndex(index)}
            />
            <StageFigures stageId={stage.id} />
          </motion.section>
        </AnimatePresence>

        <nav className="cosmic-nav" aria-label="cosmic chapters">
          {COSMIC_STAGES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`go to ${item.title}`}
              className={index === page ? "active" : ""}
              onClick={() => goTo(index)}
            />
          ))}
        </nav>
      </div>

      <Lightbox
        nodes={stage.nodes}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </main>
  );
}
