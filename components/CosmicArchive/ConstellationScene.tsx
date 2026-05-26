"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import type { ArchiveNode, CosmicStageConfig } from "./stages";
import type { MediaItem } from "@/data/media";

interface ConstellationSceneProps {
  stage: CosmicStageConfig;
  onOpen: (index: number) => void;
  reducedMotion: boolean;
  direction: number;
  ready: boolean;
}

function MediaPreview({ item }: { item: MediaItem }) {
  if (item.type === "video") {
    return (
      <video
        src={item.src}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        className="cosmic-node-media"
      />
    );
  }

  return <img src={item.src} alt="" className="cosmic-node-media" loading="lazy" draggable={false} />;
}

function NodePreview({ node }: { node: ArchiveNode }) {
  if (node.items.length > 1) {
    return (
      <div className="cosmic-node-pair">
        {node.items.slice(0, 2).map((item) => (
          <MediaPreview key={item.src} item={item} />
        ))}
      </div>
    );
  }

  return <MediaPreview item={node.items[0]} />;
}

function getSwoopState(node: ArchiveNode, index: number, direction: number, reducedMotion: boolean) {
  if (reducedMotion) return { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" };

  const fromCenterX = (50 - node.x) * 7 + direction * (90 + (index % 3) * 32);
  const fromCenterY = (50 - node.y) * 5 + (index % 2 === 0 ? 72 : -72);

  return {
    opacity: 0,
    x: fromCenterX,
    y: fromCenterY,
    scale: node.hero ? 0.78 : 0.58,
    filter: "blur(18px)",
  };
}

export function ConstellationScene({ stage, onOpen, reducedMotion, direction, ready }: ConstellationSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || reducedMotion || !sceneRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cosmic-node-orbit",
        { opacity: 0, scale: 0.72, rotate: -18 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.1, stagger: 0.035, ease: "expo.out" }
      );
      gsap.fromTo(
        ".cosmic-node-label",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.72, delay: 0.12, stagger: 0.028, ease: "power3.out" }
      );
    }, sceneRef);

    return () => ctx.revert();
  }, [ready, reducedMotion, stage.id]);

  return (
    <div ref={sceneRef} className={`cosmic-constellation cosmic-constellation-${stage.id}`}>
      <svg className="cosmic-constellation-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {stage.nodes.slice(1).map((node, index) => {
          const previous = stage.nodes[index];
          return (
            <motion.line
              key={`${previous.id}-${node.id}`}
              x1={previous.x}
              y1={previous.y}
              x2={node.x}
              y2={node.y}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={ready ? { opacity: 0.22, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
              transition={{ delay: ready && !reducedMotion ? 0.22 + index * 0.035 : 0, duration: reducedMotion ? 0.01 : 0.72 }}
            />
          );
        })}
      </svg>

      {stage.nodes.map((node, index) => (
        <motion.button
          key={node.id}
          type="button"
          className={`cosmic-photo-node ${node.hero ? "hero" : ""} ${node.items.length > 1 ? "paired" : ""}`}
          style={
            {
              "--node-x": `${node.x}%`,
              "--node-y": `${node.y}%`,
              "--node-size": `${node.size}px`,
              "--node-rotate": `${node.rotate}deg`,
              "--node-glow-strength": stage.glowIntensity,
            } as CSSProperties
          }
          onClick={() => onOpen(index)}
          initial={getSwoopState(node, index, direction, reducedMotion)}
          animate={ready ? { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" } : getSwoopState(node, index, direction, reducedMotion)}
          transition={{
            delay: ready && !reducedMotion ? 0.05 + index * 0.032 : 0,
            duration: reducedMotion ? 0.01 : 1.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          aria-label={`open ${node.label} memory`}
        >
          <span className="cosmic-node-orbit" aria-hidden />
          <span className="cosmic-node-sheen" aria-hidden />
          <NodePreview node={node} />
          <span className="cosmic-node-label">{node.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
