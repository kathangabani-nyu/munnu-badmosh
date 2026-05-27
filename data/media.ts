import mediaIndex from "./media-index.json";

export type MediaType = "photo" | "video";

export interface MediaItem {
  id: string;
  folder: string;
  filename: string;
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

export function getMediaFolders(): string[] {
  const index = mediaIndex as MediaIndex;
  return Object.keys(index.byFolder);
}

export function getMediaByFilename(substr: string): MediaItem | undefined {
  const needle = substr.toLowerCase();
  return getAllMedia().find((item) => item.filename.toLowerCase().includes(needle));
}

export function getTemplatePhotos() {
  const templates = getMediaForFolder("animation template images");

  return {
    cody: templates.find((item) => item.filename.toLowerCase() === "cody.jpeg"),
    may: templates.find((item) => item.filename.toLowerCase() === "may.jpeg"),
    codyMay: templates.find((item) => item.filename.toLowerCase() === "cody+may.jpeg"),
  };
}

export function isTemplateMedia(item: MediaItem): boolean {
  return item.folder === "animation template images";
}

export function getGalleryMedia(): MediaItem[] {
  return getAllMedia().filter((item) => !isTemplateMedia(item));
}
