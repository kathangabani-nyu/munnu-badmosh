export interface StarMemory {
  id: string;
  label: string;
  x: number;
  y: number;
  line: string;
}

export const constellationStars: StarMemory[] = [
  { id: "sewell", label: "sewell", x: 14, y: 58, line: "farm day one: no notes, only goats." },
  { id: "hamilton", label: "hamilton", x: 24, y: 47, line: "animal diplomacy reached new lows." },
  { id: "midtown", label: "midtown", x: 39, y: 34, line: "public behavior remained hypothetical." },
  { id: "fordham", label: "fordham", x: 51, y: 28, line: "campus quiet. our timeline loud." },
  { id: "central-park", label: "central park", x: 62, y: 35, line: "cardio, gossip, repeat." },
  { id: "greenwood", label: "greenwood", x: 56, y: 52, line: "historic site, unserious visitors." },
  { id: "prospect", label: "prospect", x: 73, y: 55, line: "walk loop became therapy loop." },
  { id: "home", label: "church ave", x: 82, y: 45, line: "the stop where everything kept happening." },
  { id: "gr", label: "grand rapids", x: 92, y: 30, line: "new city, same menace." },
];

export const constellationFinalLine =
  "if you're reading this, you survived the first month. i never doubted you. i just wanted somewhere to leave proof of that.";
