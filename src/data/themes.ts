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
  { id: "classic", name: "ক্লাসিক", bg: "#f3faf5", ink: "#0d1f19", sub: "#5f7a6e", base: "#d3e8dc", line: "#f3faf5", accent: "#0a9d6b", track: "#d3e8dc", dot: "#f43f5e", swatchBg: "#f3faf5" },
  { id: "night", name: "নাইট", bg: "#0f1030", ink: "#f4f4ff", sub: "#a5a8e0", base: "#262a63", line: "#0f1030", accent: "#8b9bff", track: "#262a63", dot: "#ffd166", swatchBg: "#0f1030" },
  { id: "sunset", name: "সানসেট", bg: "#fff4ec", ink: "#2b1710", sub: "#a2705c", base: "#fbd9c4", line: "#fff4ec", accent: "#f2542d", track: "#fbd9c4", dot: "#2b1710", swatchBg: "#fff4ec" },
  { id: "ocean", name: "ওশান", bg: "#eaf6ff", ink: "#0b2239", sub: "#5f86a8", base: "#c4e0f7", line: "#eaf6ff", accent: "#0b78e3", track: "#c4e0f7", dot: "#ff5470", swatchBg: "#eaf6ff" },
  { id: "dark", name: "ডার্ক", bg: "#0e1513", ink: "#eefaf4", sub: "#85a095", base: "#22302b", line: "#0e1513", accent: "#34d399", track: "#22302b", dot: "#fbbf24", swatchBg: "#0e1513" },
];