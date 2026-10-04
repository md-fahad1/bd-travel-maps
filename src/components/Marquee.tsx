"use client";

import { DISTRICTS } from "@/data/districts";

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const list = [...items, ...items];
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className={"flex shrink-0 gap-3 pr-3 hover:[animation-play-state:paused] " + (reverse ? "animate-marquee-rev" : "animate-marquee")}>
        {list.map((n, i) => (
          <span
            key={i}
            className="font-display whitespace-nowrap rounded-full border border-sand-line bg-white/80 px-5 py-2.5 text-[16px] font-semibold text-ink-soft"
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Two endlessly scrolling rows with all 64 district names. */
export default function Marquee() {
  const names = DISTRICTS.map((d) => d.bn);
  const half = Math.ceil(names.length / 2);
  return (
    <div className="space-y-3 py-2" aria-hidden>
      <Row items={names.slice(0, half)} />
      <Row items={names.slice(half)} reverse />
    </div>
  );
}