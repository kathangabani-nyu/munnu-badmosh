"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { SpotDefinition } from "@/data/spots";

interface RoutePathProps {
  spots: SpotDefinition[];
  progress: MotionValue<number>;
}

export function RoutePath({ spots, progress }: RoutePathProps) {
  const pathLength = useTransform(progress, [0.08, 0.92], [0, 1]);

  const points = spots.map((spot) => ({
    x: (spot.mapPosition.x / 100) * 2400,
    y: (spot.mapPosition.y / 100) * 1800,
  }));

  const d = points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      const prev = points[index - 1];
      const cx = (prev.x + point.x) / 2;
      const cy = (prev.y + point.y) / 2 - (index % 2 === 0 ? 32 : -24);
      return `Q ${cx} ${cy}, ${point.x} ${point.y}`;
    })
    .join(" ");

  return (
    <motion.path
      d={d}
      fill="none"
      stroke="#FF6319"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      style={{ pathLength }}
    />
  );
}
