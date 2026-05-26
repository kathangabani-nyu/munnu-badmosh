"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, TouchEvent, WheelEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ConstellationScene } from "./ConstellationScene";
import { CosmicBackdrop } from "./CosmicBackdrop";
import { FigurePhoto } from "./FigurePhoto";
import { Lightbox } from "./Lightbox";
import { COSMIC_STAGES, type CosmicStageConfig } from "./stages";

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

function AmbientFigures({
  stage,
  reducedMotion,
}: {
  stage: CosmicStageConfig;
  reducedMotion: boolean;
}) {
  if (stage.figureMode === "none") return null;

  const float = reducedMotion
    ? { opacity: 0.88, y: 0 }
    : { opacity: 0.9, y: [0, -16, 0], x: [0, 7, 0], rotate: [-1, 1.5, -1] };
  const transition = reducedMotion
    ? { duration: 0.01 }
    : { duration: 7.8, ease: "easeInOut", repeat: Infinity };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${stage.id}-${stage.figureMode}`}
        className={`cosmic-ambient-figures cosmic-ambient-figures-${stage.figureMode}`}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: reducedMotion ? 0.01 : 0.7, ease: EASE }}
        aria-hidden
      >
        {stage.figureMode === "codyMay" ? (
          <motion.div className="cosmic-ambient-figure cosmic-ambient-codyMay" animate={float} transition={transition}>
            <FigurePhoto kind="codyMay" />
          </motion.div>
        ) : (
          <>
            <motion.div className="cosmic-ambient-figure cosmic-ambient-cody" animate={float} transition={transition}>
              <FigurePhoto kind="cody" />
            </motion.div>
            <motion.div
              className="cosmic-ambient-figure cosmic-ambient-may"
              animate={reducedMotion ? float : { opacity: 0.9, y: [0, 14, 0], x: [0, -6, 0], rotate: [1, -1.5, 1] }}
              transition={reducedMotion ? transition : { duration: 8.6, ease: "easeInOut", repeat: Infinity }}
            >
              <FigurePhoto kind="may" />
            </motion.div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function getCameraState(stage: CosmicStageConfig, direction: number, phase: "enter" | "center" | "exit", reducedMotion: boolean) {
  if (reducedMotion) {
    return { opacity: phase === "center" ? 1 : 0, scale: 1, y: 0, filter: "blur(0px)" };
  }

  const depthScale = Math.max(0.72, 1 - stage.cameraDepth * 0.035);

  if (phase === "enter") {
    return {
      opacity: 0,
      scale: direction > 0 ? depthScale * 1.18 : depthScale * 0.86,
      y: direction > 0 ? 34 : -24,
      filter: "blur(20px)",
    };
  }

  if (phase === "exit") {
    return {
      opacity: 0,
      scale: direction > 0 ? depthScale * 0.78 : depthScale * 1.16,
      y: direction > 0 ? -28 : 30,
      filter: "blur(22px)",
    };
  }

  return {
    opacity: 1,
    scale: depthScale,
    y: 0,
    filter: "blur(0px)",
  };
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
        style={{ "--stage-accent": stage.accent } as CSSProperties}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        aria-label="cosmic memory archive"
      >
        <CosmicBackdrop stages={COSMIC_STAGES} activeIndex={page} direction={direction} reducedMotion={reducedMotion} />
        <Globe visible={stage.id === "earth"} reducedMotion={reducedMotion} />
        <div className="cosmic-vignette" aria-hidden />
        <div className="cosmic-grain" aria-hidden />
        <AmbientFigures stage={stage} reducedMotion={reducedMotion} />

        <AnimatePresence initial={false} mode="wait">
          <StageTitle key={`${stage.id}-title`} kicker={stage.kicker} title={stage.title} reducedMotion={reducedMotion} />
        </AnimatePresence>

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.section
            key={stage.id}
            className="cosmic-page"
            custom={direction}
            initial={getCameraState(stage, direction, "enter", reducedMotion)}
            animate={getCameraState(stage, direction, "center", reducedMotion)}
            exit={getCameraState(stage, direction, "exit", reducedMotion)}
            transition={{ duration: reducedMotion ? 0.01 : 0.92, ease: EASE }}
          >
            <ConstellationScene
              stage={stage}
              reducedMotion={reducedMotion}
              onOpen={(index) => setLightboxIndex(index)}
            />
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
