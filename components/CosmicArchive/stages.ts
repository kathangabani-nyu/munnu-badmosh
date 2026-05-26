import {
  getMediaByFilename,
  getMediaForFolder,
  getTemplatePhotos,
  type MediaItem,
} from "@/data/media";

export type StageId = "earth" | "solar" | "milky-way" | "galaxies" | "nebula" | "black-hole";
export type FigureMode = "none" | "pair" | "codyMay" | "split";

export interface OrbitPoint {
  x: number;
  y: number;
  size: number;
  rotate: number;
  hero?: boolean;
}

export interface ArchiveNode {
  id: string;
  items: MediaItem[];
  x: number;
  y: number;
  size: number;
  rotate: number;
  hero?: boolean;
}

export interface CosmicStageConfig {
  id: StageId;
  kicker: string;
  title: string;
  backdrop: string;
  backdropPosition?: string;
  cameraDepth: number;
  figureMode: FigureMode;
  accent: string;
  layout: OrbitPoint[];
  nodes: ArchiveNode[];
}

const SPACE = {
  earth: "/media/space/milky-way.jpg",
  solar: "/media/space/solar-system.jpg",
  milkyWay: "/media/space/milky-way.jpg",
  galaxies: "/media/space/galaxy-field.jpg",
  nebula: "/media/space/carina-nebula.png",
  blackHole: "/media/space/black-hole.jpg",
};

const LAYOUTS: Record<string, OrbitPoint[]> = {
  single: [{ x: 66, y: 66, size: 196, rotate: 3, hero: true }],
  solar: [
    { x: 23, y: 63, size: 172, rotate: -6, hero: true },
    { x: 70, y: 31, size: 148, rotate: 5, hero: true },
    { x: 76, y: 70, size: 134, rotate: 7 },
    { x: 32, y: 31, size: 122, rotate: -8 },
    { x: 18, y: 45, size: 108, rotate: 5 },
    { x: 84, y: 52, size: 108, rotate: -5 },
    { x: 38, y: 78, size: 106, rotate: 6 },
    { x: 63, y: 83, size: 102, rotate: -7 },
    { x: 24, y: 18, size: 92, rotate: 8 },
    { x: 63, y: 16, size: 90, rotate: -4 },
    { x: 12, y: 71, size: 88, rotate: 3 },
    { x: 88, y: 78, size: 88, rotate: -3 },
    { x: 15, y: 28, size: 84, rotate: -6 },
    { x: 73, y: 89, size: 84, rotate: 5 },
    { x: 30, y: 88, size: 82, rotate: -4 },
    { x: 84, y: 36, size: 82, rotate: 6 },
    { x: 10, y: 57, size: 80, rotate: 7 },
    { x: 91, y: 63, size: 80, rotate: -6 },
    { x: 36, y: 14, size: 78, rotate: 4 },
    { x: 55, y: 91, size: 78, rotate: -5 },
    { x: 67, y: 45, size: 76, rotate: 3 },
    { x: 29, y: 52, size: 76, rotate: -3 },
  ],
  milkyWay: [
    { x: 20, y: 62, size: 168, rotate: -5, hero: true },
    { x: 74, y: 36, size: 152, rotate: 4, hero: true },
    { x: 80, y: 68, size: 134, rotate: 7 },
    { x: 31, y: 28, size: 124, rotate: -7 },
    { x: 17, y: 43, size: 110, rotate: 5 },
    { x: 85, y: 53, size: 108, rotate: -4 },
    { x: 38, y: 80, size: 106, rotate: 6 },
    { x: 63, y: 82, size: 102, rotate: -7 },
    { x: 25, y: 17, size: 92, rotate: 8 },
    { x: 62, y: 18, size: 90, rotate: -4 },
    { x: 12, y: 72, size: 88, rotate: 3 },
    { x: 88, y: 79, size: 88, rotate: -2 },
    { x: 14, y: 28, size: 84, rotate: -6 },
    { x: 71, y: 90, size: 84, rotate: 5 },
    { x: 37, y: 13, size: 80, rotate: 3 },
  ],
  galaxies: [
    { x: 22, y: 66, size: 166, rotate: -6, hero: true },
    { x: 73, y: 34, size: 148, rotate: 5, hero: true },
    { x: 79, y: 72, size: 128, rotate: 7 },
    { x: 33, y: 30, size: 118, rotate: -8 },
    { x: 16, y: 46, size: 104, rotate: 5 },
    { x: 86, y: 54, size: 102, rotate: -5 },
    { x: 39, y: 82, size: 100, rotate: 6 },
    { x: 61, y: 83, size: 96, rotate: -7 },
    { x: 24, y: 18, size: 90, rotate: 8 },
    { x: 61, y: 18, size: 88, rotate: -4 },
    { x: 11, y: 72, size: 86, rotate: 3 },
    { x: 88, y: 80, size: 86, rotate: -2 },
    { x: 14, y: 29, size: 82, rotate: -6 },
    { x: 71, y: 90, size: 82, rotate: 5 },
    { x: 36, y: 13, size: 80, rotate: 3 },
  ],
  nebula: [
    { x: 21, y: 63, size: 170, rotate: -5, hero: true },
    { x: 73, y: 34, size: 150, rotate: 5, hero: true },
    { x: 80, y: 70, size: 136, rotate: 7 },
    { x: 33, y: 29, size: 124, rotate: -8 },
    { x: 18, y: 45, size: 110, rotate: 5 },
    { x: 85, y: 53, size: 108, rotate: -5 },
    { x: 38, y: 80, size: 106, rotate: 6 },
    { x: 63, y: 82, size: 102, rotate: -7 },
    { x: 25, y: 17, size: 92, rotate: 8 },
    { x: 62, y: 17, size: 90, rotate: -4 },
    { x: 12, y: 72, size: 88, rotate: 3 },
    { x: 88, y: 79, size: 88, rotate: -2 },
    { x: 14, y: 28, size: 84, rotate: -6 },
    { x: 72, y: 90, size: 84, rotate: 5 },
    { x: 36, y: 13, size: 82, rotate: 4 },
    { x: 91, y: 63, size: 82, rotate: -6 },
    { x: 28, y: 90, size: 82, rotate: -4 },
  ],
};

function compact(items: Array<MediaItem | undefined>): MediaItem[] {
  return items.filter(Boolean) as MediaItem[];
}

function unique(items: MediaItem[]): MediaItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.src)) return false;
    seen.add(item.src);
    return true;
  });
}

function folders(names: string[]): MediaItem[] {
  return unique(names.flatMap((name) => getMediaForFolder(name)));
}

function makeNodes(
  id: StageId,
  groups: MediaItem[][],
  layout: OrbitPoint[]
): ArchiveNode[] {
  return groups
    .filter((group) => group.length > 0)
    .map((items, index) => {
      const coord = layout[index % layout.length];
      const lap = Math.floor(index / layout.length);
      return {
        id: `${id}-${index}`,
        items,
        x: Math.max(6, Math.min(94, coord.x + lap * 2 * (index % 2 ? -1 : 1))),
        y: Math.max(10, Math.min(91, coord.y + lap * 3 * (index % 3 === 0 ? -1 : 1))),
        size: Math.max(74, coord.size - lap * 6),
        rotate: coord.rotate,
        hero: coord.hero,
      };
    });
}

function singles(items: MediaItem[]): MediaItem[][] {
  return items.map((item) => [item]);
}

const startPhoto = getMediaByFilename("start with this photo");
const topgolfPhoto = getMediaByFilename("topgolf where you beat me");
const lastPhoto = getMediaByFilename("last photo");
const cutiePair = getMediaForFolder("keep both these photos side by side and say you cutie patootie in both of them");

export const TEMPLATE_PHOTOS = getTemplatePhotos();

const earthLayout = LAYOUTS.single;
const solarLayout = LAYOUTS.solar;
const milkyWayLayout = LAYOUTS.milkyWay;
const galaxiesLayout = LAYOUTS.galaxies;
const nebulaLayout = LAYOUTS.nebula;
const blackHoleLayout = LAYOUTS.single;

export const COSMIC_STAGES: CosmicStageConfig[] = [
  {
    id: "earth",
    kicker: "earth",
    title: "cody + may",
    backdrop: SPACE.earth,
    backdropPosition: "50% 50%",
    cameraDepth: 0,
    figureMode: "codyMay",
    accent: "#7fb8ff",
    layout: earthLayout,
    nodes: makeNodes("earth", singles(compact([startPhoto])), earthLayout),
  },
  {
    id: "solar",
    kicker: "solar system",
    title: "home",
    backdrop: SPACE.solar,
    backdropPosition: "50% 50%",
    cameraDepth: 1,
    figureMode: "pair",
    accent: "#ffb347",
    layout: solarLayout,
    nodes: makeNodes("solar", singles(folders(["home", "brooklyn"])), solarLayout),
  },
  {
    id: "milky-way",
    kicker: "milky way",
    title: "us",
    backdrop: SPACE.milkyWay,
    backdropPosition: "50% 50%",
    cameraDepth: 2.15,
    figureMode: "split",
    accent: "#b88cff",
    layout: milkyWayLayout,
    nodes: makeNodes(
      "milky-way",
      singles(folders(["cute photos of her", "funny photos of her", "midtown", "central-park"])),
      milkyWayLayout
    ),
  },
  {
    id: "galaxies",
    kicker: "galaxy field",
    title: "everywhere",
    backdrop: SPACE.galaxies,
    backdropPosition: "50% 50%",
    cameraDepth: 3.05,
    figureMode: "split",
    accent: "#7dd3fc",
    layout: galaxiesLayout,
    nodes: makeNodes(
      "galaxies",
      singles(
        folders([
          "sewell-farm",
          "hamilton-farm",
          "fordham",
          "greenwood",
          "road-trip",
          "her dog - sparku",
          "our kittens - Lizz and Baddie",
        ])
      ),
      galaxiesLayout
    ),
  },
  {
    id: "nebula",
    kicker: "carina nebula",
    title: "you",
    backdrop: SPACE.nebula,
    backdropPosition: "50% 50%",
    cameraDepth: 4,
    figureMode: "pair",
    accent: "#ff63b7",
    layout: nebulaLayout,
    nodes: makeNodes(
      "nebula",
      [
        ...singles(folders(["one where she bullied me"])),
        cutiePair,
        ...singles(folders(["memes"])),
        ...singles(compact([topgolfPhoto])),
      ],
      nebulaLayout
    ),
  },
  {
    id: "black-hole",
    kicker: "event horizon",
    title: "last light",
    backdrop: SPACE.blackHole,
    backdropPosition: "50% 50%",
    cameraDepth: 5.2,
    figureMode: "codyMay",
    accent: "#ff6319",
    layout: blackHoleLayout,
    nodes: makeNodes("black-hole", singles(compact([lastPhoto])), blackHoleLayout),
  },
];

export const PERSONAL_MEDIA_COUNT = COSMIC_STAGES.reduce(
  (count, stage) => count + stage.nodes.reduce((stageCount, node) => stageCount + node.items.length, 0),
  0
);
