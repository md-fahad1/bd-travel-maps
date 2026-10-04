export interface Theme {
  id: string;
  name: string;
  bg: string; // card background
  ink: string; // main text
  sub: string; // secondary text
  base: string; // unvisited district fill
  line: string; // district borders
  accent: string; // visited district fill
  track: string; // progress track
  dot: string; // label dot
  swatchBg: string;
}

export const THEMES: Theme[] = [
  { id: "classic", name: "ক্লাসিক", bg: "#f6f2ea", ink: "#16211d", sub: "#7a7468", base: "#e3dccd", line: "#f6f2ea", accent: "#12795a", track: "#e3dccd", dot: "#e5384f", swatchBg: "#f6f2ea" },
  { id: "night", name: "নাইট", bg: "#1a1a3b", ink: "#f2f2ff", sub: "#9a9ac8", base: "#2f2f5c", line: "#1a1a3b", accent: "#7d8cff", track: "#2f2f5c", dot: "#ffd166", swatchBg: "#1a1a3b" },
  { id: "sunset", name: "সানসেট", bg: "#fff3ec", ink: "#2a1812", sub: "#9a7466", base: "#f3dfd3", line: "#fff3ec", accent: "#ee5a3a", track: "#f3dfd3", dot: "#2a1812", swatchBg: "#fff3ec" },
  { id: "ocean", name: "ওশান", bg: "#eaf3fd", ink: "#10233a", sub: "#6b86a3", base: "#cfdff3", line: "#eaf3fd", accent: "#1f6feb", track: "#cfdff3", dot: "#ff6b6b", swatchBg: "#eaf3fd" },
  { id: "dark", name: "ডার্ক", bg: "#14181a", ink: "#f1f5f3", sub: "#8b9692", base: "#2b3235", line: "#14181a", accent: "#2fb26f", track: "#2b3235", dot: "#ffd166", swatchBg: "#14181a" },
];
