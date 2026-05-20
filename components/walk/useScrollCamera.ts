"use client";

import {
  MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { RefObject } from "react";
import { getWalkSpots } from "@/data/spots";

export interface CameraState {
  progress: MotionValue<number>;
  x: MotionValue<string>;
  y: MotionValue<string>;
  scale: MotionValue<number>;
  reducedMotion: boolean;
}

/**
 * Spot-aware scroll camera: pan/zoom so each pin gets a scroll "beat" near center.
 * Reduced motion: same keyframes, no spring smoothing (discrete follow).
 */
export function useScrollCamera(targetRef: RefObject<HTMLElement | null>): CameraState {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const reducedMotion = useReducedMotion() ?? false;

  const smoothed = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    mass: 0.4,
  });

  const progress = reducedMotion ? scrollYProgress : smoothed;

  const introFrac = 0.09;
  const outroStart = 0.86;
  const walkFrac = outroStart - introFrac;

  const visibleSpots = getWalkSpots();
  const stopFrac = walkFrac / Math.max(visibleSpots.length, 1);

  const baseScale = 1.0;
  const focusScale = 1.52;

  const computeTranslate = (px: number, py: number, scale: number) => {
    const tx = -(px - 50) * 2.2 * scale * 0.56;
    const ty = -(py - 50) * 1.95 * scale * 0.56;
    return { tx, ty };
  };

  const breakpoints: number[] = [0, introFrac];
  const xVals: string[] = ["0%", "0%"];
  const yVals: string[] = ["0%", "0%"];
  const scaleVals: number[] = [baseScale, baseScale + 0.05];

  visibleSpots.forEach((spot, i) => {
    const center = introFrac + i * stopFrac + stopFrac * 0.52;
    const { tx, ty } = computeTranslate(spot.mapPosition.x, spot.mapPosition.y, focusScale);
    breakpoints.push(center);
    xVals.push(`${tx}%`);
    yVals.push(`${ty}%`);
    scaleVals.push(focusScale);
  });

  breakpoints.push(outroStart);
  xVals.push("-6%");
  yVals.push("-2%");
  scaleVals.push(0.72);

  breakpoints.push(1);
  xVals.push("0%");
  yVals.push("0%");
  scaleVals.push(0.43);

  const x = useTransform(progress, breakpoints, xVals);
  const y = useTransform(progress, breakpoints, yVals);
  const scale = useTransform(progress, breakpoints, scaleVals);

  return {
    progress,
    x,
    y,
    scale,
    reducedMotion,
  };
}

export function getSpotBands() {
  const introFrac = 0.09;
  const outroStart = 0.86;
  const walkFrac = outroStart - introFrac;
  const visibleSpots = getWalkSpots();
  const stopFrac = walkFrac / Math.max(visibleSpots.length, 1);

  return visibleSpots.map((spot, i) => {
    const start = introFrac + i * stopFrac;
    return {
      id: spot.id,
      start,
      end: start + stopFrac,
      center: start + stopFrac * 0.52,
    };
  });
}
