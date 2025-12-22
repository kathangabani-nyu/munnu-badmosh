"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY ARCHIVE — Ethereal Edition
// A quiet, intimate, impossibly beautiful memory keeper
// Optimized for iPhone 15 Pro (393 × 852 viewport)
// ═══════════════════════════════════════════════════════════════════════════

// Types
interface Memory {
  id: string;
  type: "photo" | "video" | "text";
  src?: string;
  caption?: string;
  rotation?: number;
}

// Sample memories (replace with your own)
const memories: Memory[] = [
  { id: "1", type: "photo", src: "/media/photo1.jpg", caption: "This escalated quickly.", rotation: -1.2 },
  { id: "2", type: "video", src: "/media/video1.mp4", caption: "Unplanned, but inevitable." },
  { id: "3", type: "photo", src: "/media/photo2.jpg", caption: "No notes.", rotation: 0.8 },
  { id: "4", type: "text", caption: "We were both right." },
  { id: "5", type: "photo", src: "/media/photo3.jpg", caption: "Snowfight evidence.", rotation: -0.5 },
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
// LANDING SECTION — The emotional entrance
// ═══════════════════════════════════════════════════════════════════════════

function LandingSection() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, -50]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);
  
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
// MEMORY CARD — The heart of the experience
// ═══════════════════════════════════════════════════════════════════════════

function MemoryCard({ memory, index }: { memory: Memory; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  
  const springProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const opacity = useTransform(springProgress, [0, 0.5], [0, 1]);
  const y = useTransform(springProgress, [0, 0.5], [60, 0]);
  const scale = useTransform(springProgress, [0, 0.5], [0.95, 1]);
  
  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };
  
  const rotation = memory.rotation || 0;
  
  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className="relative px-6 mb-16"
    >
      <motion.div
        whileHover={{ scale: 1.008 }}
        whileTap={{ scale: 0.995 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ rotate: rotation }}
        className="relative"
      >
        {/* Photo card */}
        {memory.type === "photo" && (
          <div className="relative overflow-hidden rounded-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]">
            {/* Placeholder — replace src with actual images */}
            <div className="aspect-[4/5] bg-gradient-to-br from-stone-200 via-stone-100 to-amber-50 relative">
              <img
                src={memory.src}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-black/5" />
            </div>
          </div>
        )}
        
        {/* Video card */}
        {memory.type === "video" && (
          <div 
            className="relative overflow-hidden rounded-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] cursor-pointer"
            onClick={toggleVideo}
          >
            <div className="aspect-[4/5] bg-stone-200 relative">
              <video
                ref={videoRef}
                src={memory.src}
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Play indicator */}
              <AnimatePresence>
                {!isVideoPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <div className="w-0 h-0 border-l-[10px] border-l-stone-700 border-y-[6px] border-y-transparent ml-1" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
        
        {/* Text-only card */}
        {memory.type === "text" && (
          <div className="py-16 px-8 text-center">
            <div className="w-12 h-[1px] bg-stone-300 mx-auto mb-6" />
            <p className="font-serif text-xl text-stone-600 italic">
              "{memory.caption}"
            </p>
            <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-6" />
          </div>
        )}
        
        {/* Caption */}
        {memory.caption && memory.type !== "text" && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-4 text-center text-[0.8rem] text-stone-500 font-light tracking-wide"
          >
            {memory.caption}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
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
            <MemoryCard key={memory.id} memory={memory} index={index} />
          ))}
        </section>
        
        <Footer />
      </div>
    </main>
  );
}
