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
const CINEMATIC_TRANSITION_MS = 2300;
const REDUCED_TRANSITION_MS = 220;

const STAR_STREAKS = Array.from({ length: 52 }, (_, index) => ({
  id: index,
  x: (index * 29 + 13) % 100,
  y: (index * 47 + 19) % 100,
  delay: (index % 9) * 0.045,
  length: 34 + (index % 7) * 16,
  rotate: -18 + (index % 8) * 5.4,
}));

const SOLAR_LINEUP = [
  { id: "mercury", size: 18, color: "#b9a58d", glow: "rgba(220, 200, 170, 0.28)" },
  { id: "venus", size: 30, color: "#e2b96f", glow: "rgba(255, 203, 127, 0.38)" },
  { id: "earth", size: 32, color: "#4d93d9", glow: "rgba(127, 184, 255, 0.42)" },
  { id: "mars", size: 24, color: "#c85d3f", glow: "rgba(255, 112, 80, 0.35)" },
  { id: "jupiter", size: 64, color: "#caa47b", glow: "rgba(255, 202, 144, 0.34)" },
  { id: "saturn", size: 56, color: "#d8c18a", glow: "rgba(255, 224, 152, 0.3)" },
  { id: "uranus", size: 40, color: "#94d8e8", glow: "rgba(148, 216, 232, 0.26)" },
  { id: "neptune", size: 38, color: "#4a71d9", glow: "rgba(90, 128, 255, 0.26)" },
];

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

function SolarSystemPassage({ movingForward }: { movingForward: boolean }) {
  return (
    <div className="cosmic-solar-passage">
      <motion.i
        className="cosmic-solar-neighbor venus"
        initial={{
          opacity: movingForward ? 0 : 0.1,
          scale: movingForward ? 1.72 : 0.34,
          x: movingForward ? -22 : -320,
          y: movingForward ? 18 : -28,
          filter: movingForward ? "blur(12px)" : "blur(18px)",
        }}
        animate={{
          opacity: movingForward ? [0, 0.9, 0.84, 0] : [0, 0.62, 0.9, 0],
          scale: movingForward ? [1.72, 1.18, 0.64, 0.28] : [0.28, 0.64, 1.18, 1.72],
          x: movingForward ? [-22, -118, -238, -360] : [-360, -238, -118, -22],
          y: movingForward ? [18, -4, -18, -30] : [-30, -18, -4, 18],
          filter: ["blur(12px)", "blur(1px)", "blur(2px)", "blur(18px)"],
        }}
        transition={{ delay: 0.18, duration: 1.76, ease: EASE }}
      />
      <motion.i
        className="cosmic-solar-neighbor mars"
        initial={{
          opacity: movingForward ? 0 : 0.1,
          scale: movingForward ? 1.52 : 0.3,
          x: movingForward ? 34 : 340,
          y: movingForward ? 30 : 84,
          filter: movingForward ? "blur(12px)" : "blur(18px)",
        }}
        animate={{
          opacity: movingForward ? [0, 0.86, 0.82, 0] : [0, 0.58, 0.86, 0],
          scale: movingForward ? [1.52, 1.05, 0.58, 0.26] : [0.26, 0.58, 1.05, 1.52],
          x: movingForward ? [34, 146, 278, 410] : [410, 278, 146, 34],
          y: movingForward ? [30, 44, 62, 84] : [84, 62, 44, 30],
          filter: ["blur(12px)", "blur(1px)", "blur(2px)", "blur(18px)"],
        }}
        transition={{ delay: 0.34, duration: 1.7, ease: EASE }}
      />

      <motion.div
        className="cosmic-solar-lineup"
        initial={{
          opacity: movingForward ? 0 : 0.35,
          scale: movingForward ? 1.55 : 0.68,
          y: movingForward ? 62 : -18,
          filter: movingForward ? "blur(20px)" : "blur(6px)",
        }}
        animate={{
          opacity: movingForward ? [0, 0, 0.95, 1, 0.34] : [0.34, 1, 0.95, 0, 0],
          scale: movingForward ? [1.55, 1.32, 1, 0.82, 0.72] : [0.72, 0.82, 1, 1.32, 1.55],
          y: movingForward ? [62, 24, 0, -8, -18] : [-18, -8, 0, 24, 62],
          filter: movingForward
            ? ["blur(20px)", "blur(12px)", "blur(0px)", "blur(0px)", "blur(8px)"]
            : ["blur(8px)", "blur(0px)", "blur(0px)", "blur(12px)", "blur(20px)"],
        }}
        transition={{ delay: 0.78, duration: 2.28, ease: EASE }}
      >
        <i className="cosmic-solar-sun" />
        <div className="cosmic-solar-lineup-track">
          {SOLAR_LINEUP.map((planet) => (
            <i
              key={planet.id}
              className={`cosmic-solar-body ${planet.id}`}
              style={
                {
                  "--body-size": `${planet.size}px`,
                  "--body-color": planet.color,
                  "--body-glow": planet.glow,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="cosmic-solar-boom"
        initial={{ opacity: 0, scale: 0.42 }}
        animate={{ opacity: [0, 0, 0.85, 0], scale: [0.42, 0.9, 1.7, 2.7] }}
        transition={{ delay: movingForward ? 2.42 : 0.18, duration: 0.92, ease: EASE }}
      />
    </div>
  );
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
  const solarPassage =
    (fromStage?.id === "earth" && toStage?.id === "solar") ||
    (fromStage?.id === "solar" && toStage?.id === "earth");
  const blackHolePassage = fromStage?.id === "nebula" || toStage?.id === "black-hole";
  const transitionClass = `route-${fromStage?.id ?? "unknown"}-to-${toStage?.id ?? "unknown"}`;
  const fromBackdropDuration = solarPassage ? 1.48 : 1.16;
  const toBackdropDelay = solarPassage ? 0.72 : 0.34;
  const toBackdropScale = solarPassage ? 1.58 : blackHolePassage ? 1.7 : 1.44;
  const tunnelDuration = solarPassage ? 1.88 : blackHolePassage ? 2.04 : 1.56;

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
      className={`cosmic-cinematic-transition ${movingForward ? "forward" : "backward"} ${transitionClass}`}
      aria-hidden
    >
      <motion.div
        className="cosmic-transition-backdrop from"
        style={{ backgroundImage: `url("${fromStage.backdrop}")` }}
        initial={{ opacity: 0.86, scale: movingForward ? 1.02 : 0.92, filter: "blur(0px)" }}
        animate={{ opacity: 0, scale: movingForward ? 0.52 : 1.28, filter: "blur(12px)" }}
        transition={{ duration: fromBackdropDuration, ease: EASE }}
      />
      <motion.div
        className="cosmic-transition-backdrop to"
        style={{ backgroundImage: `url("${toStage.backdrop}")` }}
        initial={{ opacity: 0, scale: movingForward ? toBackdropScale : 0.74, filter: "blur(14px)" }}
        animate={{ opacity: 0.92, scale: 1.03, filter: "blur(0px)" }}
        transition={{ delay: toBackdropDelay, duration: 1.08, ease: EASE }}
      />

      <motion.div
        className="cosmic-camera-wake"
        initial={{ opacity: 0, scale: movingForward ? 0.78 : 1.16, rotate: movingForward ? -9 : 9 }}
        animate={{
          opacity: [0, 0.92, 0.68, 0],
          scale: movingForward ? [0.78, 1.04, 1.48, 1.9] : [1.26, 1.02, 0.82, 0.62],
          rotate: movingForward ? [-9, 0, 10, 20] : [9, 0, -10, -20],
        }}
        transition={{ duration: tunnelDuration, ease: EASE }}
      >
        {Array.from({ length: 7 }, (_, index) => (
          <i
            key={index}
            style={
              {
                "--ring-size": `${18 + index * 11}vmin`,
                "--ring-opacity": `${0.62 - index * 0.065}`,
              } as CSSProperties
            }
          />
        ))}
      </motion.div>

      <motion.div
        className="cosmic-flight-tunnel"
        initial={{ opacity: 0, scale: movingForward ? 0.68 : 1.24, rotate: movingForward ? -8 : 8 }}
        animate={{ opacity: [0, 0.95, 0.72, 0], scale: movingForward ? [0.68, 1.18, 1.92, 2.38] : [1.28, 0.98, 0.72, 0.58], rotate: movingForward ? 18 : -18 }}
        transition={{ duration: tunnelDuration, ease: EASE }}
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

      {solarPassage && <SolarSystemPassage movingForward={movingForward} />}

      <motion.div
        className="cosmic-match-flare"
        initial={{ opacity: 0, scaleX: 0.2, scaleY: 0.58, rotate: movingForward ? -18 : 18 }}
        animate={{
          opacity: [0, 0.84, 0],
          scaleX: [0.2, 1.4, 2.1],
          scaleY: [0.58, 0.78, 0.2],
          rotate: movingForward ? [-18, -6, 8] : [18, 6, -8],
        }}
        transition={{ delay: solarPassage ? 0.46 : 0.28, duration: 0.94, ease: EASE }}
      />

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
        animate={{ opacity: [0, 0.94, 0.62, 0], scale: [0.18, 0.94, 1.74, 3.1] }}
        transition={{ delay: 0.12, duration: 1.52, ease: EASE }}
        style={{ "--stage-accent": toStage.accent } as CSSProperties}
      />

      <motion.div
        className="cosmic-arrival-bloom"
        initial={{ opacity: 0, scale: 0.72 }}
        animate={{ opacity: [0, 0, 0.74, 0], scale: [0.72, 1, 1.55, 2.35] }}
        transition={{ delay: solarPassage ? 1.18 : 0.86, duration: 0.82, ease: EASE }}
        style={{ "--stage-accent": toStage.accent } as CSSProperties}
      />
    </div>
  );
}

export function CosmicArchive({ className = "" }: CosmicArchiveProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioStartedRef = useRef(false);
  const audioAttemptRef = useRef(false);
  const touchStartY = useRef(0);
  const busyRef = useRef(false);
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [cinematicTransition, setCinematicTransition] = useState<CinematicTransitionState | null>(null);
  const reducedMotion = useReducedMotionPreference();
  const stage = COSMIC_STAGES[page];

  const startAudio = useCallback(() => {
    if (audioStartedRef.current || audioAttemptRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.82;
    audioAttemptRef.current = true;
    audio
      .play()
      .then(() => {
        audioStartedRef.current = true;
      })
      .catch(() => {
        audioStartedRef.current = false;
      })
      .finally(() => {
        audioAttemptRef.current = false;
      });
  }, []);

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

      startAudio();
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
    [finishCinematicTransition, lightboxIndex, page, reducedMotion, startAudio]
  );

  useEffect(() => {
    setLightboxIndex(null);
  }, [page]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "PageDown") {
        startAudio();
        goTo(page + 1);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "PageUp") {
        startAudio();
        goTo(page - 1);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goTo, page, startAudio]);

  useEffect(() => {
    return () => {
      if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current);
    };
  }, []);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    startAudio();
    event.preventDefault();
    if (Math.abs(event.deltaY) < 24) return;
    goTo(page + (event.deltaY > 0 ? 1 : -1));
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = event.touches[0]?.clientY ?? 0;
    startAudio();
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const endY = event.changedTouches[0]?.clientY ?? touchStartY.current;
    const deltaY = touchStartY.current - endY;
    if (Math.abs(deltaY) > 44) goTo(page + (deltaY > 0 ? 1 : -1));
  };

  return (
    <main className={`cosmic-shell ${className}`}>
      <audio ref={audioRef} src="/media/Radiohead - Weird Fishes _ Arpeggi.mp3" loop preload="auto" />
      <Link href="/imessage" className="cosmic-chat-link" aria-label="open Kathan iMessage">
        Kathan - iMessage
      </Link>

      <div
        className="cosmic-stage"
        style={{ "--stage-accent": stage.accent } as CSSProperties}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerDown={startAudio}
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
              direction={direction}
              ready={!cinematicTransition || cinematicTransition.to === page}
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
              onClick={() => {
                startAudio();
                goTo(index);
              }}
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
