import {
  getMediaByFilename,
  getMediaForFolder,
  getTemplatePhotos,
  type MediaItem,
} from "@/data/media";

export type StageId = "earth" | "solar" | "milky-way" | "galaxies" | "nebula" | "black-hole";

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

const LAYOUTS = {
  single: [{ x: 68, y: 64, size: 186, rotate: 4 }],
  sparse: [
    { x: 22, y: 64, size: 168, rotate: -5 },
    { x: 74, y: 32, size: 142, rotate: 4 },
    { x: 64, y: 76, size: 124, rotate: 7 },
    { x: 34, y: 28, size: 112, rotate: -8 },
    { x: 84, y: 58, size: 100, rotate: 6 },
    { x: 18, y: 42, size: 96, rotate: 3 },
    { x: 52, y: 48, size: 116, rotate: -2 },
    { x: 44, y: 82, size: 96, rotate: -6 },
  ],
  dense: [
    { x: 22, y: 66, size: 172, rotate: -5 },
    { x: 74, y: 28, size: 150, rotate: 4 },
    { x: 79, y: 70, size: 132, rotate: 7 },
    { x: 35, y: 30, size: 122, rotate: -8 },
    { x: 52, y: 49, size: 114, rotate: 2 },
    { x: 15, y: 44, size: 104, rotate: 6 },
    { x: 88, y: 48, size: 104, rotate: -5 },
    { x: 44, y: 80, size: 100, rotate: 5 },
    { x: 63, y: 16, size: 96, rotate: -4 },
    { x: 28, y: 15, size: 90, rotate: 8 },
    { x: 67, y: 88, size: 90, rotate: -7 },
    { x: 12, y: 77, size: 88, rotate: 3 },
    { x: 91, y: 82, size: 86, rotate: -2 },
    { x: 48, y: 20, size: 88, rotate: 5 },
    { x: 18, y: 24, size: 82, rotate: -6 },
    { x: 82, y: 16, size: 84, rotate: 6 },
    { x: 31, y: 92, size: 82, rotate: -4 },
    { x: 55, y: 69, size: 88, rotate: 4 },
    { x: 7, y: 59, size: 80, rotate: 7 },
    { x: 94, y: 63, size: 80, rotate: -6 },
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
  layout: keyof typeof LAYOUTS = "dense"
): ArchiveNode[] {
  const coords = LAYOUTS[layout];

  return groups
    .filter((group) => group.length > 0)
    .map((items, index) => {
      const coord = coords[index % coords.length];
      const lap = Math.floor(index / coords.length);
      return {
        id: `${id}-${index}`,
        items,
        x: Math.max(6, Math.min(94, coord.x + lap * 3 * (index % 2 ? -1 : 1))),
        y: Math.max(9, Math.min(92, coord.y + lap * 4 * (index % 3 === 0 ? -1 : 1))),
        size: Math.max(76, coord.size - lap * 8),
        rotate: coord.rotate,
        hero: index < 2,
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

export const COSMIC_STAGES: CosmicStageConfig[] = [
  {
    id: "earth",
    kicker: "earth",
    title: "cody + may",
    backdrop: SPACE.earth,
    backdropPosition: "50% 50%",
    nodes: makeNodes("earth", singles(compact([startPhoto])), "single"),
  },
  {
    id: "solar",
    kicker: "solar system",
    title: "home",
    backdrop: SPACE.solar,
    backdropPosition: "50% 50%",
    nodes: makeNodes("solar", singles(folders(["home", "brooklyn"])), "dense"),
  },
  {
    id: "milky-way",
    kicker: "milky way",
    title: "us",
    backdrop: SPACE.milkyWay,
    backdropPosition: "50% 50%",
    nodes: makeNodes(
      "milky-way",
      singles(folders(["cute photos of her", "funny photos of her", "midtown", "central-park"])),
      "dense"
    ),
  },
  {
    id: "galaxies",
    kicker: "galaxy field",
    title: "everywhere",
    backdrop: SPACE.galaxies,
    backdropPosition: "50% 50%",
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
      "sparse"
    ),
  },
  {
    id: "nebula",
    kicker: "carina nebula",
    title: "you",
    backdrop: SPACE.nebula,
    backdropPosition: "50% 50%",
    nodes: makeNodes(
      "nebula",
      [
        ...singles(folders(["one where she bullied me"])),
        cutiePair,
        ...singles(folders(["memes"])),
        ...singles(compact([topgolfPhoto])),
      ],
      "dense"
    ),
  },
  {
    id: "black-hole",
    kicker: "event horizon",
    title: "last light",
    backdrop: SPACE.blackHole,
    backdropPosition: "50% 50%",
    nodes: makeNodes("black-hole", singles(compact([lastPhoto])), "single"),
  },
];

export const PERSONAL_MEDIA_COUNT = COSMIC_STAGES.reduce(
  (count, stage) => count + stage.nodes.reduce((stageCount, node) => stageCount + node.items.length, 0),
  0
);
