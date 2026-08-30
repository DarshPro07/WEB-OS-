import type { WallpaperId } from "./types";

export type WallpaperKind = "video" | "gradient";

export interface WallpaperPreset {
  id: WallpaperId;
  name: string;
  kind: WallpaperKind;
  src?: string;
  poster?: string;
  swatch?: string;
}

export const wallpaperPresets: WallpaperPreset[] = [
  {
    id: "dark-thorn-knight",
    name: "Thorn Knight",
    kind: "video",
    src: "/wallpapers/dark-thorn-knight.mp4",
    poster: "/wallpapers/dark-thorn-knight-poster.jpg",
  },
  {
    id: "aurora",
    name: "Aurora",
    kind: "gradient",
    swatch: "linear-gradient(160deg, #16222b, #1f4f5c 55%, #21402f)",
  },
  {
    id: "ion",
    name: "Ion",
    kind: "gradient",
    swatch: "linear-gradient(160deg, #17172a, #2e2050 55%, #4c2450)",
  },
  {
    id: "void",
    name: "Void",
    kind: "gradient",
    swatch: "linear-gradient(160deg, #0c0c0c, #1c1c1c)",
  },
];

export function findWallpaperPreset(id: WallpaperId) {
  return wallpaperPresets.find((preset) => preset.id === id);
}
