"use client";

import { useState, useEffect } from "react";
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

// Memories arranged aesthetically
const memories: Memory[] = [
  { 
    id: "1", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.37.26 PM.jpeg", 
    caption: "This escalated quickly.", 
    rotation: -1.2 
  },
  { 
    id: "2", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.39.36 PM.jpeg", 
    caption: "Unplanned, but inevitable.", 
    rotation: 0.8 
  },
  { 
    id: "3", 
    type: "video", 
    src: "/media/WhatsApp Video 2025-12-21 at 11.38.32 PM.mp4", 
    caption: "No notes." 
  },
  { 
    id: "4", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.39.58 PM.jpeg", 
    caption: "We were both right.", 
    rotation: -0.5 
  },
  { 
    id: "5", 
    type: "text", 
    caption: "Snowfight evidence." 
  },
  { 
    id: "6", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.40.37 PM.jpeg", 
    caption: "Before everything changed.", 
    rotation: 1.1 
  },
  { 
    id: "7", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.41.23 PM.jpeg", 
    caption: "Perfect timing.", 
    rotation: -0.8 
  },
  { 
    id: "8", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.42.09 PM.jpeg", 
    caption: "Caught in the moment.", 
    rotation: 0.6 
  },
  { 
    id: "9", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.42.24 PM.jpeg", 
    caption: "No words needed.", 
    rotation: -1.0 
  },
  { 
    id: "10", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.42.41 PM.jpeg", 
    caption: "This was the plan.", 
    rotation: 0.4 
  },
  { 
    id: "11", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.43.52 PM.jpeg", 
    caption: "Exactly as intended.", 
    rotation: -0.7 
  },
  { 
    id: "12", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.44.57 PM.jpeg", 
    caption: "Worth every second.", 
    rotation: 1.2 
  },
  { 
    id: "13", 
    type: "photo", 
    src: "/media/WhatsApp Image 2025-12-21 at 11.49.21 PM.jpeg", 
    caption: "The best kind.", 
    rotation: -0.3 
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
