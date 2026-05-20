import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const mediaRoot = path.join(root, "public", "media");
const outPath = path.join(root, "data", "media-index.json");

const targetFolders = [
  "sewell-farm",
  "hamilton-farm",
  "midtown",
  "fordham",
  "central-park",
  "greenwood",
  "prospect-park",
  "home",
  "road-trip",
];

const imageExt = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const videoExt = new Set([".mp4", ".mov", ".webm", ".m4v"]);

const byFolder = {};

for (const folder of targetFolders) {
  const folderPath = path.join(mediaRoot, folder);
  if (!fs.existsSync(folderPath)) {
    byFolder[folder] = [];
    continue;
  }

  const files = fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith("."))
    .sort((a, b) => a.localeCompare(b));

  byFolder[folder] = files
    .map((name, index) => {
      const ext = path.extname(name).toLowerCase();
      const type = imageExt.has(ext) ? "photo" : videoExt.has(ext) ? "video" : null;
      if (!type) return null;
      return {
        id: `${folder}-${index + 1}`,
        type,
        src: `/media/${folder}/${name}`,
      };
    })
    .filter(Boolean);
}

const payload = JSON.stringify({ byFolder }, null, 2);
fs.writeFileSync(outPath, `${payload}\n`, "utf8");
console.log(`media index updated: ${outPath}`);
