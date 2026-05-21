"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent, WheelEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { constellationFinalLine, constellationStars } from "@/data/constellation";
import { doors } from "@/data/doors";
import { getAllMedia, getMediaForFolder } from "@/data/media";
import type { MediaItem } from "@/data/media";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const PAGE_COUNT = 10;

const messageScript = [
  { side: "them", text: "mudra", delay: 700 },
  { side: "them", text: "MUDRA", delay: 1350 },
  { side: "them", text: "i need to tell you something extremely serious", delay: 2200 },
  { side: "me", text: "omg what happened??", delay: 3450 },
  { side: "them", text: 'you already know what it is hehe :"', delay: 4900 },
] as const;

interface WrappedArchiveProps {
  className?: string;
}

function usableMedia(items: MediaItem[]) {
  return items.filter((item) => item.type === "photo" || item.type === "video");
}

function pickMedia(folder: string, count: number, fallbacks: string[] = []) {
  let pool = usableMedia([folder, ...fallbacks].flatMap((name) => getMediaForFolder(name)));
  if (pool.length === 0) pool = usableMedia(getAllMedia());
  if (pool.length === 0) return [];

  return Array.from({ length: count }, (_, index) => pool[index % pool.length]);
}

function MediaAsset({
  media,
  className,
  eager = false,
}: {
  media?: MediaItem | null;
  className?: string;
  eager?: boolean;
}) {
  if (!media) {
    return (
      <div className={`wrapped-media-placeholder ${className ?? ""}`} aria-hidden>
        <span>no media</span>
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <video
        src={media.src}
        className={className}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />
    );
  }

  return <img src={media.src} alt="" className={className} loading={eager ? "eager" : "lazy"} />;
}

function PaperTexture({ wash = true }: { wash?: boolean }) {
  return (
    <>
      {wash && <div className="wrapped-wash" aria-hidden />}
      <div className="wrapped-grain" aria-hidden />
    </>
  );
}

function SwipeHint({ dark = false, delay = 1.2 }: { dark?: boolean; delay?: number }) {
  return (
    <motion.div
      className={`wrapped-hint ${dark ? "wrapped-hint-dark" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.7, ease: EASE }}
    >
      <span>swipe up</span>
      <i aria-hidden />
    </motion.div>
  );
}

function SplitLetters({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((char, index) => (
        <span className="wrapped-char-window" key={`${char}-${index}`}>
          <motion.span
            className="wrapped-char"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.22 + index * 0.082, duration: 0.52, ease: EASE }}
          >
            {char === " " ? "\u00a0" : char}
          </motion.span>
        </span>
      ))}
    </>
  );
}

function WordStack({ words, className = "" }: { words: string[]; className?: string }) {
  return (
    <>
      {words.map((word, index) => (
        <span className="wrapped-word-window" key={word}>
          <motion.span
            className={`wrapped-word ${className}`}
            initial={{ y: 80, scale: 0.88, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ delay: 0.28 + index * 0.18, duration: 0.62, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  );
}

function PinnedFrame({
  media,
  rotation = 0,
  delay = 0,
  aspect = "portrait",
  className = "",
}: {
  media?: MediaItem | null;
  rotation?: number;
  delay?: number;
  aspect?: "portrait" | "square" | "wide";
  className?: string;
}) {
  return (
    <motion.figure
      className={`wrapped-pin ${className}`}
      initial={{ y: 130, rotate: rotation * 0.45, opacity: 0 }}
      animate={{ y: 0, rotate: rotation, opacity: 1 }}
      whileHover={{ y: -2, rotate: rotation * 0.5 }}
      transition={{ delay, duration: 0.68, ease: EASE }}
    >
      <div className="wrapped-pin-dot" aria-hidden />
      <div className="wrapped-tape" aria-hidden />
      <div className={`wrapped-pin-frame wrapped-aspect-${aspect}`}>
        <MediaAsset media={media} className="wrapped-media-fill" />
      </div>
    </motion.figure>
  );
}

function Typewriter({ text, delay = 900 }: { text: string; delay?: number }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    let index = 0;
    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setValue(text.slice(0, index + 1));
        index += 1;
        if (index >= text.length && interval) window.clearInterval(interval);
      }, 55);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      if (interval) window.clearInterval(interval);
    };
  }, [delay, text]);

  return (
    <>
      {value}
      {value.length < text.length && <span className="wrapped-cursor" aria-hidden />}
    </>
  );
}

function ColdOpen() {
  return (
    <div className="wrapped-page-inner wrapped-cold">
      <PaperTexture />
      <h1 className="wrapped-cold-name">
        <SplitLetters text="munna," />
      </h1>
      <motion.p
        className="wrapped-cold-sub"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.92, duration: 0.7, ease: EASE }}
      >
        i&apos;m taking you somewhere.
      </motion.p>
      <SwipeHint delay={1.65} />
    </div>
  );
}

function TextingTrailer() {
  const [messages, setMessages] = useState<Array<(typeof messageScript)[number]>>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    messageScript.forEach((message) => {
      if (message.side === "them") {
        timers.push(window.setTimeout(() => setTyping(true), Math.max(0, message.delay - 500)));
      }
      timers.push(
        window.setTimeout(() => {
          setTyping(false);
          setMessages((current) => [...current, message]);
        }, message.delay)
      );
    });

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <div className="wrapped-page-inner wrapped-imessage-page">
      <PaperTexture wash={false} />
      <div className="wrapped-imessage-header">
        <div className="wrapped-dynamic-island" aria-hidden />
        <p>munna {"\u{1F480}"}</p>
        <span>iMessage (fake)</span>
      </div>

      <div className="wrapped-imessage-chat">
        {messages.map((message, index) => (
          <motion.div
            key={`${message.text}-${index}`}
            className={`wrapped-imessage-row ${message.side}`}
            initial={{ y: 12, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className={`wrapped-bubble ${message.side}`}>
              <p>{message.text}</p>
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
          {typing && (
            <motion.div
              className="wrapped-imessage-row them"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 4, opacity: 0 }}
            >
              <div className="wrapped-typing" aria-label="typing">
                <i />
                <i />
                <i />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <SwipeHint delay={6.1} />
    </div>
  );
}

function MapReveal() {
  return (
    <div className="wrapped-page-inner wrapped-map-page">
      <PaperTexture wash={false} />
      <motion.svg
        className="wrapped-map"
        viewBox="0 0 393 852"
        preserveAspectRatio="xMidYMid slice"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.16, duration: 1.2, ease: EASE }}
        aria-hidden
      >
        <rect width="393" height="852" fill="#f4eedf" />
        <path d="M0 0 C80 60 200 50 393 30 L393 0Z" fill="#bfd2dc" opacity="0.95" />
        <path d="M0 780 C100 740 220 730 393 760 L393 852 L0 852Z" fill="#bfd2dc" opacity="0.95" />
        <g stroke="rgba(31,29,26,.09)" strokeWidth="1">
          <line x1="0" y1="213" x2="393" y2="213" />
          <line x1="0" y1="426" x2="393" y2="426" />
          <line x1="0" y1="639" x2="393" y2="639" />
          <line x1="98" y1="0" x2="98" y2="852" />
          <line x1="196" y1="0" x2="196" y2="852" />
          <line x1="294" y1="0" x2="294" y2="852" />
        </g>
        <g stroke="rgba(31,29,26,.28)" strokeDasharray="10 7" strokeWidth="1.5" fill="none">
          <path d="M30 420 C90 380 150 370 200 390" />
          <path d="M20 540 C90 500 160 495 215 520" />
        </g>
        <motion.path
          d="M140 160 C155 260 168 380 172 500 C176 600 168 680 160 740"
          stroke="#FF6319"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.48, duration: 2.1, ease: EASE }}
        />
        {[160, 300, 440, 570, 700].map((y, index) => (
          <motion.circle
            key={y}
            cx={index === 0 ? 140 : index === 1 ? 158 : index === 2 ? 170 : index === 3 ? 173 : 162}
            cy={y}
            r="5"
            fill="#FF6319"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.75 + index * 0.16, duration: 0.35, ease: EASE }}
          />
        ))}
        <rect x="8" y="8" width="377" height="836" fill="none" stroke="rgba(31,29,26,.14)" strokeWidth="1.5" />
        <text x="22" y="838" fontFamily="JetBrains Mono, monospace" fontSize="8.5" fill="#8a7e72" letterSpacing="1.8">
          weird fishes routing
        </text>
      </motion.svg>

      <div className="wrapped-map-title">
        <WordStack words={["one", "last", "walk."]} />
      </div>
      <SwipeHint delay={1.85} />
    </div>
  );
}

function SpotIntro({
  tag,
  name,
  note,
  light = false,
}: {
  tag: string;
  name: string;
  note: string;
  light?: boolean;
}) {
  return (
    <div className={`wrapped-spot-copy ${light ? "light" : ""}`}>
      <motion.p
        className="wrapped-kicker"
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.18, duration: 0.5, ease: EASE }}
      >
        {tag}
      </motion.p>
      <span className="wrapped-word-window">
        <motion.h2
          initial={{ y: 72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.65, ease: EASE }}
        >
          {name}
        </motion.h2>
      </span>
      <motion.p
        className="wrapped-hand-note"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.56, duration: 0.6, ease: EASE }}
      >
        {note}
      </motion.p>
    </div>
  );
}

function SewellPage({ media }: { media: MediaItem[] }) {
  return (
    <div className="wrapped-page-inner wrapped-scatter-page">
      <PaperTexture />
      <SpotIntro tag="PIN 01 · sewell, nj" name="hidden hills farm" note="the original goat summit." />
      <div className="wrapped-scatter-grid">
        <PinnedFrame media={media[0]} rotation={-2.2} delay={0.64} />
        <PinnedFrame media={media[1]} rotation={1.6} delay={0.76} className="wrapped-lower" />
        <PinnedFrame media={media[2]} rotation={-0.9} delay={0.88} />
        <PinnedFrame media={media[3]} rotation={2} delay={1.0} className="wrapped-lower-sm" />
      </div>
      <SwipeHint delay={1.8} />
    </div>
  );
}

function MidtownPage({ media }: { media?: MediaItem }) {
  return (
    <div className="wrapped-page-inner wrapped-full-photo-page">
      <PaperTexture wash={false} />
      <motion.div
        className="wrapped-fill-photo"
        initial={{ filter: "blur(22px) saturate(0.5)", scale: 1.1 }}
        animate={{ filter: "blur(0px) saturate(1)", scale: 1 }}
        transition={{ duration: 1.3, ease: EASE }}
      >
        <MediaAsset media={media} className="wrapped-media-fill" eager />
      </motion.div>
      <div className="wrapped-photo-scrim" aria-hidden />
      <div className="wrapped-photo-caption">
        <SpotIntro tag="PIN 03 · manhattan" name="midtown" note="civilian behavior was not observed." light />
      </div>
      <SwipeHint dark delay={1.55} />
    </div>
  );
}

function CentralPage({ media }: { media?: MediaItem }) {
  return (
    <div className="wrapped-page-inner wrapped-opposing-page">
      <PaperTexture />
      <div className="wrapped-opposing-copy">
        <motion.p
          className="wrapped-kicker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.5 }}
        >
          PIN 05 · manhattan
        </motion.p>
        <span className="wrapped-word-window">
          <motion.h2
            initial={{ x: 70, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.24, duration: 0.82, ease: EASE }}
          >
            central park
          </motion.h2>
        </span>
      </div>
      <motion.div
        className="wrapped-pan-photo"
        initial={{ x: -70, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.38, duration: 0.9, ease: EASE }}
      >
        <MediaAsset media={media} className="wrapped-pan-media" />
      </motion.div>
      <motion.p
        className="wrapped-opposing-note"
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.7, ease: EASE }}
      >
        run club but make it unserious.
      </motion.p>
      <SwipeHint delay={1.5} />
    </div>
  );
}

function ProspectPage({ media }: { media: MediaItem[] }) {
  return (
    <div className="wrapped-page-inner wrapped-cluster-page">
      <PaperTexture />
      <motion.p className="wrapped-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}>
        PIN 07 · brooklyn
      </motion.p>
      <span className="wrapped-word-window">
        <motion.h2
          initial={{ y: 72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.65, ease: EASE }}
        >
          prospect park
        </motion.h2>
      </span>
      <motion.p className="wrapped-hand-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        peak walk-and-talk infrastructure.
      </motion.p>
      <div className="wrapped-cluster-grid">
        {media.map((item, index) => (
          <motion.div
            className="wrapped-cluster-photo"
            key={`${item.src}-${index}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.58 + index * 0.09, duration: 0.5, ease: EASE }}
          >
            <MediaAsset media={item} className="wrapped-media-fill" />
          </motion.div>
        ))}
      </div>
      <SwipeHint delay={1.8} />
    </div>
  );
}

function HomePage({ media }: { media?: MediaItem }) {
  return (
    <div className="wrapped-page-inner wrapped-develop-page">
      <PaperTexture wash={false} />
      <motion.div
        className="wrapped-fill-photo"
        initial={{ filter: "grayscale(1) brightness(0.78)", scale: 1.04 }}
        animate={{ filter: "grayscale(0) brightness(1) sepia(0.12)", scale: 1 }}
        transition={{ delay: 0.12, duration: 2.1, ease: EASE }}
      >
        <MediaAsset media={media} className="wrapped-media-fill" eager />
      </motion.div>
      <div className="wrapped-photo-scrim" aria-hidden />
      <div className="wrapped-photo-caption">
        <motion.p className="wrapped-kicker light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}>
          PIN 08 · brooklyn 11218
        </motion.p>
        <span className="wrapped-word-window">
          <motion.h2
            initial={{ y: 84, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.58, duration: 0.7, ease: EASE }}
          >
            51 church ave
          </motion.h2>
        </span>
        <p className="wrapped-hand-note light">
          <Typewriter text="church ave forever loading." delay={1080} />
        </p>
      </div>
      <SwipeHint dark delay={2.35} />
    </div>
  );
}

function DoorsPage() {
  const [openDoorId, setOpenDoorId] = useState<string | null>(null);
  const activeDoor = doors.find((door) => door.id === openDoorId) ?? null;

  return (
    <div className="wrapped-page-inner wrapped-doors-page">
      <PaperTexture />
      <div className="wrapped-doors-content">
        <span className="wrapped-word-window">
          <motion.h2
            initial={{ y: 88, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
          >
            open when ___
          </motion.h2>
        </span>
        <motion.p
          className="wrapped-kicker wrapped-doors-sub"
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.42, duration: 0.6, ease: EASE }}
        >
          six emergency protocols. none scientifically validated.
        </motion.p>
        <div className="wrapped-door-list">
          {doors.map((door, index) => (
            <motion.button
              key={door.id}
              type="button"
              className="wrapped-door-row"
              onClick={() => setOpenDoorId(door.id)}
              initial={{ y: 34, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.54 + index * 0.08, duration: 0.5, ease: EASE }}
            >
              <span className="wrapped-door-glyph" aria-hidden>
                {door.glyph}
              </span>
              <span>{door.label}</span>
              <i aria-hidden>→</i>
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        className="wrapped-door-dock"
        initial={{ y: 44, scale: 0.8, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ delay: 1.16, duration: 0.65, ease: EASE }}
      >
        {doors.map((door) => (
          <button key={door.id} type="button" title={door.label} onClick={() => setOpenDoorId(door.id)}>
            {door.glyph}
          </button>
        ))}
      </motion.div>

      <AnimatePresence>
        {activeDoor && (
          <motion.div
            className="wrapped-door-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenDoorId(null)}
          >
            <motion.div
              className="wrapped-door-modal"
              initial={{ y: 18, opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
              onClick={(event) => event.stopPropagation()}
            >
              <p className="wrapped-kicker">{activeDoor.label}</p>
              <h3>{activeDoor.title}</h3>
              <p>{activeDoor.body}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SwipeHint delay={1.8} />
    </div>
  );
}

function ConstellationBox() {
  const [litStars, setLitStars] = useState<string[]>([]);
  const allLit = litStars.length === constellationStars.length;
  const litSet = new Set(litStars);
  const points = constellationStars.map((star) => `${star.x},${star.y}`).join(" ");

  return (
    <motion.div
      className="wrapped-constellation"
      initial={{ y: 22, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <p>constellation protocol</p>
      <div className="wrapped-star-field">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {allLit && (
            <motion.polyline
              points={points}
              fill="none"
              stroke="rgba(200,71,43,.72)"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          )}
        </svg>
        {constellationStars.map((star) => {
          const lit = litSet.has(star.id);
          return (
            <button
              key={star.id}
              type="button"
              className={`wrapped-star ${lit ? "lit" : ""}`}
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              onClick={() => {
                if (!lit) setLitStars((current) => [...current, star.id]);
              }}
              aria-label={star.label}
            >
              <span />
            </button>
          );
        })}
      </div>
      <div className="wrapped-star-lines">
        {litStars.map((id) => {
          const star = constellationStars.find((item) => item.id === id);
          return star ? <p key={id}>· {star.line}</p> : null;
        })}
      </div>
      {allLit && <p className="wrapped-final-line">{constellationFinalLine}</p>}
    </motion.div>
  );
}

function EnvelopePage() {
  const reduceMotion = useReducedMotion();
  const holdTimerRef = useRef<number | null>(null);
  const [holding, setHolding] = useState(false);
  const [opened, setOpened] = useState(false);

  const clearHold = useCallback(() => {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const startHold = useCallback(() => {
    if (opened) return;
    clearHold();
    setHolding(true);
    holdTimerRef.current = window.setTimeout(() => {
      setHolding(false);
      setOpened(true);
    }, 1200);
  }, [clearHold, opened]);

  const endHold = useCallback(() => {
    clearHold();
    setHolding(false);
  }, [clearHold]);

  useEffect(() => clearHold, [clearHold]);

  return (
    <div className="wrapped-page-inner wrapped-envelope-page">
      <PaperTexture />
      <motion.p className="wrapped-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}>
        module 03 · sealed
      </motion.p>
      <motion.p
        className="wrapped-envelope-warning"
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.26, duration: 0.6, ease: EASE }}
      >
        don&apos;t open until june 17. i mean it. munna jhaalim i can see you trying.
      </motion.p>

      <motion.button
        type="button"
        className="wrapped-envelope-button"
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        onPointerCancel={endHold}
        aria-label={opened ? "constellation unlocked" : "tap and hold to crack"}
        animate={
          opened || holding || reduceMotion
            ? {}
            : { rotate: [0, -2.5, 2.5, 0], y: [0, -2, 0] }
        }
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
      >
        <motion.svg
          viewBox="0 0 400 280"
          aria-hidden
          animate={holding && !opened ? { scale: [0.975, 1.012, 0.975] } : { scale: 1 }}
          transition={{ repeat: holding && !opened ? Infinity : 0, duration: 0.12 }}
        >
          <defs>
            <linearGradient id="wrappedEnvPaper" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fdfbf7" />
              <stop offset="100%" stopColor="#f3ebe0" />
            </linearGradient>
          </defs>
          <rect x="40" y="96" width="320" height="160" rx="6" fill="url(#wrappedEnvPaper)" stroke="rgba(31,29,26,.1)" />
          <motion.path
            d="M 40 96 L 200 190 L 360 96"
            fill="rgba(250,249,245,.85)"
            stroke="rgba(31,29,26,.1)"
            animate={{ opacity: opened ? 0.2 : 1 }}
            transition={{ duration: 0.55, ease: EASE }}
          />
          <motion.path
            d="M 40 96 L 200 190 L 360 96 L 40 96 Z"
            fill="rgba(250,249,245,.55)"
            animate={{ opacity: opened ? 0.2 : 1 }}
            transition={{ duration: 0.55, ease: EASE }}
          />
          <motion.g
            style={{ transformOrigin: "200px 175px" }}
            animate={opened ? { rotate: -18, x: -10, opacity: 0.75 } : { rotate: 0, x: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <circle cx="200" cy="175" r="26" fill="#c8472b" opacity=".92" />
            <circle cx="200" cy="175" r="26" fill="none" stroke="rgba(0,0,0,.12)" />
            <text x="200" y="182" textAnchor="middle" fill="#fdf6f0" fontFamily="JetBrains Mono, monospace" fontSize="13" letterSpacing=".08em">
              M
            </text>
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: opened ? 1 : 0 }}>
            <line x1="200" y1="175" x2="170" y2="200" stroke="rgba(255,255,255,.55)" strokeWidth="2" strokeLinecap="round" />
            <line x1="200" y1="175" x2="230" y2="200" stroke="rgba(255,255,255,.55)" strokeWidth="2" strokeLinecap="round" />
          </motion.g>
        </motion.svg>
      </motion.button>

      <p className="wrapped-envelope-state">{opened ? "constellation unlocked" : holding ? "hold..." : "tap and hold to crack"}</p>
      <AnimatePresence>{opened && <ConstellationBox />}</AnimatePresence>
    </div>
  );
}

const pageVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "100%" : "-100%",
    opacity: 1,
  }),
  center: {
    y: "0%",
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction > 0 ? "-105%" : "105%",
    opacity: 0.58,
  }),
};

export function WrappedArchive({ className = "" }: WrappedArchiveProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const touchStartY = useRef(0);
  const busyRef = useRef(false);
  const releaseTimerRef = useRef<number | null>(null);
  const flashTimerRef = useRef<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [flash, setFlash] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  const media = useMemo(
    () => {
      const midtown = pickMedia("midtown", 4, ["home"]);
      return {
        sewell: pickMedia("sewell-farm", 4, ["home", "midtown"]),
        midtown: midtown[2] ?? midtown[0],
        central: pickMedia("central-park", 1, ["midtown", "brooklyn"])[0],
        prospect: pickMedia("brooklyn", 6, ["home", "cute photos of her"]),
        home: pickMedia("home", 1, ["brooklyn"])[0],
      };
    },
    []
  );

  const startAudio = useCallback(() => {
    if (audioStarted) return;
    setAudioStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.82;
      audioRef.current.play().catch(() => {});
    }
  }, [audioStarted]);

  const pulseFlash = useCallback(() => {
    setFlash(true);
    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => setFlash(false), 180);
  }, []);

  const goTo = useCallback(
    (nextPage: number) => {
      if (busyRef.current || nextPage < 0 || nextPage >= PAGE_COUNT || nextPage === currentPage) return;
      startAudio();
      setDirection(nextPage > currentPage ? 1 : -1);
      busyRef.current = true;
      if ([1, 4, 7].includes(nextPage)) pulseFlash();
      setCurrentPage(nextPage);

      if (releaseTimerRef.current) window.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = window.setTimeout(() => {
        busyRef.current = false;
      }, 780);
    },
    [currentPage, pulseFlash, startAudio]
  );

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "PageDown") goTo(currentPage + 1);
      if (event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "PageUp") goTo(currentPage - 1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentPage, goTo]);

  useEffect(() => {
    return () => {
      if (releaseTimerRef.current) window.clearTimeout(releaseTimerRef.current);
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    };
  }, []);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (Math.abs(event.deltaY) < 24) return;
    goTo(currentPage + (event.deltaY > 0 ? 1 : -1));
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = event.touches[0]?.clientY ?? 0;
    startAudio();
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const endY = event.changedTouches[0]?.clientY ?? touchStartY.current;
    const deltaY = touchStartY.current - endY;
    if (Math.abs(deltaY) > 45) goTo(currentPage + (deltaY > 0 ? 1 : -1));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return <ColdOpen />;
      case 1:
        return <TextingTrailer />;
      case 2:
        return <MapReveal />;
      case 3:
        return <SewellPage media={media.sewell} />;
      case 4:
        return <MidtownPage media={media.midtown} />;
      case 5:
        return <CentralPage media={media.central} />;
      case 6:
        return <ProspectPage media={media.prospect} />;
      case 7:
        return <HomePage media={media.home} />;
      case 8:
        return <DoorsPage />;
      default:
        return <EnvelopePage />;
    }
  };

  return (
    <main className={`wrapped-shell ${className}`}>
      <audio ref={audioRef} src="/media/Radiohead - Weird Fishes _ Arpeggi.mp3" loop preload="auto" />
      <div
        className="wrapped-stage"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerDown={startAudio}
        tabIndex={0}
        aria-label="memory archive wrapped"
      >
        <motion.div className="wrapped-flash" animate={{ opacity: flash ? 0.45 : 0 }} transition={{ duration: 0.15 }} />

        <AnimatePresence initial={false} custom={direction}>
          <motion.section
            key={currentPage}
            className="wrapped-page"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.72, ease: EASE }}
          >
            {renderPage()}
          </motion.section>
        </AnimatePresence>

        <nav className="wrapped-nav" aria-label="chapters">
          {Array.from({ length: PAGE_COUNT }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`go to chapter ${index + 1}`}
              className={index === currentPage ? "active" : ""}
              onClick={() => goTo(index)}
            />
          ))}
        </nav>
      </div>
    </main>
  );
}
