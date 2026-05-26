"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { CosmicStageConfig } from "./stages";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function StageTitle({
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
      initial={{ opacity: 0, y: -16, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -10, filter: "blur(8px)", transition: { duration: reducedMotion ? 0.01 : 0.16 } }}
      transition={{ duration: reducedMotion ? 0.01 : 0.68, ease: EASE }}
    >
      {kicker && <p>{kicker}</p>}
      <h1>{title}</h1>
    </motion.div>
  );
}

function ChapterDots({
  stages,
  activeIndex,
  onSelect,
}: {
  stages: CosmicStageConfig[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <nav className="cosmic-nav" aria-label="cosmic chapters">
      {stages.map((item, index) => (
        <button
          key={item.id}
          type="button"
          aria-label={`go to ${item.title}`}
          aria-current={index === activeIndex ? "step" : undefined}
          className={index === activeIndex ? "active" : ""}
          onClick={() => onSelect(index)}
        >
          <span className="cosmic-nav-dot" aria-hidden />
        </button>
      ))}
    </nav>
  );
}

export function CosmicHud({
  stages,
  activeIndex,
  onSelect,
}: {
  stages: CosmicStageConfig[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const progress = stages.length > 1 ? (activeIndex / (stages.length - 1)) * 100 : 100;

  return (
    <>
      <div className="cosmic-hud-card" aria-hidden>
        <span>{String(activeIndex + 1).padStart(2, "0")}</span>
        <Progress value={progress} className="cosmic-hud-progress" />
        <span>{String(stages.length).padStart(2, "0")}</span>
      </div>

      <Button asChild variant="glass" size="sm" className="cosmic-chat-link">
        <Link href="/imessage" aria-label="open Kathan iMessage">
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          <span>Kathan - iMessage</span>
        </Link>
      </Button>

      <ChapterDots stages={stages} activeIndex={activeIndex} onSelect={onSelect} />
    </>
  );
}
