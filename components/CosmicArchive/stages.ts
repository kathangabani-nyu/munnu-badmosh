import { getMediaByFilename, getMediaFolders, getMediaForFolder, getTemplatePhotos, type MediaItem } from "@/data/media";

export type StageId = string;
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
  label: string;
  items: MediaItem[];
  x: number;
  y: number;
  size: number;
  rotate: number;
  hero?: boolean;
}

export interface CosmicStageConfig {
  id: StageId;
  phaseId: string;
  kicker: string;
  title: string;
  subtitle?: string;
  backdrop: string;
  backdropPosition?: string;
  cameraDepth: number;
  figureMode: FigureMode;
  accent: string;
  shortLabel: string;
  depthTint: string;
  glowIntensity: number;
  layout: OrbitPoint[];
  nodes: ArchiveNode[];
}

const MIN_FOLDER_ITEMS = 5;

const EXCLUDED_GALLERY_FOLDERS = new Set(["_root", "animation template images", "space"]);
const LAST_MEDIA_FOLDER = "Last folder";

const PREFERRED_FOLDER_ORDER = [
  "51 Church Ave",
  "in brooklyn",
  "actually cute photos of you",
  "cute photos of you",
  "midtown",
  "central-park",
  "animal farm",
  "Prof MacQueen's farm",
  "fordham",
  "greenwood",
  "sparku",
  "Lizz and Baddie",
  "one where you bullied me",
  "cutie",
  "memes",
  LAST_MEDIA_FOLDER,
];

const COSMIC_ARC = [
  {
    id: "earth",
    label: "Earth",
    note: "NASA Blue Marble-style Earth imagery, composited from satellite observations.",
    backdrop: "/media/space/earth-blue-marble.jpg",
    accent: "#7fb8ff",
    depthTint: "rgba(127, 184, 255, 0.18)",
    glowIntensity: 0.72,
  },
  {
    id: "solar-system",
    label: "Solar system",
    note: "Cinematic planet field built from a science-photo visual language.",
    backdrop: "/media/space/solar-system-cinematic.png",
    accent: "#ffb347",
    depthTint: "rgba(255, 179, 71, 0.18)",
    glowIntensity: 0.82,
  },
  {
    id: "milky-way",
    label: "Milky Way",
    note: "Wide galactic band image used as the local spiral-galaxy chapter.",
    backdrop: "/media/space/milky-way.jpg",
    accent: "#b88cff",
    depthTint: "rgba(184, 140, 255, 0.2)",
    glowIntensity: 0.9,
  },
  {
    id: "andromeda",
    label: "Andromeda Galaxy (M31)",
    note: "NASA/Hubble page: M31 image from a 12.5-inch Ritchey-Chretien telescope.",
    backdrop: "/media/space/andromeda-m31-nasa.jpeg",
    accent: "#7dd3fc",
    depthTint: "rgba(125, 211, 252, 0.18)",
    glowIntensity: 0.86,
  },
  {
    id: "local-group",
    label: "The Local Group",
    note: "NASA describes this as a composite of real images of actual nearby galaxies.",
    backdrop: "/media/space/galaxy-field.jpg",
    accent: "#80c7ff",
    depthTint: "rgba(128, 199, 255, 0.18)",
    glowIntensity: 0.88,
  },
  {
    id: "carina-nebula",
    label: "Carina Nebula",
    note: "Nebula imagery from telescope observations of star-forming gas and dust.",
    backdrop: "/media/space/carina-nebula.png",
    accent: "#ff63b7",
    depthTint: "rgba(255, 99, 183, 0.2)",
    glowIntensity: 0.98,
  },
  {
    id: "star-birth",
    label: "Star birth",
    note: "A stellar nursery phase: gas clouds collapsing into new stars.",
    backdrop: "/media/space/carina-nebula.png",
    accent: "#ffe28a",
    depthTint: "rgba(255, 226, 138, 0.18)",
    glowIntensity: 0.92,
  },
  {
    id: "red-giant",
    label: "Red supergiant",
    note: "Generated cosmic art for the late-life, dying-star chapter.",
    backdrop: "/media/space/dying-red-giant.png",
    accent: "#ff6b3d",
    depthTint: "rgba(255, 107, 61, 0.2)",
    glowIntensity: 1,
  },
  {
    id: "supernova-remnant",
    label: "SN 1006 remnant",
    note: "Hubble ACS/WFPC2 data through hydrogen and color filters.",
    backdrop: "/media/space/sn-1006-hubble.jpeg",
    accent: "#ff8a50",
    depthTint: "rgba(255, 138, 80, 0.2)",
    glowIntensity: 1,
  },
  {
    id: "black-hole",
    label: "Black hole",
    note: "Event-horizon chapter, using a scientific black-hole visual reference.",
    backdrop: "/media/space/black-hole.jpg",
    accent: "#ff6319",
    depthTint: "rgba(255, 99, 25, 0.2)",
    glowIntensity: 1.08,
  },
  {
    id: "wormhole",
    label: "Wormhole",
    note: "Speculative generated image: a black-hole bridge into another dimension.",
    backdrop: "/media/space/wormhole-dimension.png",
    accent: "#a78bfa",
    depthTint: "rgba(167, 139, 250, 0.2)",
    glowIntensity: 1.02,
  },
  {
    id: "parallel-universes",
    label: "Parallel universes",
    note: "Speculative generated image for the multiverse chapter.",
    backdrop: "/media/space/parallel-universes.png",
    accent: "#67e8f9",
    depthTint: "rgba(103, 232, 249, 0.18)",
    glowIntensity: 0.96,
  },
  {
    id: "big-bang-again",
    label: "Big Bang, again",
    note: "Generated end-of-time image: a new universe beginning, so it is never over.",
    backdrop: "/media/space/big-bang-again.png",
    accent: "#f9d36b",
    depthTint: "rgba(249, 211, 107, 0.2)",
    glowIntensity: 1.08,
  },
];

const ORBIT_LAYOUTS: OrbitPoint[][] = [
  [
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
  ],
  [
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
  [
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
  [
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
];

const FINAL_LAYOUT: OrbitPoint[] = [
  { x: 50, y: 56, size: 230, rotate: 0, hero: true },
  { x: 31, y: 43, size: 158, rotate: -8 },
  { x: 70, y: 43, size: 158, rotate: 8 },
  { x: 50, y: 81, size: 128, rotate: -4 },
];

interface FolderGroup {
  title: string;
  folders: string[];
  items: MediaItem[];
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unique(items: MediaItem[]): MediaItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.src)) return false;
    seen.add(item.src);
    return true;
  });
}

function folderItems(folder: string): MediaItem[] {
  return unique(getMediaForFolder(folder));
}

function galleryFolders(): string[] {
  const discovered = getMediaFolders().filter((folder) => {
    if (EXCLUDED_GALLERY_FOLDERS.has(folder)) return false;
    if (folder === LAST_MEDIA_FOLDER) return false;
    return folderItems(folder).length > 0;
  });

  const preferred = PREFERRED_FOLDER_ORDER.filter((folder) => folder !== LAST_MEDIA_FOLDER && discovered.includes(folder));
  const extra = discovered
    .filter((folder) => !preferred.includes(folder))
    .sort((a, b) => a.localeCompare(b));

  return [...preferred, ...extra];
}

function buildFolderGroups(): FolderGroup[] {
  const groups: FolderGroup[] = [];
  let pendingSmall: FolderGroup | null = null;

  for (const folder of galleryFolders()) {
    const items = folderItems(folder);
    if (items.length === 0) continue;

    const group = { title: folder, folders: [folder], items };
    if (items.length >= MIN_FOLDER_ITEMS) {
      groups.push(group);
      continue;
    }

    if (!pendingSmall) {
      pendingSmall = group;
      continue;
    }

    groups.push({
      title: `${pendingSmall.title} + ${group.title}`,
      folders: [...pendingSmall.folders, ...group.folders],
      items: unique([...pendingSmall.items, ...group.items]),
    });
    pendingSmall = null;
  }

  if (pendingSmall) {
    const previous = groups[groups.length - 1];
    if (previous && previous.items.length < MIN_FOLDER_ITEMS * 2) {
      previous.title = `${previous.title} + ${pendingSmall.title}`;
      previous.folders = [...previous.folders, ...pendingSmall.folders];
      previous.items = unique([...previous.items, ...pendingSmall.items]);
    } else {
      groups.push(pendingSmall);
    }
  }

  return groups;
}

function labelForItem(item: MediaItem): string {
  return item.filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
}

function makeNodes(id: StageId, items: MediaItem[], layout: OrbitPoint[]): ArchiveNode[] {
  return items.map((item, index) => {
    const coord = layout[index % layout.length];
    const lap = Math.floor(index / layout.length);
    return {
      id: `${id}-${index}`,
      label: labelForItem(item),
      items: [item],
      x: Math.max(6, Math.min(94, coord.x + lap * 2 * (index % 2 ? -1 : 1))),
      y: Math.max(10, Math.min(91, coord.y + lap * 3 * (index % 3 === 0 ? -1 : 1))),
      size: Math.max(74, coord.size - lap * 6),
      rotate: coord.rotate,
      hero: coord.hero,
    };
  });
}

function phaseForIndex(index: number) {
  return COSMIC_ARC[Math.min(index, COSMIC_ARC.length - 1)];
}

function makeKicker(phase: (typeof COSMIC_ARC)[number]): string {
  return `${phase.label} - ${phase.note}`;
}

function makeStage(group: FolderGroup, index: number): CosmicStageConfig {
  const phase = phaseForIndex(index);
  const layout = ORBIT_LAYOUTS[index % ORBIT_LAYOUTS.length];
  const id = slug(group.title) || `folder-${index + 1}`;

  return {
    id,
    phaseId: phase.id,
    kicker: makeKicker(phase),
    title: group.title,
    backdrop: phase.backdrop,
    backdropPosition: "50% 50%",
    cameraDepth: index * 0.62,
    figureMode: "none",
    accent: phase.accent,
    shortLabel: group.title,
    depthTint: phase.depthTint,
    glowIntensity: phase.glowIntensity,
    layout,
    nodes: makeNodes(id, group.items, layout),
  };
}

function makeIntroStage(): CosmicStageConfig {
  const phase = phaseForIndex(0);
  const items = unique(
    [getMediaByFilename("start with this photo"), getMediaByFilename("topgolf where you beat me")].filter(Boolean) as MediaItem[]
  );
  const layout = ORBIT_LAYOUTS[0];

  return {
    id: "opening",
    phaseId: phase.id,
    kicker: makeKicker(phase),
    title: "Thanks for ruining the surprise :(",
    subtitle: "p.s.~ you're making buldak and we leave church ave in 2 hours lol",
    backdrop: phase.backdrop,
    backdropPosition: "50% 50%",
    cameraDepth: 0,
    figureMode: "none",
    accent: phase.accent,
    shortLabel: "opening",
    depthTint: phase.depthTint,
    glowIntensity: phase.glowIntensity,
    layout,
    nodes: makeNodes("opening", items, layout),
  };
}

function makeLastFolderStage(index: number): CosmicStageConfig | null {
  const items = folderItems(LAST_MEDIA_FOLDER);
  if (items.length === 0) return null;
  return makeStage({ title: LAST_MEDIA_FOLDER, folders: [LAST_MEDIA_FOLDER], items }, index);
}

function makeFinalStage(index: number): CosmicStageConfig | null {
  const templates = getTemplatePhotos();
  const lastPhoto = getMediaByFilename("last photo");
  const items = unique([templates.codyMay, templates.cody, templates.may, lastPhoto].filter(Boolean) as MediaItem[]);
  if (items.length === 0) return null;
  const phase = phaseForIndex(index);

  return {
    id: "cody-may",
    phaseId: phase.id,
    kicker: makeKicker(phase),
    title: "cody/may",
    subtitle: "you're making the pasta rn lol",
    backdrop: phase.backdrop,
    backdropPosition: "50% 50%",
    cameraDepth: index * 0.62,
    figureMode: "codyMay",
    accent: phase.accent,
    shortLabel: "cody/may",
    depthTint: phase.depthTint,
    glowIntensity: phase.glowIntensity,
    layout: FINAL_LAYOUT,
    nodes: makeNodes("cody-may", items, FINAL_LAYOUT),
  };
}

const introStage = makeIntroStage();
const folderStages = buildFolderGroups().map((group, index) => makeStage(group, index + 1));
const lastFolderStage = makeLastFolderStage(folderStages.length + 1);
const finalStage = makeFinalStage(folderStages.length + (lastFolderStage ? 2 : 1));

export const TEMPLATE_PHOTOS = getTemplatePhotos();
export const COSMIC_STAGES: CosmicStageConfig[] = finalStage
  ? [introStage, ...folderStages, ...(lastFolderStage ? [lastFolderStage] : []), finalStage]
  : [introStage, ...folderStages, ...(lastFolderStage ? [lastFolderStage] : [])];

export const PERSONAL_MEDIA_COUNT = COSMIC_STAGES.reduce(
  (count, stage) => count + stage.nodes.reduce((stageCount, node) => stageCount + node.items.length, 0),
  0
);
