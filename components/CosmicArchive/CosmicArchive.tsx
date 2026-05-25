"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { TouchEvent, WheelEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getAllMedia, getMediaForFolder } from "@/data/media";
import type { MediaItem } from "@/data/media";

const PAGE_COUNT = 6;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface CosmicArchiveProps {
  className?: string;
}

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
  d: number;
  spin: number;
  tw: number;
}

interface Dust {
  arm: number;
  radius: number;
  jitter: number;
  size: number;
  alpha: number;
  tint: number;
}

interface Burst {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  r: number;
  color: string;
}

interface TransitionShard {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  rotate: number;
  delay: number;
  color: string;
}

interface TransitionBurstState {
  id: number;
  direction: number;
  shards: TransitionShard[];
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function rangeAlpha(t: number, fadeIn: number, solidIn: number, solidOut: number, fadeOut: number) {
  if (t <= fadeIn || t >= fadeOut) return 0;
  if (t < solidIn) return smoothstep(fadeIn, solidIn, t);
  if (t <= solidOut) return 1;
  return 1 - smoothstep(solidOut, fadeOut, t);
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

function usableMedia(items: MediaItem[]) {
  return items.filter((item) => item.type === "photo" || item.type === "video");
}

function pickMedia(folder: string, count: number, fallbacks: string[] = []) {
  let pool = usableMedia([folder, ...fallbacks].flatMap((name) => getMediaForFolder(name)));
  if (pool.length === 0) pool = usableMedia(getAllMedia());
  if (pool.length === 0) return [];

  return Array.from({ length: count }, (_, index) => pool[index % pool.length]);
}

function uniqueMedia(items: MediaItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.src)) return false;
    seen.add(item.src);
    return true;
  });
}

function realPhotoPool() {
  return uniqueMedia(
    usableMedia(getAllMedia()).filter(
      (item) => item.type === "photo" && !item.id.startsWith("animation template images-")
    )
  );
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
  if (!media) return <div className={`cosmic-photo-empty ${className ?? ""}`} aria-hidden />;

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

function createTransitionBurst(direction: number): TransitionBurstState {
  const shards = Array.from({ length: 42 }, (_, index) => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.65 + (direction < 0 ? Math.PI : 0);
    const distance = 160 + Math.random() * 360;
    return {
      id: index,
      x: 46 + Math.random() * 8,
      y: direction > 0 ? 76 + Math.random() * 8 : 18 + Math.random() * 8,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      size: 2 + Math.random() * 8,
      rotate: (Math.random() - 0.5) * 220,
      delay: Math.random() * 0.11,
      color: Math.random() > 0.74 ? "#FF6319" : Math.random() > 0.5 ? "#ffffff" : "#bfd2ff",
    };
  });

  return { id: Date.now(), direction, shards };
}

function TransitionBurst({ burst }: { burst: TransitionBurstState }) {
  return (
    <motion.div
      key={burst.id}
      className="cosmic-transition-burst"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      aria-hidden
    >
      <motion.div
        className="cosmic-transition-flash"
        initial={{ opacity: 0, scale: 0.25 }}
        animate={{ opacity: [0, 0.95, 0], scale: [0.25, 1.8, 2.7] }}
        transition={{ duration: 0.82, ease: EASE }}
      />
      {burst.shards.map((shard) => (
        <motion.i
          key={shard.id}
          className="cosmic-transition-shard"
          style={{
            left: `${shard.x}%`,
            top: `${shard.y}%`,
            width: shard.size,
            height: shard.size,
            background: shard.color,
            boxShadow: `0 0 ${10 + shard.size * 2}px ${shard.color}`,
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.2, rotate: 0, filter: "blur(0px)" }}
          animate={{
            x: shard.dx,
            y: shard.dy,
            opacity: [0, 1, 0],
            scale: [0.2, 1.25, 0.45],
            rotate: shard.rotate,
            filter: ["blur(0px)", "blur(0px)", "blur(4px)"],
          }}
          transition={{ delay: shard.delay, duration: 0.92, ease: EASE }}
        />
      ))}
    </motion.div>
  );
}

function MayFigure({ className = "" }: { className?: string }) {
  return (
    <svg className={`cosmic-figure cosmic-may ${className}`} viewBox="0 0 62 142" aria-hidden>
      <ellipse cx="31" cy="12" rx="22" ry="19" fill="#5A4DC8" />
      <circle cx="13" cy="15" r="8" fill="#6B5CE7" />
      <circle cx="31" cy="5" r="10" fill="#7B6CF7" />
      <circle cx="49" cy="15" r="8" fill="#6B5CE7" />
      <circle cx="20" cy="3" r="6" fill="#8B7CF8" />
      <circle cx="42" cy="3" r="6" fill="#8B7CF8" />
      <circle cx="31" cy="26" r="6" fill="#4A3DB0" />
      <path d="M11 20 C4 12 6 0 14 4" fill="#6B5CE7" />
      <path d="M51 20 C58 12 56 0 48 4" fill="#6B5CE7" />
      <ellipse cx="31" cy="48" rx="18" ry="20" fill="#D49A6E" />
      <circle cx="22" cy="46" r="6.5" fill="rgba(140,200,255,.08)" stroke="#aaa" strokeWidth="1.4" />
      <circle cx="40" cy="46" r="6.5" fill="rgba(140,200,255,.08)" stroke="#aaa" strokeWidth="1.4" />
      <line x1="28.5" y1="46" x2="33.5" y2="46" stroke="#aaa" strokeWidth="1.2" />
      <line x1="15.5" y1="44" x2="10" y2="42" stroke="#aaa" strokeWidth="1.2" />
      <line x1="46.5" y1="44" x2="52" y2="42" stroke="#aaa" strokeWidth="1.2" />
      <circle cx="22" cy="46" r="2.5" fill="#2A1A40" opacity=".85" />
      <circle cx="40" cy="46" r="2.5" fill="#2A1A40" opacity=".85" />
      <circle cx="23" cy="45" r=".9" fill="#fff" opacity=".6" />
      <circle cx="41" cy="45" r=".9" fill="#fff" opacity=".6" />
      <path d="M25 56 Q31 61 37 56" fill="none" stroke="#B07050" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="25" y="66" width="12" height="8" rx="5" fill="#D49A6E" />
      <path d="M8 74 C6 90 8 108 10 120 L52 120 C54 108 56 90 54 74 C47 69 15 69 8 74Z" fill="#F0A830" />
      <path d="M16 84 Q22 88 28 84 Q34 88 40 84 Q46 88 50 84" fill="none" stroke="#D4920A" strokeWidth=".9" opacity=".45" />
      <path d="M16 94 Q22 98 28 94 Q34 98 40 94 Q46 98 50 94" fill="none" stroke="#D4920A" strokeWidth=".9" opacity=".45" />
      <path d="M16 104 Q22 108 28 104 Q34 108 40 104 Q46 108 50 104" fill="none" stroke="#D4920A" strokeWidth=".9" opacity=".45" />
      <circle cx="31" cy="90" r="6.5" fill="#4F7CE8" />
      <circle cx="31" cy="90" r="5.8" fill="none" stroke="#3560C8" strokeWidth=".6" />
      <circle cx="29.5" cy="88.5" r=".9" fill="#3560C8" />
      <circle cx="32.5" cy="88.5" r=".9" fill="#3560C8" />
      <circle cx="29.5" cy="91.5" r=".9" fill="#3560C8" />
      <circle cx="32.5" cy="91.5" r=".9" fill="#3560C8" />
      <path d="M8 74 C4 84 4 104 7 114" stroke="#F0A830" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M54 74 C58 84 58 104 55 114" stroke="#F0A830" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M10 120 L8 138 L25 138 L31 122 L37 138 L54 138 L52 120Z" fill="#7A8FB0" />
      <ellipse cx="16" cy="139" rx="10" ry="5" fill="#3A2818" />
      <ellipse cx="46" cy="139" rx="10" ry="5" fill="#3A2818" />
    </svg>
  );
}

function CodyFigure({ className = "" }: { className?: string }) {
  return (
    <svg className={`cosmic-figure cosmic-cody ${className}`} viewBox="0 0 68 156" aria-hidden>
      <path d="M22 28 C10 10 18 -6 30 8" fill="#4A7A26" stroke="#3A6018" strokeWidth=".5" />
      <path d="M30 24 C18 4 36 -10 40 6" fill="#5A9030" stroke="#4A7A20" strokeWidth=".5" />
      <path d="M40 26 C44 6 58 -2 56 16" fill="#3D6820" stroke="#2D5010" strokeWidth=".5" />
      <path d="M46 30 C58 14 68 22 62 34" fill="#4A8028" />
      <path d="M24 26 C16 12 22 2 28 12" fill="#6AAA38" opacity=".55" />
      <path d="M32 22 C26 8 40 -4 42 10" fill="#6AAA38" opacity=".55" />
      <path d="M42 24 C48 8 60 8 58 22" fill="#6AAA38" opacity=".55" />
      <ellipse cx="34" cy="50" rx="21" ry="22" fill="#C99568" />
      <path d="M24 40 Q28 37 32 40" fill="none" stroke="#8A5830" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M36 40 Q40 37 44 40" fill="none" stroke="#8A5830" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="28" cy="46" r="3.5" fill="#2A1808" />
      <circle cx="44" cy="46" r="3.5" fill="#2A1808" />
      <circle cx="29" cy="45" r="1.1" fill="#fff" opacity=".5" />
      <circle cx="45" cy="45" r="1.1" fill="#fff" opacity=".5" />
      <path d="M30 52 C27 56 28 63 34 62 C40 63 41 56 38 52" fill="#B07848" opacity=".7" />
      <circle cx="31" cy="61" r="1.5" fill="#9A6438" opacity=".5" />
      <circle cx="37" cy="61" r="1.5" fill="#9A6438" opacity=".5" />
      <path d="M28 66 Q34 72 40 66" fill="none" stroke="#9A6040" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="28" y="70" width="12" height="9" rx="5" fill="#C99568" />
      <path d="M8 79 C5 96 7 116 9 130 L59 130 C61 116 63 96 60 79 C52 73 16 73 8 79Z" fill="#C0392B" />
      <path d="M16 90 Q23 94 30 90 Q37 94 44 90 Q51 94 56 90" fill="none" stroke="#9C2E22" strokeWidth="1" opacity=".45" />
      <path d="M16 102 Q23 106 30 102 Q37 106 44 102 Q51 106 56 102" fill="none" stroke="#9C2E22" strokeWidth="1" opacity=".45" />
      <path d="M16 114 Q23 118 30 114 Q37 118 44 114 Q51 118 56 114" fill="none" stroke="#9C2E22" strokeWidth="1" opacity=".45" />
      <path d="M8 79 C2 90 2 114 6 126" stroke="#C0392B" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M60 79 C66 90 66 114 62 126" stroke="#C0392B" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M9 130 L6 150 L26 150 L34 132 L42 150 L62 150 L59 130Z" fill="#3D5A2A" />
      <ellipse cx="16" cy="152" rx="12" ry="5.5" fill="#2A1808" />
      <ellipse cx="52" cy="152" rx="12" ry="5.5" fill="#2A1808" />
    </svg>
  );
}

function FigurePair({ className = "" }: { className?: string }) {
  return (
    <div className={`cosmic-figure-pair ${className}`} aria-hidden>
      <MayFigure />
      <CodyFigure />
    </div>
  );
}

function CosmicCanvas({
  page,
  direction,
  reducedMotion,
}: {
  page: number;
  direction: number;
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const dustRef = useRef<Dust[]>([]);
  const burstsRef = useRef<Burst[]>([]);
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const lastProgressRef = useRef(0);
  const directionRef = useRef(direction);

  useEffect(() => {
    targetRef.current = page / (PAGE_COUNT - 1);
    directionRef.current = direction;
    const burstCount = reducedMotion ? 0 : 52;
    for (let i = 0; i < burstCount; i += 1) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2 + (direction < 0 ? Math.PI : 0);
      const speed = 2 + Math.random() * 5;
      burstsRef.current.push({
        x: 196 + (Math.random() - 0.5) * 160,
        y: direction > 0 ? 720 + Math.random() * 80 : 130 - Math.random() * 80,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 38 + Math.random() * 24,
        r: 0.8 + Math.random() * 2.2,
        color: Math.random() > 0.7 ? "255,99,25" : "255,255,255",
      });
    }
  }, [direction, page, reducedMotion]);

  useEffect(() => {
    starsRef.current = Array.from({ length: reducedMotion ? 120 : 300 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.35 + Math.random() * 1.55,
      a: 0.25 + Math.random() * 0.75,
      d: 0.35 + Math.random() * 1.8,
      spin: Math.random() * Math.PI * 2,
      tw: 0.4 + Math.random() * 1.4,
    }));

    dustRef.current = Array.from({ length: reducedMotion ? 80 : 260 }, (_, index) => ({
      arm: index % 4,
      radius: 0.04 + Math.random() * 0.48,
      jitter: (Math.random() - 0.5) * 0.14,
      size: 0.55 + Math.random() * 1.8,
      alpha: 0.18 + Math.random() * 0.62,
      tint: Math.random(),
    }));
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let width = 393;
    let height = 852;
    let raf = 0;
    let previous = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width || 393);
      height = Math.max(1, rect.height || 852);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const drawBackground = (t: number, time: number) => {
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#02030a");
      bg.addColorStop(0.45, t < 0.22 ? "#070913" : "#03040b");
      bg.addColorStop(1, "#000106");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const glowX = width * (0.18 + 0.62 * smoothstep(0.05, 0.85, t));
      const glowY = height * (0.2 + 0.28 * Math.sin(t * Math.PI * 2));
      const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, width * 0.9);
      glow.addColorStop(0, `rgba(255,99,25,${0.08 + 0.08 * Math.sin(time * 0.0004)})`);
      glow.addColorStop(0.35, "rgba(91,56,180,.06)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const cold = ctx.createRadialGradient(width * 0.55, height * 0.42, 0, width * 0.55, height * 0.42, width * 0.8);
      cold.addColorStop(0, `rgba(76,115,255,${0.03 + 0.05 * rangeAlpha(t, 0.45, 0.58, 0.95, 1)})`);
      cold.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = cold;
      ctx.fillRect(0, 0, width, height);
    };

    const drawFThread = (t: number, time: number) => {
      const alpha = 0.15 + 0.65 * smoothstep(0.08, 0.34, t);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.lineCap = "round";
      ctx.lineWidth = 2.2 + 1.1 * Math.sin(time * 0.001 + t * 2);
      ctx.strokeStyle = "rgba(255,99,25,.78)";
      ctx.shadowBlur = 22;
      ctx.shadowColor = "rgba(255,99,25,.7)";
      ctx.beginPath();
      ctx.moveTo(width * 0.22, height * 0.88);
      ctx.bezierCurveTo(width * 0.34, height * 0.64, width * 0.54, height * 0.56, width * 0.58, height * 0.34);
      ctx.bezierCurveTo(width * 0.62, height * 0.18, width * 0.75, height * 0.15, width * 0.68, height * 0.06);
      ctx.stroke();
      ctx.restore();
    };

    const drawGalaxy = (t: number, time: number) => {
      const alpha = rangeAlpha(t, 0.34, 0.48, 0.98, 1);
      if (alpha <= 0.01) return;

      ctx.save();
      ctx.translate(width * 0.5, height * (0.46 + 0.08 * Math.sin(t * Math.PI)));
      ctx.rotate(-0.28 + t * 0.38 + time * 0.000035);
      ctx.globalAlpha = alpha;

      const disc = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.46);
      disc.addColorStop(0, "rgba(255,235,190,.22)");
      disc.addColorStop(0.24, "rgba(255,99,25,.09)");
      disc.addColorStop(0.56, "rgba(116,91,255,.06)");
      disc.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = disc;
      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.47, height * 0.11, 0, 0, Math.PI * 2);
      ctx.fill();

      for (const dust of dustRef.current) {
        const angle = dust.arm * (Math.PI / 2) + dust.radius * 8.7 + time * 0.00008;
        const radius = dust.radius * width * (0.9 + 0.32 * Math.sin(t * Math.PI));
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.21 + dust.jitter * height;
        const warm = dust.tint > 0.68;
        ctx.fillStyle = warm
          ? `rgba(255,185,105,${dust.alpha})`
          : `rgba(198,210,255,${dust.alpha})`;
        ctx.fillRect(x, y, dust.size, dust.size);
      }

      ctx.restore();
    };

    const drawStars = (t: number, time: number, delta: number) => {
      const speed = clamp(Math.abs(progressRef.current - lastProgressRef.current) * 80 + Math.abs(targetRef.current - progressRef.current) * 16, 0, 1);
      const centerX = width * 0.5;
      const centerY = height * 0.48;

      for (const star of starsRef.current) {
        const baseX = star.x * width;
        const baseY = star.y * height;
        const dx = baseX - centerX;
        const dy = baseY - centerY;
        const radius = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) + star.spin * 0.018 + t * (0.6 + star.d * 0.35) + time * 0.000025 * star.d;
        const drift = Math.sin(time * 0.00035 * star.tw + star.spin) * 9 * star.d;
        const x = centerX + Math.cos(angle) * (radius + drift);
        const y = centerY + Math.sin(angle) * (radius + drift * 0.7);
        const alpha = star.a * (0.62 + 0.38 * Math.sin(time * 0.002 * star.tw + star.spin));

        if (speed > 0.06 && !reducedMotion) {
          ctx.strokeStyle = `rgba(255,255,255,${alpha * speed * 0.34})`;
          ctx.lineWidth = star.r;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - Math.cos(angle) * speed * 34 * directionRef.current, y - Math.sin(angle) * speed * 34 * directionRef.current);
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reducedMotion) {
        for (let i = burstsRef.current.length - 1; i >= 0; i -= 1) {
          const burst = burstsRef.current[i];
          burst.life += delta / 16.6;
          burst.x += burst.vx;
          burst.y += burst.vy;
          burst.vx *= 0.982;
          burst.vy *= 0.982;
          const alpha = 1 - burst.life / burst.maxLife;
          ctx.fillStyle = `rgba(${burst.color},${Math.max(0, alpha)})`;
          ctx.beginPath();
          ctx.arc(burst.x, burst.y, burst.r * Math.max(0.2, alpha), 0, Math.PI * 2);
          ctx.fill();
          if (burst.life >= burst.maxLife) burstsRef.current.splice(i, 1);
        }
      }
    };

    const draw = (now: number) => {
      const delta = Math.min(40, now - previous);
      previous = now;

      lastProgressRef.current = progressRef.current;
      const easing = reducedMotion ? 1 : 0.075;
      progressRef.current += (targetRef.current - progressRef.current) * easing;
      const t = progressRef.current;

      ctx.clearRect(0, 0, width, height);
      drawBackground(t, now);
      drawGalaxy(t, now);
      drawFThread(t, now);
      drawStars(t, now, delta);

      raf = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="cosmic-canvas" aria-hidden />;
}

function HeroScene() {
  return (
    <div className="cosmic-hero">
      <motion.div
        className="cosmic-hero-copy"
        initial={{ y: 28, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <p className="cosmic-kicker">cody + may</p>
        <h1>Thanks for ruining the surprise :(</h1>
        <p className="cosmic-subtitle">
          So i re-did the website
          <span>right now you&apos;re making buldak and we&apos;re leaving church ave in 2 hours</span>
        </p>
      </motion.div>
      <motion.div
        initial={{ y: 45, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.85, ease: EASE }}
      >
        <FigurePair className="cosmic-hero-figures" />
      </motion.div>
      <motion.div
        className="cosmic-swipe-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.7, ease: EASE }}
        aria-hidden
      >
        <span>swipe up</span>
        <i />
      </motion.div>
    </div>
  );
}

function FTrainScene({ media }: { media: MediaItem[] }) {
  return (
    <div className="cosmic-visual-scene cosmic-ftrain-scene" aria-label="brooklyn f train constellation">
      {media.slice(0, 3).map((item, index) => (
        <motion.div
          key={`${item.src}-${index}`}
          className={`cosmic-route-photo cosmic-route-photo-${index}`}
          initial={{ opacity: 0, scale: 0.72, y: 22, rotate: index % 2 ? 8 : -8 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: index % 2 ? 3 : -3 }}
          transition={{ delay: 0.2 + index * 0.15, duration: 0.76, ease: EASE }}
        >
          <MediaAsset media={item} className="cosmic-photo-fill" />
        </motion.div>
      ))}
      <motion.svg
        viewBox="0 0 393 852"
        preserveAspectRatio="xMidYMid slice"
        className="cosmic-ftrain-map"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        aria-hidden
      >
        <defs>
          <filter id="cosmic-orange-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g stroke="rgba(255,255,255,.055)" strokeWidth="1">
          <line x1="44" y1="0" x2="172" y2="852" />
          <line x1="182" y1="0" x2="318" y2="852" />
          <line x1="0" y1="170" x2="393" y2="128" />
          <line x1="0" y1="386" x2="393" y2="340" />
          <line x1="0" y1="610" x2="393" y2="575" />
        </g>
        <motion.path
          d="M 78 760 C 105 682 126 610 158 522 C 188 438 210 380 230 303 C 247 236 254 168 260 92"
          fill="none"
          stroke="rgba(255,99,25,.24)"
          strokeWidth="18"
          strokeLinecap="round"
          filter="url(#cosmic-orange-glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.7, ease: EASE }}
        />
        <motion.g
          className="cosmic-ftrain-constellation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.9, ease: EASE }}
        >
          <path d="M 55 180 L 114 272 L 204 248 L 278 354 L 325 506 L 224 632 L 110 718" fill="none" stroke="rgba(255,255,255,.48)" strokeWidth="1.2" />
          {[
            { x: 55, y: 180, r: 3.2 },
            { x: 114, y: 272, r: 2.4 },
            { x: 204, y: 248, r: 3.8 },
            { x: 278, y: 354, r: 2.8 },
            { x: 325, y: 506, r: 4.4 },
            { x: 224, y: 632, r: 2.6 },
            { x: 110, y: 718, r: 3.4 },
          ].map((star) => (
            <circle key={`${star.x}-${star.y}`} cx={star.x} cy={star.y} r={star.r} fill="rgba(255,255,255,.94)" />
          ))}
        </motion.g>
        <motion.path
          d="M 78 760 C 105 682 126 610 158 522 C 188 438 210 380 230 303 C 247 236 254 168 260 92"
          fill="none"
          stroke="#FF6319"
          strokeWidth="4.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.75, ease: EASE, delay: 0.08 }}
        />
        {[{ x: 78, y: 760 }, { x: 150, y: 548 }, { x: 198, y: 425 }, { x: 238, y: 286 }, { x: 260, y: 92 }].map((stop, index) => (
          <motion.circle
            key={`${stop.x}-${stop.y}`}
            cx={stop.x}
            cy={stop.y}
            r="6"
            fill="#FF6319"
            stroke="rgba(255,255,255,.9)"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35 + index * 0.16, duration: 0.42, ease: EASE }}
          />
        ))}
        <motion.g
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.05, duration: 0.5, ease: EASE }}
        >
          <rect x="28" y="782" width="34" height="34" rx="7" fill="#FF6319" />
          <text x="45" y="804" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="17" fontWeight="700" fill="#fff">
            F
          </text>
        </motion.g>
      </motion.svg>
      <motion.div
        className="cosmic-route-figures"
        initial={{ opacity: 0, y: 24, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1, duration: 0.75, ease: EASE }}
      >
        <FigurePair />
      </motion.div>
    </div>
  );
}

function MemoryScene({ media }: { media: MediaItem[] }) {
  const orbiting = media.slice(1);

  return (
    <div className="cosmic-visual-scene cosmic-memory-scene" aria-label="photo orbit">
      <motion.div
        className="cosmic-photo-orbit"
        initial={{ opacity: 0, scale: 0.78, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <MediaAsset media={media[0]} className="cosmic-photo-fill" eager />
      </motion.div>
      <div className="cosmic-all-photo-constellation" aria-label="all photo constellation">
        {orbiting.map((item, index) => {
          const angle = index * 137.508;
          const ring = index % 4;
          const radiusX = 23 + ring * 7 + (index % 3) * 2.5;
          const radiusY = 19 + ring * 8 + (index % 5) * 1.7;
          const left = 50 + Math.cos((angle * Math.PI) / 180) * radiusX;
          const top = 50 + Math.sin((angle * Math.PI) / 180) * radiusY;
          return (
            <motion.div
              key={`${item.src}-${index}`}
              className="cosmic-all-photo"
              style={
                {
                  left: `${clamp(left, 4, 88)}%`,
                  top: `${clamp(top, 7, 87)}%`,
                  "--photo-size": `${42 + (index % 5) * 7}px`,
                } as CSSProperties
              }
              initial={{ opacity: 0, scale: 0.3, rotate: index % 2 ? 12 : -12 }}
              animate={{ opacity: 1, scale: 1, rotate: (index % 7) - 3 }}
              transition={{ delay: 0.12 + index * 0.018, duration: 0.54, ease: EASE }}
            >
              <MediaAsset media={item} className="cosmic-photo-fill" />
            </motion.div>
          );
        })}
      </div>
      {media.slice(1, 4).map((item, index) => (
        <motion.div
          key={`${item.src}-${index}`}
          className={`cosmic-mini-photo cosmic-mini-photo-${index}`}
          initial={{ opacity: 0, y: 50, rotate: index % 2 ? 9 : -9, scale: 0.82 }}
          animate={{ opacity: 1, y: 0, rotate: index % 2 ? 4 : -4, scale: 1 }}
          transition={{ delay: 0.2 + index * 0.12, duration: 0.74, ease: EASE }}
        >
          <MediaAsset media={item} className="cosmic-photo-fill" />
        </motion.div>
      ))}
    </div>
  );
}

function SnowScene() {
  return (
    <div className="cosmic-visual-scene cosmic-snow-scene" aria-label="snowfight scene">
      <div className="cosmic-snow-field" aria-hidden>
        {Array.from({ length: 42 }, (_, index) => (
          <i
            key={index}
            style={
              {
                left: `${(index * 23) % 100}%`,
                "--fall-delay": `${-((index * 0.37) % 7).toFixed(2)}s`,
                "--fall-duration": `${5.8 + (index % 7) * 0.42}s`,
                "--fall-drift": `${(index % 2 ? 1 : -1) * (12 + (index % 5) * 6)}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <motion.div
        className="cosmic-snow-figures"
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: EASE }}
      >
        <MayFigure className="cosmic-facing-left" />
        <motion.div
          className="cosmic-snowball"
          initial={{ scale: 0, y: 24 }}
          animate={{ scale: [0, 1.15, 1], y: [24, -10, 0] }}
          transition={{ delay: 0.36, duration: 0.72, ease: EASE }}
        />
        <CodyFigure className="cosmic-facing-right" />
      </motion.div>
      <motion.div
        className="cosmic-snow-arc"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.42, duration: 0.8, ease: EASE }}
        aria-hidden
      />
    </div>
  );
}

function WordleScene() {
  const cells = [
    "correct", "correct", "correct", "correct", "correct",
    "present", "empty", "absent", "present", "empty",
    "empty", "present", "empty", "absent", "present",
    "empty", "empty", "present", "empty", "absent",
    "absent", "empty", "empty", "present", "empty",
    "empty", "absent", "empty", "empty", "present",
  ];

  return (
    <div className="cosmic-visual-scene cosmic-wordle-scene" aria-label="wordle constellation">
      <motion.div
        className="cosmic-wordle-board"
        initial={{ opacity: 0, scale: 0.78, rotateX: 18 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.78, ease: EASE }}
      >
        {cells.map((kind, index) => (
          <motion.span
            key={`${kind}-${index}`}
            className={`cosmic-wordle-cell ${kind}`}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ delay: index * 0.026, duration: 0.32, ease: EASE }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function FinalScene() {
  return (
    <div className="cosmic-visual-scene cosmic-final-scene" aria-label="final orbit">
      <motion.div
        className="cosmic-final-orbit"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <span />
        <span />
        <span />
      </motion.div>
      <motion.div
        className="cosmic-final-figures"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.8, ease: EASE }}
      >
        <FigurePair />
      </motion.div>
    </div>
  );
}

export function CosmicArchive({ className = "" }: CosmicArchiveProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const chimeRef = useRef<AudioContext | null>(null);
  const touchStartY = useRef(0);
  const busyRef = useRef(false);
  const releaseTimerRef = useRef<number | null>(null);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [audioStarted, setAudioStarted] = useState(false);
  const [transitionBurst, setTransitionBurst] = useState<TransitionBurstState | null>(null);
  const reducedMotion = useReducedMotionPreference();

  const media = useMemo(
    () => ({
      route: pickMedia("brooklyn", 3, ["home", "midtown", "cute photos of her"]),
      orbit: realPhotoPool(),
    }),
    []
  );

  const playTransitionChime = useCallback((nextDirection: number) => {
    if (reducedMotion || typeof window === "undefined") return;
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;

    const ctx = chimeRef.current ?? new AudioCtor();
    chimeRef.current = ctx;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.055, now + 0.028);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
    master.connect(ctx.destination);

    const notes = nextDirection > 0 ? [523.25, 659.25, 987.77] : [987.77, 659.25, 523.25];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + index * 0.055);
      gain.gain.setValueAtTime(0.0001, now + index * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.42, now + index * 0.055 + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.86 + index * 0.04);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now + index * 0.055);
      osc.stop(now + 1.05 + index * 0.04);
    });
  }, [reducedMotion]);

  const startAudio = useCallback(() => {
    if (audioStarted) return;
    setAudioStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.72;
      audioRef.current.play().catch(() => {});
    }
  }, [audioStarted]);

  const goTo = useCallback(
    (nextPage: number) => {
      if (busyRef.current || nextPage < 0 || nextPage >= PAGE_COUNT || nextPage === page) return;
      startAudio();
      const nextDirection = nextPage > page ? 1 : -1;
      setDirection(nextDirection);
      setTransitionBurst(createTransitionBurst(nextDirection));
      playTransitionChime(nextDirection);
      setPage(nextPage);
      busyRef.current = true;
      if (releaseTimerRef.current) window.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = window.setTimeout(() => {
        busyRef.current = false;
      }, reducedMotion ? 160 : 820);
    },
    [page, playTransitionChime, reducedMotion, startAudio]
  );

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
      if (releaseTimerRef.current) window.clearTimeout(releaseTimerRef.current);
    };
  }, []);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (Math.abs(event.deltaY) < 28) return;
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

  const renderScene = () => {
    switch (page) {
      case 0:
        return <HeroScene />;
      case 1:
        return <FTrainScene media={media.route} />;
      case 2:
        return <MemoryScene media={media.orbit} />;
      case 3:
        return <SnowScene />;
      case 4:
        return <WordleScene />;
      default:
        return <FinalScene />;
    }
  };

  return (
    <main className={`cosmic-shell ${className}`}>
      <audio ref={audioRef} src="/media/Radiohead - Weird Fishes _ Arpeggi.mp3" loop preload="auto" />
      <Link href="/imessage" className="cosmic-chat-link" aria-label="open Kathan iMessage">
        Kathan - iMessage
      </Link>

      <div
        className="cosmic-stage"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerDown={startAudio}
        tabIndex={0}
        aria-label="cosmic memory archive"
      >
        <CosmicCanvas page={page} direction={direction} reducedMotion={reducedMotion} />
        <div className="cosmic-vignette" aria-hidden />
        <div className="cosmic-grain" aria-hidden />
        <AnimatePresence>
          {transitionBurst && <TransitionBurst key={transitionBurst.id} burst={transitionBurst} />}
        </AnimatePresence>

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.section
            key={page}
            className="cosmic-page"
            custom={direction}
            initial={{ y: direction > 0 ? 90 : -90, opacity: 0, filter: "blur(14px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: direction > 0 ? -90 : 90, opacity: 0, filter: "blur(16px)" }}
            transition={{ duration: reducedMotion ? 0.01 : 0.62, ease: EASE }}
          >
            {renderScene()}
          </motion.section>
        </AnimatePresence>

        <nav className="cosmic-nav" aria-label="cosmic chapters">
          {Array.from({ length: PAGE_COUNT }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`go to chapter ${index + 1}`}
              className={index === page ? "active" : ""}
              onClick={() => goTo(index)}
            />
          ))}
        </nav>
      </div>
    </main>
  );
}
