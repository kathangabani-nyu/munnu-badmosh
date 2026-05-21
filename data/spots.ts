export type SpotLayout = "hero" | "scatter" | "cluster" | "cinematic" | "annotated";

export interface SpotDefinition {
  id: string;
  name: string;
  place: string;
  catalogTag: string;
  mapPosition: { x: number; y: number };
  photoFolder: string;
  layout: SpotLayout;
  note: string;
  region: "nj" | "nyc" | "mi";
}

export const spots: SpotDefinition[] = [
  {
    id: "sewell-farm",
    name: "hidden hills farm",
    place: "sewell, nj",
    catalogTag: "PIN 01",
    mapPosition: { x: 25, y: 61 },
    photoFolder: "sewell-farm",
    layout: "scatter",
    note: "the original goat summit.",
    region: "nj",
  },
  {
    id: "hamilton-farm",
    name: "professor macqueen's",
    place: "hamilton, nj",
    catalogTag: "PIN 02",
    mapPosition: { x: 29, y: 50 },
    photoFolder: "hamilton-farm",
    layout: "cluster",
    note: "multiple animals. zero supervision.",
    region: "nj",
  },
  {
    id: "midtown",
    name: "midtown",
    place: "manhattan",
    catalogTag: "PIN 03",
    mapPosition: { x: 45, y: 40 },
    photoFolder: "midtown",
    layout: "hero",
    note: "civilian behavior was not observed.",
    region: "nyc",
  },
  {
    id: "fordham",
    name: "fordham lincoln center",
    place: "midtown west",
    catalogTag: "PIN 04",
    mapPosition: { x: 44, y: 38 },
    photoFolder: "fordham",
    layout: "annotated",
    note: "campus looked calm. we did not.",
    region: "nyc",
  },
  {
    id: "central-park",
    name: "central park",
    place: "manhattan",
    catalogTag: "PIN 05",
    mapPosition: { x: 46, y: 33 },
    photoFolder: "central-park",
    layout: "cinematic",
    note: "run club but make it unserious.",
    region: "nyc",
  },
  {
    id: "greenwood",
    name: "greenwood cemetery",
    place: "brooklyn",
    catalogTag: "PIN 06",
    mapPosition: { x: 49, y: 57 },
    photoFolder: "greenwood",
    layout: "scatter",
    note: "respectful-ish shenanigans.",
    region: "nyc",
  },
  {
    id: "prospect-park",
    name: "prospect park",
    place: "brooklyn",
    catalogTag: "PIN 07",
    mapPosition: { x: 50, y: 55 },
    photoFolder: "brooklyn",
    layout: "cluster",
    note: "peak walk-and-talk infrastructure.",
    region: "nyc",
  },
  {
    id: "home",
    name: "51 church ave",
    place: "brooklyn 11218",
    catalogTag: "PIN 08",
    mapPosition: { x: 52, y: 60 },
    photoFolder: "home",
    layout: "hero",
    note: "church ave forever loading.",
    region: "nyc",
  },
  {
    id: "grand-rapids",
    name: "grand rapids",
    place: "michigan",
    catalogTag: "PIN 09",
    mapPosition: { x: 10, y: 31 },
    photoFolder: "road-trip",
    layout: "cinematic",
    note: "~613 miles. don't be a stranger or i swear.",
    region: "mi",
  },
];

export function getWalkSpots() {
  return spots;
}
