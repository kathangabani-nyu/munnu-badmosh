"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { getWalkSpots } from "@/data/spots";
import { getSpotBands } from "./useScrollCamera";
import { MapPin } from "./MapPin";
import { RoutePath } from "./RoutePath";

interface CinematicMapProps {
  x: MotionValue<string>;
  y: MotionValue<string>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  blur: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
}

export function CinematicMap({ x, y, scale, opacity, blur, scrollProgress, reducedMotion }: CinematicMapProps) {
  const spots = getWalkSpots();
  const bands = getSpotBands();
  const blurFilter = useTransform(blur, (value) => (reducedMotion ? "none" : `blur(${value}px)`));

  const activeX = useTransform(scrollProgress, bands.map((band) => band.center), spots.map((spot) => `${spot.mapPosition.x}%`));
  const activeY = useTransform(scrollProgress, bands.map((band) => band.center), spots.map((spot) => `${spot.mapPosition.y}%`));

  return (
    <motion.div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ opacity, filter: blurFilter }}>
      <div className="absolute inset-0 bg-[var(--paper-bg)]" />
      <div className="absolute inset-0 paper-wash opacity-90" />
      <div className="absolute inset-0 paper-fiber opacity-55" />

      <motion.div className="absolute inset-0 origin-center" style={{ x, y, scale }}>
        <div className="absolute left-[-36vw] top-[-24vh] w-[220vw] h-[170vh]">
          <svg viewBox="0 0 2400 1800" className="w-full h-full">
            <rect x="10" y="10" width="2380" height="1780" fill="none" stroke="rgba(31,29,26,0.12)" strokeWidth="2" />
            <rect x="30" y="30" width="2340" height="1740" fill="none" stroke="rgba(31,29,26,0.08)" strokeWidth="1" />

            <rect x="0" y="0" width="2400" height="1800" fill="#f4eedf" />
            <path d="M 0 360 C 280 250 520 260 760 340 C 900 390 1060 450 1280 430 C 1470 410 1700 300 1930 320 C 2150 340 2320 420 2400 500 L 2400 0 L 0 0 Z" fill="#bfd2dc" />
            <path d="M 0 1200 C 260 1100 500 1070 740 1120 C 990 1170 1220 1290 1490 1270 C 1710 1250 1960 1130 2210 1160 C 2290 1170 2360 1200 2400 1230 L 2400 1800 L 0 1800 Z" fill="#bfd2dc" />

            <path d="M 980 360 C 1030 460 1050 640 1030 860 C 1012 1060 965 1260 910 1460" fill="none" stroke="rgba(31,29,26,0.2)" strokeWidth="8" />
            <path d="M 1130 700 C 1240 730 1370 800 1490 910 C 1610 1020 1670 1150 1660 1320 C 1580 1400 1410 1430 1190 1400 C 1060 1375 975 1320 920 1250 Z" fill="#f7f2e7" stroke="rgba(31,29,26,0.17)" strokeWidth="2" />
            <path d="M 1000 660 C 1042 690 1082 750 1108 850 C 1140 980 1137 1125 1092 1285 C 1068 1365 1040 1430 1008 1490" fill="#f7f2e7" stroke="rgba(31,29,26,0.17)" strokeWidth="2" />
            <path d="M 700 1020 C 760 980 870 980 950 1030 C 970 1100 960 1160 910 1230 C 820 1238 740 1195 700 1130 Z" fill="#f7f2e7" stroke="rgba(31,29,26,0.17)" strokeWidth="2" />
            <path d="M 520 720 C 640 660 760 670 840 740 C 780 820 680 860 560 840 C 520 800 500 760 520 720 Z" fill="#f7f2e7" stroke="rgba(31,29,26,0.17)" strokeWidth="2" />

            <g stroke="rgba(31,29,26,0.1)" strokeWidth="1">
              <path d="M 980 720 L 1520 720" />
              <path d="M 980 810 L 1570 810" />
              <path d="M 980 900 L 1620 900" />
              <path d="M 980 990 L 1640 990" />
              <path d="M 980 1080 L 1620 1080" />
              <path d="M 980 1170 L 1560 1170" />
              <path d="M 980 1260 L 1500 1260" />
            </g>
            <g stroke="rgba(31,29,26,0.1)" strokeWidth="1">
              <path d="M 1060 620 L 980 1360" />
              <path d="M 1120 620 L 1040 1370" />
              <path d="M 1180 630 L 1100 1380" />
              <path d="M 1240 640 L 1160 1390" />
              <path d="M 1300 650 L 1220 1400" />
            </g>

            <g stroke="rgba(31,29,26,0.32)" strokeDasharray="10 8" strokeWidth="2">
              <path d="M 260 900 C 520 810 740 770 970 790" />
              <path d="M 130 1040 C 380 940 620 910 870 930" />
              <path d="M 420 520 C 660 530 860 620 1010 730" />
            </g>

            <g stroke="#FF6319" strokeWidth="4" fill="none">
              <path d="M 1060 730 L 1095 780 L 1135 850 L 1180 950 L 1240 1020 L 1290 1090 L 1340 1145 L 1395 1200 L 1450 1265" />
            </g>
            <g fill="#FF6319">
              <circle cx="1060" cy="730" r="5" />
              <circle cx="1095" cy="780" r="5" />
              <circle cx="1135" cy="850" r="5" />
              <circle cx="1180" cy="950" r="5" />
              <circle cx="1240" cy="1020" r="5" />
              <circle cx="1290" cy="1090" r="5" />
              <circle cx="1340" cy="1145" r="5" />
              <circle cx="1395" cy="1200" r="5" />
              <circle cx="1450" cy="1265" r="5" />
            </g>

            <RoutePath spots={spots} progress={scrollProgress} />

            <g transform="translate(110 1650)">
              <rect x="0" y="0" width="180" height="24" fill="none" stroke="rgba(31,29,26,0.24)" strokeWidth="1" />
              <text x="8" y="16" style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, fill: "#6f6a61", letterSpacing: "0.12em" }}>
                © weird fishes routing
              </text>
            </g>
          </svg>

          <div className="absolute inset-0">
            {spots.map((spot, index) => (
              <MapPin
                key={spot.id}
                x={spot.mapPosition.x}
                y={spot.mapPosition.y}
                label={spot.name}
                catalogTag={spot.catalogTag}
                progress={scrollProgress}
                start={bands[index]?.start ?? 0}
                end={bands[index]?.end ?? 1}
              />
            ))}

            <motion.div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: activeX, top: activeY }}>
              <motion.div
                className="w-6 h-6 rounded-full border-2 border-[#3b82f6]/70 bg-[#60a5fa]/30"
                animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.15, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-[#3b82f6]" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
