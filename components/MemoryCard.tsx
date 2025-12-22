"use client";

import { useState, useRef, forwardRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY CARD COMPONENT — Standalone, reusable
// ═══════════════════════════════════════════════════════════════════════════

interface MemoryCardProps {
  type: "photo" | "video" | "text";
  src?: string;
  caption?: string;
  rotation?: number;
  index?: number;
}

export const MemoryCard = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ type, src, caption, rotation = 0, index = 0 }, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = forwardedRef || internalRef;
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const { scrollYProgress } = useScroll({
      target: ref as React.RefObject<HTMLElement>,
      offset: ["start end", "center center"],
    });

    // Smooth spring physics for parallax
    const springConfig = { stiffness: 80, damping: 20, mass: 0.5 };
    const smoothProgress = useSpring(scrollYProgress, springConfig);

    const opacity = useTransform(smoothProgress, [0, 0.4], [0, 1]);
    const y = useTransform(smoothProgress, [0, 0.5], [80, 0]);
    const scale = useTransform(smoothProgress, [0, 0.5], [0.92, 1]);

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

    // Slight delay based on index for stagger effect
    const delay = index * 0.05;

    return (
      <motion.div
        ref={ref as React.Ref<HTMLDivElement>}
        style={{ opacity, y, scale }}
        className="relative px-5 sm:px-6 mb-14 sm:mb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: rotation }}
          whileInView={{ opacity: 1, y: 0, rotate: rotation }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{
            duration: 0.9,
            delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={{ scale: 1.012, rotate: rotation * 0.5 }}
          whileTap={{ scale: 0.995 }}
          className="relative will-change-transform"
        >
          {/* ═══════════════════════════════════════════════════════════════
              PHOTO CARD
              ═══════════════════════════════════════════════════════════════ */}
          {type === "photo" && (
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl group">
              {/* Ambient glow behind card */}
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-100/30 via-transparent to-rose-100/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Image container with aspect ratio */}
              <div className="relative aspect-[4/5] bg-gradient-to-br from-stone-100 to-stone-50 overflow-hidden">
                {/* Skeleton loader */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-100 via-stone-50 to-stone-100 animate-pulse" />
                )}

                <motion.img
                  src={src}
                  alt=""
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={imageLoaded ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover"
                />

                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/[0.04] via-transparent to-black/[0.02]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/[0.02] via-transparent to-black/[0.02]" />
                </div>

                {/* Inner border glow on hover */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/20 group-hover:ring-white/40 transition-all duration-500" />
              </div>

              {/* Soft shadow */}
              <div className="absolute -inset-px rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12),0_4px_16px_-4px_rgba(0,0,0,0.08)] pointer-events-none" />
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              VIDEO CARD
              ═══════════════════════════════════════════════════════════════ */}
          {type === "video" && (
            <div
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer group"
              onClick={toggleVideo}
            >
              {/* Ambient glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-100/30 via-transparent to-rose-100/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                <video
                  ref={videoRef}
                  src={src}
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/[0.06] via-transparent to-black/[0.03]" />

                {/* Play button overlay */}
                <AnimatePresence mode="wait">
                  {!isVideoPlaying && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/[0.08] backdrop-blur-[2px]"
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg shadow-black/10"
                      >
                        {/* Play icon */}
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-stone-700 ml-0.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Inner border */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/20" />
              </div>

              {/* Shadow */}
              <div className="absolute -inset-px rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] pointer-events-none" />
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TEXT-ONLY CARD
              ═══════════════════════════════════════════════════════════════ */}
          {type === "text" && (
            <motion.div
              className="py-12 sm:py-16 px-6 sm:px-8 text-center relative"
              whileHover={{ scale: 1.02 }}
            >
              {/* Decorative line top */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-10 sm:w-12 h-[1px] bg-gradient-to-r from-transparent via-stone-300 to-transparent mx-auto mb-6 sm:mb-8"
              />

              {/* Quote text */}
              <p className="font-serif text-lg sm:text-xl md:text-2xl text-stone-600/90 italic leading-relaxed">
                "{caption}"
              </p>

              {/* Decorative line bottom */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-10 sm:w-12 h-[1px] bg-gradient-to-r from-transparent via-stone-300 to-transparent mx-auto mt-6 sm:mt-8"
              />
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              CAPTION (for photo/video)
              ═══════════════════════════════════════════════════════════════ */}
          {caption && type !== "text" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 sm:mt-5 text-center text-[0.75rem] sm:text-[0.8rem] text-stone-500/80 font-light tracking-[0.02em]"
            >
              {caption}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    );
  }
);

MemoryCard.displayName = "MemoryCard";

export default MemoryCard;
