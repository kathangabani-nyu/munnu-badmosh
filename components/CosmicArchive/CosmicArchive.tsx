"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, TouchEvent, WheelEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ConstellationScene } from "./ConstellationScene";
import { CosmicBackdrop } from "./CosmicBackdrop";
import { CosmicHud, StageTitle } from "./CosmicHud";
import { Lightbox } from "./Lightbox";
import { COSMIC_STAGES, type CosmicStageConfig } from "./stages";

const Globe = dynamic(() => import("./Globe").then((mod) => mod.Globe), { ssr: false });

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CINEMATIC_TRANSITION_MS = 1320;
const REDUCED_TRANSITION_MS = 220;

const LENS_PARTICLES = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  x: 8 + ((index * 23) % 84),
  y: 10 + ((index * 41) % 78),
  delay: (index % 8) * 0.035,
  depth: 0.55 + (index % 5) * 0.16,
  drift: 18 + (index % 7) * 7,
  opacity: 0.24 + (index % 4) * 0.08,
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
  const fromPhase = fromStage?.phaseId ?? "unknown";
  const toPhase = toStage?.phaseId ?? "unknown";
  const blackHolePassage = [fromPhase, toPhase].some((phase) => phase === "black-hole" || phase === "wormhole");
  const transitionClass = `route-${fromPhase}-to-${toPhase}`;
  const lensScale = blackHolePassage ? 1.18 : 1;
  const lateral = movingForward ? -1 : 1;

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
        initial={{ opacity: 0.88, scale: 1, x: 0, filter: "blur(0px) brightness(0.92) saturate(1.04)" }}
        animate={{
          opacity: [0.88, 0.48, 0],
          scale: [1, 1.045, 1.16],
          x: [0, lateral * 18, lateral * 46],
          filter: [
            "blur(0px) brightness(0.92) saturate(1.04)",
            "blur(8px) brightness(0.62) saturate(0.92)",
            "blur(18px) brightness(0.28) saturate(0.75)",
          ],
        }}
        transition={{ duration: 1.08, ease: EASE }}
      />
      <motion.div
        className="cosmic-transition-backdrop to"
        style={{ backgroundImage: `url("${toStage.backdrop}")` }}
        initial={{ opacity: 0, scale: 1.13, x: lateral * -42, filter: "blur(18px) brightness(0.42) saturate(0.82)" }}
        animate={{
          opacity: [0, 0.22, 0.96],
          scale: [1.13, 1.045, 1],
          x: [lateral * -42, lateral * -10, 0],
          filter: [
            "blur(18px) brightness(0.42) saturate(0.82)",
            "blur(7px) brightness(0.68) saturate(0.95)",
            "blur(0px) brightness(0.9) saturate(1.04)",
          ],
        }}
        transition={{ delay: 0.22, duration: 1.08, ease: EASE }}
      />

      <motion.div
        className="cosmic-transition-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.92, 0.28, 0] }}
        transition={{ duration: 1.18, ease: EASE }}
      />

      <motion.div
        className="cosmic-camera-wake"
        initial={{ opacity: 0, scale: 0.86 * lensScale, rotate: movingForward ? -2 : 2 }}
        animate={{
          opacity: [0, 0.56, 0.42, 0],
          scale: [0.86 * lensScale, 1.08 * lensScale, 1.52 * lensScale, 2.08 * lensScale],
          rotate: movingForward ? [-2, 0, 2.5, 5] : [2, 0, -2.5, -5],
        }}
        transition={{ duration: 1.22, ease: EASE }}
      >
        {Array.from({ length: 4 }, (_, index) => (
          <i
            key={index}
            style={
              {
                "--ring-size": `${34 + index * 18}vmin`,
                "--ring-opacity": `${0.28 - index * 0.042}`,
              } as CSSProperties
            }
          />
        ))}
      </motion.div>

      <motion.div
        className="cosmic-flight-tunnel"
        initial={{ opacity: 0, scale: 0.84 * lensScale, rotate: movingForward ? -4 : 4 }}
        animate={{
          opacity: [0, 0.52, 0.38, 0],
          scale: [0.84 * lensScale, 1.16 * lensScale, 1.82 * lensScale, 2.56 * lensScale],
          rotate: movingForward ? [-4, -1, 2, 7] : [4, 1, -2, -7],
        }}
        transition={{ duration: 1.2, ease: EASE }}
      />

      <motion.div
        className="cosmic-match-flare"
        initial={{ opacity: 0, scaleX: 0.16, scaleY: 0.38, rotate: movingForward ? -5 : 5 }}
        animate={{
          opacity: [0, 0.42, 0],
          scaleX: [0.16, 1.05, 1.7],
          scaleY: [0.38, 0.48, 0.14],
          rotate: movingForward ? [-5, -1, 3] : [5, 1, -3],
        }}
        transition={{ delay: 0.22, duration: 0.66, ease: EASE }}
      />

      <div className="cosmic-depth-field">
        {LENS_PARTICLES.map((particle) => (
          <motion.i
            key={particle.id}
            style={
              {
                "--x": `${particle.x}%`,
                "--y": `${particle.y}%`,
                "--particle-opacity": particle.opacity,
              } as CSSProperties
            }
            initial={{ opacity: 0, scale: particle.depth, x: 0, y: 0 }}
            animate={{
              opacity: [0, particle.opacity, 0],
              scale: [particle.depth, particle.depth * 1.7, particle.depth * 2.2],
              x: [0, lateral * particle.drift, lateral * particle.drift * 2.1],
              y: [0, -particle.drift * 0.34, -particle.drift * 0.72],
            }}
            transition={{ delay: particle.delay, duration: 0.82, ease: EASE }}
          />
        ))}
      </div>

      <motion.div
        className="cosmic-transition-iris"
        initial={{ opacity: 0, scale: 0.36 }}
        animate={{ opacity: [0, 0.64, 0.52, 0], scale: [0.36, 0.98, 1.66, 2.8] }}
        transition={{ delay: 0.08, duration: 1.16, ease: EASE }}
        style={{ "--stage-accent": toStage.accent } as CSSProperties}
      />

      <motion.div
        className="cosmic-arrival-bloom"
        initial={{ opacity: 0, scale: 0.86 }}
        animate={{ opacity: [0, 0, 0.38, 0], scale: [0.86, 1, 1.36, 1.86] }}
        transition={{ delay: 0.66, duration: 0.68, ease: EASE }}
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
      }, reducedMotion ? REDUCED_TRANSITION_MS + 120 : CINEMATIC_TRANSITION_MS + 180);
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

      <div
        className="cosmic-stage"
        style={
          {
            "--stage-accent": stage.accent,
            "--stage-depth-tint": stage.depthTint,
            "--stage-glow-strength": stage.glowIntensity,
          } as CSSProperties
        }
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerDown={startAudio}
        tabIndex={0}
        aria-label="cosmic memory archive"
      >
        <CosmicBackdrop stages={COSMIC_STAGES} activeIndex={page} direction={direction} reducedMotion={reducedMotion} />
        <Globe visible={stage.phaseId === "earth"} reducedMotion={reducedMotion} />
        <div className="cosmic-vignette" aria-hidden />
        <div className="cosmic-grain" aria-hidden />
        <CosmicHud
          stages={COSMIC_STAGES}
          activeIndex={page}
          onSelect={(index) => {
            startAudio();
            goTo(index);
          }}
        />

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
              ready={!cinematicTransition}
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
