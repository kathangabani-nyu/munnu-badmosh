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
const CINEMATIC_TRANSITION_MS = 1850;
const REDUCED_TRANSITION_MS = 220;

const STAR_STREAKS = Array.from({ length: 52 }, (_, index) => ({
  id: index,
  x: (index * 29 + 13) % 100,
  y: (index * 47 + 19) % 100,
  delay: (index % 9) * 0.045,
  length: 34 + (index % 7) * 16,
  rotate: -18 + (index % 8) * 5.4,
}));

interface CosmicArchiveProps {
  className?: string;
}

interface CinematicTransitionState {
  id: number;
  from: number;
  to: number;
  direction: number;
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
      exit={{ opacity: 0, y: -10, transition: { duration: reducedMotion ? 0.01 : 0.16 } }}
      transition={{ duration: reducedMotion ? 0.01 : 0.62, ease: EASE }}
    >
      <p>{kicker}</p>
      <h1>{title}</h1>
    </motion.div>
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

function CinematicTransition({
  state,
  stages,
  reducedMotion,
  onDone,
}: {
  state: CinematicTransitionState;
  stages: CosmicStageConfig[];
  reducedMotion: boolean;
  onDone: (id: number) => void;
}) {
  const fromStage = stages[state.from];
  const toStage = stages[state.to];
  const movingForward = state.direction > 0;
  const touchesEarth = fromStage?.id === "earth" || toStage?.id === "earth";

  useEffect(() => {
    if (!fromStage || !toStage) return;
    const timer = window.setTimeout(
      () => onDone(state.id),
      reducedMotion ? REDUCED_TRANSITION_MS : CINEMATIC_TRANSITION_MS
    );
    return () => window.clearTimeout(timer);
  }, [fromStage, onDone, reducedMotion, state.id, toStage]);

  if (!fromStage || !toStage) return null;

  if (reducedMotion) {
    return (
      <div
        key={state.id}
        className="cosmic-cinematic-transition reduced"
        aria-hidden
      >
        <div
          className="cosmic-transition-backdrop to"
          style={{ backgroundImage: `url("${toStage.backdrop}")` }}
        />
      </div>
    );
  }

  return (
    <div
      key={state.id}
      className={`cosmic-cinematic-transition ${movingForward ? "forward" : "backward"}`}
      aria-hidden
    >
      <motion.div
        className="cosmic-transition-backdrop from"
        style={{ backgroundImage: `url("${fromStage.backdrop}")` }}
        initial={{ opacity: 0.82, scale: movingForward ? 1.02 : 0.88, filter: "blur(0px)" }}
        animate={{ opacity: 0, scale: movingForward ? 0.54 : 1.24, filter: "blur(18px)" }}
        transition={{ duration: 1.55, ease: EASE }}
      />
      <motion.div
        className="cosmic-transition-backdrop to"
        style={{ backgroundImage: `url("${toStage.backdrop}")` }}
        initial={{ opacity: 0, scale: movingForward ? 1.42 : 0.74, filter: "blur(22px)" }}
        animate={{ opacity: 0.88, scale: 1.04, filter: "blur(0px)" }}
        transition={{ delay: 0.28, duration: 1.28, ease: EASE }}
      />

      <motion.div
        className="cosmic-flight-tunnel"
        initial={{ opacity: 0, scale: movingForward ? 0.68 : 1.24, rotate: movingForward ? -8 : 8 }}
        animate={{ opacity: [0, 0.95, 0.72, 0], scale: movingForward ? [0.68, 1.18, 1.92, 2.38] : [1.28, 0.98, 0.72, 0.58], rotate: movingForward ? 18 : -18 }}
        transition={{ duration: 1.72, ease: EASE }}
      />

      {touchesEarth && (
        <motion.div
          className="cosmic-transition-planet"
          style={{ backgroundImage: 'url("/media/space/earth-blue-marble.jpg")' }}
          initial={{
            opacity: movingForward ? 0.98 : 0,
            scale: movingForward ? 1.18 : 0.1,
            x: movingForward ? 0 : -86,
            y: movingForward ? 0 : -54,
            filter: movingForward ? "blur(0px)" : "blur(14px)",
          }}
          animate={{
            opacity: movingForward ? [0.98, 0.92, 0] : [0, 0.84, 0.98],
            scale: movingForward ? [1.18, 0.54, 0.12] : [0.1, 0.54, 1.12],
            x: movingForward ? [0, -28, -104] : [-104, -28, 0],
            y: movingForward ? [0, -22, -68] : [-68, -22, 0],
            filter: movingForward
              ? ["blur(0px)", "blur(1px)", "blur(16px)"]
              : ["blur(16px)", "blur(1px)", "blur(0px)"],
          }}
          transition={{ duration: 1.54, ease: EASE }}
        />
      )}

      <div className="cosmic-flight-streaks">
        {STAR_STREAKS.map((streak) => (
          <motion.i
            key={streak.id}
            style={
              {
                "--x": `${streak.x}%`,
                "--y": `${streak.y}%`,
                "--length": `${streak.length}px`,
                "--rotate": `${streak.rotate}deg`,
              } as CSSProperties
            }
            initial={{ opacity: 0, scaleX: 0.2, x: 0, y: 0 }}
            animate={{
              opacity: [0, 0.9, 0],
              scaleX: [0.2, 1.25, 0.5],
              x: movingForward ? [0, -90, -180] : [0, 90, 180],
              y: movingForward ? [0, -42, -96] : [0, 42, 96],
            }}
            transition={{ delay: streak.delay, duration: 0.82, ease: EASE }}
          />
        ))}
      </div>

      <motion.div
        className="cosmic-transition-figures"
        initial={{ opacity: 0, y: movingForward ? 46 : -36, scale: 0.7, filter: "blur(18px)" }}
        animate={{
          opacity: [0, 0.92, 0.82, 0],
          y: movingForward ? [46, 0, -18, -78] : [-36, 0, 18, 70],
          scale: movingForward ? [0.72, 1, 0.94, 0.62] : [0.62, 0.92, 1, 1.18],
          filter: ["blur(18px)", "blur(0px)", "blur(0px)", "blur(20px)"],
        }}
        transition={{ delay: 0.22, duration: 1.24, ease: EASE }}
      >
        <FigurePhoto kind="cody" />
        <FigurePhoto kind="may" />
      </motion.div>

      <motion.div
        className="cosmic-transition-iris"
        initial={{ opacity: 0, scale: 0.18 }}
        animate={{ opacity: [0, 0.9, 0], scale: [0.18, 1.22, 2.8] }}
        transition={{ delay: 0.18, duration: 1.38, ease: EASE }}
        style={{ "--stage-accent": toStage.accent } as CSSProperties}
      />
    </div>
  );
}

export function CosmicArchive({ className = "" }: CosmicArchiveProps) {
  const touchStartY = useRef(0);
  const busyRef = useRef(false);
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [cinematicTransition, setCinematicTransition] = useState<CinematicTransitionState | null>(null);
  const reducedMotion = useReducedMotionPreference();
  const stage = COSMIC_STAGES[page];

  const finishCinematicTransition = useCallback((id: number) => {
    setCinematicTransition((current) => {
      if (!current || current.id !== id) return current;
      busyRef.current = false;
      return null;
    });
  }, []);

  const goTo = useCallback(
    (nextPage: number) => {
      if (lightboxIndex !== null) return;
      if (busyRef.current || nextPage < 0 || nextPage >= COSMIC_STAGES.length || nextPage === page) return;

      const nextDirection = nextPage > page ? 1 : -1;
      const transitionId = Date.now();
      setDirection(nextDirection);
      setCinematicTransition({ id: transitionId, from: page, to: nextPage, direction: nextDirection });
      setPage(nextPage);
      busyRef.current = true;
      if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = setTimeout(() => {
        finishCinematicTransition(transitionId);
      }, reducedMotion ? REDUCED_TRANSITION_MS + 120 : CINEMATIC_TRANSITION_MS + 360);
    },
    [finishCinematicTransition, lightboxIndex, page, reducedMotion]
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

        <AnimatePresence initial={false}>
          {!cinematicTransition && (
            <StageTitle key={`${stage.id}-title`} kicker={stage.kicker} title={stage.title} reducedMotion={reducedMotion} />
          )}
        </AnimatePresence>

        <AnimatePresence initial={false} custom={direction}>
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

        <AnimatePresence>
          {cinematicTransition && (
            <CinematicTransition
              key={cinematicTransition.id}
              state={cinematicTransition}
              stages={COSMIC_STAGES}
              reducedMotion={reducedMotion}
              onDone={finishCinematicTransition}
            />
          )}
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
        reducedMotion={reducedMotion}
      />
    </main>
  );
}
