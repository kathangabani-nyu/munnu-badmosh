import mediaIndex from "./media-index.json";

export type MediaType = "photo" | "video";

export interface MediaItem {
  id: string;
  type: MediaType;
  src: string;
  caption?: string;
}

export interface MediaIndex {
  byFolder: Record<string, MediaItem[]>;
}

export function getMediaForFolder(folder: string): MediaItem[] {
  const index = mediaIndex as MediaIndex;
  return index.byFolder[folder] ?? [];
}

export function getAllMedia(): MediaItem[] {
  const index = mediaIndex as MediaIndex;
  return Object.values(index.byFolder).flat();
}
