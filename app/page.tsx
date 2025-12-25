"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MemoryCard } from "@/components/MemoryCard";

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY ARCHIVE — Ethereal Edition
// A quiet, intimate, impossibly beautiful memory keeper
// ═══════════════════════════════════════════════════════════════════════════

// Types
interface Memory {
  id: string;
  type: "photo" | "video" | "text";
  src?: string;
  caption?: string;
  rotation?: number;
}

// Memories arranged in exact order with your captions
const memories: Memory[] = [
  { 
    id: "1", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.37.26 PM.jpeg", 
    caption: "", 
    rotation: -1.2 
  },
  { 
    id: "2", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-24 at 4.11.30 PM.jpeg", 
    caption: "twinning :\"", 
    rotation: 0.8 
  },
  { 
    id: "3", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.39.36 PM.jpeg", 
    caption: "<3", 
    rotation: -0.5 
  },
  { 
    id: "4", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.42.41 PM.jpeg", 
    caption: "prettiest you've ever looked 😂", 
    rotation: 0.4 
  },
  { 
    id: "5", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.39.58 PM.jpeg", 
    caption: "me", 
    rotation: -0.5 
  },
  { 
    id: "6", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.40.37 PM.jpeg", 
    caption: "you", 
    rotation: 1.1 
  },
  { 
    id: "7", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.42.09 PM.jpeg", 
    caption: "funnest nightout", 
    rotation: 0.6 
  },
  { 
    id: "8", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.42.24 PM.jpeg", 
    caption: "this explains everything", 
    rotation: -1.0 
  },
  { 
    id: "9", 
    type: "video", 
    src: "/media/WhatsApp Video 2025-12-21 at 11.38.32 PM.mp4", 
    caption: "no way i would forget this" 
  },
  { 
    id: "10", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.41.23 PM.jpeg", 
    caption: "best meal ever?", 
    rotation: -0.8 
  },
  { 
    id: "11", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.49.21 PM.jpeg", 
    caption: "crazy duo 💃🏻🕺🏻", 
    rotation: -0.3 
  },
  { 
    id: "12", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-23 at 2.30.25 AM.jpeg", 
    caption: "can't leave the love of your life behind", 
    rotation: 0.9 
  },
  { 
    id: "13", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-23 at 2.30.48 AM.jpeg", 
    caption: "💕", 
    rotation: -0.6 
  },
  { 
    id: "14", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-23 at 6.14.20 PM.jpeg", 
    caption: "cutie", 
    rotation: 1.0 
  },
  { 
    id: "15", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-23 at 6.43.50 PM.jpeg", 
    caption: "", 
    rotation: 0.7 
  },
  { 
    id: "16", 
    type: "video", 
    src: "/media/WhatsApp Video 2025-12-23 at 6.06.00 PM.mp4", 
    caption: "STEPH CURRY" 
  },
  { 
    id: "17", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.43.52 PM.jpeg", 
    caption: "honorable mention*", 
    rotation: -0.7 
  },
  { 
    id: "18", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.44.57 PM.jpeg", 
    caption: "was saving this one", 
    rotation: 1.2 
  },
  { 
    id: "19", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-23 at 6.43.11 PM.jpeg", 
    caption: "", 
    rotation: -0.4 
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// FLOATING PARTICLES — Ethereal background atmosphere
// ═══════════════════════════════════════════════════════════════════════════

function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-stone-300/30"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 400),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, -100],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAIN OVERLAY — Subtle film texture
// ═══════════════════════════════════════════════════════════════════════════

function GrainOverlay() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CAT MEMES — Floating easter eggs on the sides
// ═══════════════════════════════════════════════════════════════════════════

interface CatMeme {
  id: number;
  src: string;
  side: "left" | "right";
  top: string;
  rotation: number;
}

const catMemes: CatMeme[] = [
  { id: 1, src: "/media/memes/WhatsApp Image 2025-12-25 at 3.12.07 AM.jpeg", side: "left", top: "15%", rotation: -8 },
  { id: 2, src: "/media/memes/WhatsApp Image 2025-12-25 at 3.15.58 AM.jpeg", side: "right", top: "25%", rotation: 12 },
  { id: 3, src: "/media/memes/WhatsApp Image 2025-12-25 at 3.12.4507 AM.jpeg", side: "left", top: "40%", rotation: -5 },
  { id: 4, src: "/media/memes/WhatsApp Image 12025-12-25 at 3.12.07 1AM.jpeg", side: "right", top: "50%", rotation: 10 },
  { id: 5, src: "/media/memes/WhatsApp Image 2025-12-25 at 3.112.07 AM.jpeg", side: "left", top: "65%", rotation: -7 },
  { id: 6, src: "/media/memes/WhatsApp Image 2025-12-25 at 3.12.07 1AM.jpeg", side: "right", top: "75%", rotation: 9 },
  { id: 7, src: "/media/memes/WhatsApp Image 2025-2312-25 at 3.12.07 AM.jpeg", side: "left", top: "85%", rotation: -6 },
];

function FloatingCatMemes() {
  const { scrollY } = useScroll();
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 hidden sm:block">
      {catMemes.map((meme, index) => {
        const isLeft = meme.side === "left";
        const parallaxSpeed = 0.05 + index * 0.02;
        const translateY = useTransform(scrollY, (value) => value * parallaxSpeed);
        
        return (
          <motion.div
            key={meme.id}
            className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden opacity-30 blur-[0.5px]"
            style={{
              [isLeft ? "left" : "right"]: "-20px",
              top: meme.top,
              rotate: meme.rotation,
              y: translateY,
            }}
            initial={{ 
              x: isLeft ? "-100%" : "100%",
              opacity: 0 
            }}
            animate={{ 
              x: 0,
              opacity: 0.3 
            }}
            transition={{ 
              delay: 1 + index * 0.2,
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <img
              src={meme.src}
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LANDING SECTION — The emotional entrance
// ═══════════════════════════════════════════════════════════════════════════

function LandingSection() {
  const { scrollY } = useScroll();
  const scrollYSpring = useSpring(scrollY, { stiffness: 100, damping: 30 });
  const opacity = useTransform(scrollYSpring, [0, 400], [1, 0]);
  const y = useTransform(scrollYSpring, [0, 400], [0, -50]);
  const scale = useTransform(scrollYSpring, [0, 400], [1, 0.95]);
  
  return (
    <motion.section 
      style={{ opacity, y, scale }}
      className="h-screen flex flex-col items-center justify-center px-8 relative"
    >
      {/* Soft radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-50/40 via-transparent to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center relative z-10"
      >
        <h1 className="font-serif text-[1.75rem] leading-[1.3] tracking-[-0.02em] text-stone-800">
          An incomplete record
          <br />
          <span className="text-stone-600">of accidental moments.</span>
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-8 text-[0.7rem] tracking-[0.2em] uppercase text-stone-500 font-light"
        >
          for private viewing
        </motion.p>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-8 bg-gradient-to-b from-transparent via-stone-400 to-transparent"
        />
      </motion.div>
    </motion.section>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// FOOTER — Minimal, quiet
// ═══════════════════════════════════════════════════════════════════════════

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="py-20 text-center"
    >
      <p className="text-[0.65rem] tracking-[0.25em] uppercase text-stone-400 font-light">
        archived quietly
      </p>
    </motion.footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIO CONTROLLER — Subtle background audio
// ═══════════════════════════════════════════════════════════════════════════

function AudioController() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Set volume to 100%
    if (audioRef.current) {
      audioRef.current.volume = 1.0;
    }

    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        setHasInteracted(true);
        audioRef.current.play().catch(() => {
          // Autoplay blocked, user will need to click manually
        });
        setIsPlaying(true);
      }
    };

    // Listen for first scroll or click
    window.addEventListener("scroll", handleFirstInteraction, { once: true });
    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("scroll", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasInteracted]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        setHasInteracted(true);
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/media/Radiohead - Weird Fishes _ Arpeggi.mp3"
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white/90 transition-all duration-300 group"
        aria-label={isPlaying ? "Mute audio" : "Play audio"}
      >
        {isPlaying ? (
          <svg
            className="w-5 h-5 text-stone-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M6.343 6.343l12.728 12.728M6.343 17.657L19.07 4.93"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-stone-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
      </motion.button>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function MemoryArchive() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <main className="min-h-screen bg-[#FAF9F7] selection:bg-amber-100/60 overflow-x-hidden">
      {/* Background atmosphere */}
      <FloatingParticles />
      <GrainOverlay />
      
      {/* Floating cat memes */}
      <FloatingCatMemes />
      
      {/* Audio controller */}
      <AudioController />
      
      {/* Ambient gradient backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-rose-100/15 rounded-full blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <LandingSection />
        
        {/* Spacer with subtle divider */}
        <div className="h-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-stone-300/50" />
        </div>
        
        {/* Memory cards */}
        <section className="max-w-md mx-auto">
          {memories.map((memory, index) => (
            <MemoryCard 
              key={memory.id} 
              type={memory.type}
              src={memory.src}
              caption={memory.caption}
              rotation={memory.rotation}
              index={index}
            />
          ))}
        </section>
        
        <Footer />
      </div>
    </main>
  );
}
