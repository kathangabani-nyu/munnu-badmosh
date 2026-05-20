"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { doors } from "@/data/doors";
import { mediaById } from "@/data/media";
import { Door } from "./Door";
import { useHaptics } from "./useHaptics";

export function Doors() {
  const sectionRef = useRef<HTMLElement>(null);
  const doorsInView = useInView(sectionRef, { amount: 0.25, once: true });
  const [openDoorId, setOpenDoorId] = useState<string | null>(null);
  const { tap } = useHaptics();
  const activeDoor = doors.find((door) => door.id === openDoorId) ?? null;

  return (
    <>
      <section
        ref={sectionRef}
        className="relative z-10 min-h-[100vh] px-5 md:px-14 py-28 md:py-36"
      >
        <div className="mx-auto max-w-3xl">
          <p className="label-mono mb-5">module 02 · conditional drops</p>
          <h2 className="font-display text-[clamp(2.75rem,9vw,5.5rem)] text-[var(--map-ink)] leading-[0.95]">
            open when ___
          </h2>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-mute)] max-w-xl leading-relaxed">
            six emergency protocols. none scientifically validated.
          </p>

          <div className="mt-14 divide-y divide-[var(--hairline)] border-t border-[var(--hairline)]">
            {doors.map((door) => (
              <Door
                key={door.id}
                door={door}
                onOpen={(id) => {
                  tap();
                  setOpenDoorId(id);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeDoor && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(31,29,26,0.42)] px-4 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenDoorId(null)}
          >
            <motion.div
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[var(--hairline)] bg-[var(--paper-bg)] p-6 md:p-8 shadow-[0_30px_80px_-50px_rgba(31,29,26,0.55)]"
              initial={{ y: 22, opacity: 0.65 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <p className="label-mono mb-3">{activeDoor.label}</p>
              <h3 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] text-[var(--map-ink)] leading-[1.05]">
                {activeDoor.title}
              </h3>
              <p className="mt-5 font-mono text-[13px] leading-relaxed text-[var(--ink-soft)]">{activeDoor.body}</p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {activeDoor.photos.slice(0, 2).map((mediaId) => {
                  const media = mediaById[mediaId];
                  if (!media) return null;
                  return (
                    <div key={mediaId} className="overflow-hidden border border-[var(--hairline)] bg-[rgba(255,255,255,0.35)]">
                      <img src={media.src} alt="" className="h-36 w-full object-cover" loading="lazy" />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {doorsInView && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex gap-2 rounded-full border border-[var(--hairline)] bg-[rgba(250,249,245,0.88)] px-2 py-2 shadow-[0_12px_40px_-18px_rgba(31,29,26,0.35)] backdrop-blur-md"
          aria-label="Open when shortcuts"
        >
          {doors.map((door) => (
            <button
              key={door.id}
              type="button"
              title={door.label}
              onClick={() => {
                tap();
                setOpenDoorId(door.id);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full text-lg transition-colors hover:bg-[rgba(200,71,43,0.08)]"
            >
              <span aria-hidden className="select-none">
                {door.glyph}
              </span>
            </button>
          ))}
        </motion.div>
      )}
    </>
  );
}
