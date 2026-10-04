"use client";

import { forwardRef } from "react";
import { DISTRICTS, MAP_HEIGHT, MAP_WIDTH } from "@/data/districts";
import { DIVISIONS } from "@/data/divisions";
import type { Theme } from "@/data/themes";
import { bn } from "@/lib/bn";
import { useDataUrl } from "@/lib/useDataUrl";
interface Props {
  visited: string[];
  theme: Theme;
  name: string;
  photo: string | null;
  showLabels: boolean;
  onToggle?: (id: string) => void;
}

/** The shareable map card. This exact element is what gets exported to PNG/JPG/PDF. */
const MapCard = forwardRef<HTMLDivElement, Props>(function MapCard(
  { visited, theme, name, photo, showLabels, onToggle },
  ref,
) {
  const devPhoto = useDataUrl("/developer.jpeg");
  const set = new Set(visited);
  const count = visited.length;
  const total = DISTRICTS.length;
  const percent = Math.round((count / total) * 100);
  const divisionsVisited = DIVISIONS.filter((d) =>
    DISTRICTS.some((x) => x.division === d.id && set.has(x.id)),
  ).length;
  const title = name.trim() ? `${name.trim()}-এর বাংলাদেশ` : "আমার বাংলাদেশ";

  return (
    <div
      ref={ref}
      className="flex flex-col rounded-[28px] p-6 sm:p-9"
      style={{ background: theme.bg, color: theme.ink, aspectRatio: "4 / 5" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt=""
              className="h-16 w-16 shrink-0 rounded-2xl object-cover sm:h-20 sm:w-20"
              style={{ border: `3px solid ${theme.bg}`, boxShadow: `0 0 0 3px ${theme.accent}` }}
            />
          )}
          <div className="min-w-0">
            <p className="text-[11px] tracking-wide sm:text-sm" style={{ color: theme.sub }}>
              বাংলাদেশ ভ্রমণ ম্যাপ
            </p>
            <h3 className="font-display truncate text-3xl font-extrabold leading-tight sm:text-5xl">{title}</h3>
          </div>
        </div>
        <div className="shrink-0 text-right leading-none">
          <span className="font-display text-6xl font-extrabold sm:text-8xl" style={{ color: theme.accent }}>
            {bn(count)}
          </span>
          <span className="font-display text-base font-semibold sm:text-xl" style={{ color: theme.sub }}>
            /{bn(total)}
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="mx-auto my-4 block min-h-0 w-[64%] flex-1"
        role="img"
        aria-label="বাংলাদেশের জেলা ম্যাপ"
      >
        <g>
          {DISTRICTS.map((d) => {
            const on = set.has(d.id);
            return (
              <path
                key={d.id}
                d={d.d}
                fill={on ? theme.accent : theme.base}
                stroke={theme.line}
                strokeWidth={on ? 1.2 : 1}
                strokeLinejoin="round"
                onClick={onToggle ? () => onToggle(d.id) : undefined}
                style={{ cursor: onToggle ? "pointer" : "default", transition: "fill .15s" }}
              >
                <title>{d.bn}</title>
              </path>
            );
          })}
        </g>
        {showLabels && (
          <g style={{ pointerEvents: "none" }}>
            {DISTRICTS.filter((d) => set.has(d.id)).map((d) => (
              <g key={d.id}>
                <circle cx={d.cx} cy={d.cy} r={3.6} fill={theme.dot} stroke="#fff" strokeWidth={1.4} />
                <text
                  x={d.cx}
                  y={d.cy - 8}
                  textAnchor="middle"
                  fontSize={14}
                  fontWeight={700}
                  fill={theme.ink}
                  stroke={theme.bg}
                  strokeWidth={4.2}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {d.bn}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>

      <div className="mt-4">
        <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: theme.track }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${percent}%`, background: theme.accent, transition: "width .3s" }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] sm:text-sm" style={{ color: theme.sub }}>
          <span className="font-semibold" style={{ color: theme.ink }}>
            {bn(percent)}% বাংলাদেশ ঘোরা হয়েছে
          </span>
          <span>
            {bn(count)}টি জেলা · {bn(DIVISIONS.length)}টির মধ্যে {bn(divisionsVisited)}টি বিভাগ
          </span>
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          <div className="text-right leading-tight" style={{ color: theme.sub }}>
            <p className="text-[10px] sm:text-xs">Developed by</p>
            <p className="font-display text-xs font-semibold sm:text-base" style={{ color: theme.ink }}>
              Md Fahad Khan
            </p>
            <p className="text-[10px] sm:text-xs">Software Engineer</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {devPhoto ? (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={devPhoto}
    alt="Md Fahad Khan"
    className="h-10 w-10 rounded-full object-cover sm:h-14 sm:w-14"
    style={{ boxShadow: `0 0 0 2px ${theme.accent}` }}
  />
) : (
  <span
    className="font-display flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold sm:h-14 sm:w-14 sm:text-lg"
    style={{ background: theme.accent, color: theme.bg }}
  >
    MF
  </span>
)}
        </div>
      </div>
    </div>
  );
});

export default MapCard;