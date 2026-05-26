"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
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

  const side = index % 2 === 0 ? 1 : -1;
  const depth = node.hero ? 1.15 : 0.82;
  const fromCenterX = (50 - node.x) * 9 + direction * side * (170 + (index % 4) * 38);
  const fromCenterY = (50 - node.y) * 6 + (index % 3 === 0 ? 150 : -120);

  return {
    opacity: 0,
    x: fromCenterX,
    y: fromCenterY,
    scale: depth * 0.58,
    filter: "blur(22px)",
  };
}

export function ConstellationScene({ stage, onOpen, reducedMotion, direction, ready }: ConstellationSceneProps) {
  return (
    <div className={`cosmic-constellation cosmic-constellation-${stage.id}`}>
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

      {stage.nodes.map((node, index) => {
        const swoop = getSwoopState(node, index, direction, reducedMotion);
        const settleX = Math.sign(swoop.x || 1) * -10;
        const settleY = Math.sign(swoop.y || 1) * 7;
        const orbitArrival = reducedMotion
          ? { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }
          : {
              opacity: [0, 0.72, 0.96, 1],
              x: [swoop.x, swoop.x * 0.28, settleX, 0],
              y: [swoop.y, swoop.y * 0.2, settleY, 0],
              scale: [swoop.scale, node.hero ? 1.08 : 1.04, node.hero ? 1.02 : 1.01, 1],
              filter: ["blur(22px)", "blur(5px)", "blur(0px)", "blur(0px)"],
            };

        return (
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
            initial={swoop}
            animate={ready ? orbitArrival : swoop}
            transition={{
              delay: ready && !reducedMotion ? 0.02 + index * 0.035 : 0,
              duration: reducedMotion ? 0.01 : 1.46,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.64, 0.86, 1],
            }}
            aria-label={`open ${node.label} memory`}
          >
            <span className="cosmic-node-orbit" aria-hidden />
            <span className="cosmic-node-sheen" aria-hidden />
            <NodePreview node={node} />
          </motion.button>
        );
      })}
    </div>
  );
}
