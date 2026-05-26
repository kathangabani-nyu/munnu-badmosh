"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import type { ArchiveNode, CosmicStageConfig } from "./stages";
import type { MediaItem } from "@/data/media";

interface ConstellationSceneProps {
  stage: CosmicStageConfig;
  onOpen: (index: number) => void;
  reducedMotion: boolean;
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

export function ConstellationScene({ stage, onOpen, reducedMotion }: ConstellationSceneProps) {
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
              animate={{ opacity: 0.22, pathLength: 1 }}
              transition={{ delay: reducedMotion ? 0 : 0.2 + index * 0.035, duration: 0.65 }}
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
            } as CSSProperties
          }
          onClick={() => onOpen(index)}
          initial={{ opacity: 0, scale: 0.74, filter: "blur(9px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            delay: reducedMotion ? 0 : 0.12 + index * 0.035,
            duration: reducedMotion ? 0.01 : 0.72,
            ease: [0.16, 1, 0.3, 1],
          }}
          aria-label="open memory"
        >
          <NodePreview node={node} />
        </motion.button>
      ))}
    </div>
  );
}
