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

// Legacy id map kept for Doors photo snippets.
export const mediaById: Record<string, { src: string }> = {
  "0-new": { src: "/media/WhatsApp Image 2026-02-13 at 8.00.36 PM.jpeg" },
  "1": { src: "/media/WhatsApp Image 2025-12-21 at 11.37.26 PM.jpeg" },
  "2": { src: "/media/WhatsApp Image 2025-12-24 at 4.11.30 PM.jpeg" },
  "3": { src: "/media/WhatsApp Image 2025-12-21 at 11.39.36 PM.jpeg" },
  "4": { src: "/media/WhatsApp Image 2025-12-21 at 11.42.41 PM.jpeg" },
  "5-new": { src: "/media/WhatsApp Image 2026-02-13 at 8.00.22 PM.jpeg" },
  "5": { src: "/media/WhatsApp Image 2025-12-21 at 11.39.58 PM.jpeg" },
  "6": { src: "/media/WhatsApp Image 2025-12-21 at 11.40.37 PM.jpeg" },
  "7": { src: "/media/WhatsApp Image 2025-12-21 at 11.42.09 PM.jpeg" },
  "8": { src: "/media/WhatsApp Image 2025-12-21 at 11.42.24 PM.jpeg" },
  "9": { src: "/media/WhatsApp Video 2025-12-21 at 11.38.32 PM.mp4" },
  "10": { src: "/media/WhatsApp Image 2025-12-21 at 11.41.23 PM.jpeg" },
  "10-new": { src: "/media/WhatsApp Video 2026-02-13 at 8.05.19 PM.mp4" },
  "11": { src: "/media/WhatsApp Image 2025-12-21 at 11.49.21 PM.jpeg" },
  "12": { src: "/media/WhatsApp Image 2025-12-23 at 2.30.25 AM.jpeg" },
  "12-new": { src: "/media/WhatsApp Image 2026-02-14 at 5.02.40 PM.jpeg" },
  "13": { src: "/media/WhatsApp Image 2025-12-23 at 2.30.48 AM.jpeg" },
  "14": { src: "/media/WhatsApp Image 2025-12-23 at 6.14.20 PM.jpeg" },
  "15": { src: "/media/WhatsApp Image 2025-12-23 at 6.43.50 PM.jpeg" },
  "16": { src: "/media/WhatsApp Video 2025-12-23 at 6.06.00 PM.mp4" },
  "17": { src: "/media/WhatsApp Image 2025-12-21 at 11.43.52 PM.jpeg" },
  "18": { src: "/media/WhatsApp Image 2025-12-21 at 11.44.57 PM.jpeg" },
  "19": { src: "/media/WhatsApp Image 2025-12-23 at 6.43.11 PM.jpeg" },
};
