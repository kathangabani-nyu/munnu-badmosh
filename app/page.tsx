"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Caveat, Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { TextingGame } from "@/components/TextingGame/TextingGame";
import type { GamePhase } from "@/components/TextingGame/types";
import { Walk } from "@/components/walk/Walk";

const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", weight: ["500", "700"] });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: ["400", "500", "700", "900"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.035]"
      style={{
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
      }}
    />
  );
}

function Footer() {
  return (
    <footer className="py-20 text-center">
      <p className="label-mono normal-case tracking-[0.04em] text-[10px]">
        wait how do i remove this? cursor stop. CURSOR STOP WRITING.
      </p>
    </footer>
  );
}

function AudioController({ enabled }: { enabled: boolean }) {
  const bgAudioRef = useRef<HTMLAudioElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!enabled || !bgAudioRef.current) return;
    bgAudioRef.current.volume = 0.95;

    const start = () => {
      if (!hasInteracted && bgAudioRef.current) {
        setHasInteracted(true);
        bgAudioRef.current.play().catch(() => {});
      }
    };

    window.addEventListener("scroll", start, { once: true });
    window.addEventListener("click", start, { once: true });
    window.addEventListener("touchstart", start, { once: true });

    return () => {
      window.removeEventListener("scroll", start);
      window.removeEventListener("click", start);
      window.removeEventListener("touchstart", start);
    };
  }, [enabled, hasInteracted]);

  return <audio ref={bgAudioRef} src="/media/Radiohead - Weird Fishes _ Arpeggi.mp3" loop />;
}

export default function MemoryArchive() {
  const [mounted, setMounted] = useState(false);
  const [gamePhase, setGamePhase] = useState<GamePhase>("playing");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleGameComplete = () => {
    setGamePhase("transitioning");
    setTimeout(() => {
      setGamePhase("archive");
      window.scrollTo(0, 0);
    }, 1200);
  };

  return (
    <main
      className={`min-h-screen bg-[var(--paper-bg)] selection:bg-[rgba(200,71,43,0.14)] overflow-x-hidden ${caveat.variable} ${fraunces.variable} ${inter.variable} ${mono.variable}`}
    >
      <GrainOverlay />

      <AnimatePresence>{gamePhase === "playing" && <TextingGame onComplete={handleGameComplete} />}</AnimatePresence>

      <AnimatePresence>
        {gamePhase === "transitioning" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 bg-[var(--paper-bg)] z-30 flex items-center justify-center"
          >
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.5, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <div className="w-12 h-[1px] bg-[var(--map-ink)]/30 mx-auto" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {gamePhase === "archive" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <AudioController enabled />
          <Walk />
          <Footer />
        </motion.div>
      )}
    </main>
  );
}
