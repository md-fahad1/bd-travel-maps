export interface Rank {
  title: string;
  emoji: string;
  next: number | null; // visited count needed for next rank
  nextTitle: string | null;
}

const LEVELS: { min: number; title: string; emoji: string }[] = [
  { min: 0, title: "যাত্রার অপেক্ষায়", emoji: "🧭" },
  { min: 1, title: "নতুন পথিক", emoji: "🎒" },
  { min: 10, title: "ঘুরকুট্টি", emoji: "🚌" },
  { min: 25, title: "দেশ-ভ্রমণকারী", emoji: "🚆" },
  { min: 45, title: "বাংলার যাযাবর", emoji: "⛰️" },
  { min: 64, title: "বাংলাদেশ বিজয়ী", emoji: "🏆" },
];

export function rankFor(count: number): Rank {
  let i = 0;
  LEVELS.forEach((l, idx) => {
    if (count >= l.min) i = idx;
  });
  const next = LEVELS[i + 1];
  return {
    title: LEVELS[i].title,
    emoji: LEVELS[i].emoji,
    next: next ? next.min : null,
    nextTitle: next ? next.title : null,
  };
}