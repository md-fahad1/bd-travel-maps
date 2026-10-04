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
const title = name.trim() ? `${name.trim()}-এর বাংলাদেশ ভ্রমণ` : "আমার বাংলাদেশ ভ্রমণ";

   return (
    <div
      ref={ref}
      className="flex flex-col rounded-[28px] p-4 sm:p-6"
      style={{
        background: `radial-gradient(110% 70% at 100% 0%, ${theme.accent}26, transparent 60%), ${theme.bg}`,
        color: theme.ink,
        aspectRatio: "4 / 5",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full object-cover sm:h-12 sm:w-12"
              style={{ border: `2px solid ${theme.bg}`, boxShadow: `0 0 0 2px ${theme.accent}` }}
            />
          )}
          <div className="min-w-0 leading-tight">
            <p className="text-[9px] font-semibold tracking-widest sm:text-[11px]" style={{ color: theme.sub }}>
              বাংলাদেশ ভ্রমণ ম্যাপ
            </p>
            <h3 className="font-display truncate text-base font-extrabold sm:text-xl">{title}</h3>
          </div>
        </div>
        <div
          className="shrink-0 rounded-xl px-2.5 py-1.5 leading-none sm:px-3 sm:py-2"
          style={{ background: theme.accent, color: theme.bg }}
        >
          <span className="font-display text-xl font-extrabold sm:text-3xl">{bn(count)}</span>
          <span className="font-display text-[9px] font-semibold opacity-80 sm:text-xs">/{bn(total)}</span>
        </div>
      </div>

      <div className="relative mt-3 min-h-0 flex-1 rounded-2xl" style={{ background: `${theme.base}40` }}>
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="absolute inset-0 block h-full w-full p-1"
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
                  className="district-path"
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
      </div>

      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: theme.track }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${percent}%`, background: theme.accent, transition: "width .3s" }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] sm:text-xs" style={{ color: theme.sub }}>
          <span className="font-semibold" style={{ color: theme.ink }}>
            {bn(percent)}% বাংলাদেশ ঘোরা হয়েছে
          </span>
          <span>
            {bn(count)}টি জেলা · {bn(divisionsVisited)}/{bn(DIVISIONS.length)} বিভাগ
          </span>
        </div>

        <a
          href="https://www.facebook.com/share/1F9E3iqqQo/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-end gap-1.5 border-t pt-2 transition hover:opacity-75"
          style={{ borderColor: `${theme.sub}33` }}
        >
          <p className="text-[8px] leading-none sm:text-[10px]" style={{ color: theme.sub }}>
            Developed by{" "}
            <span className="font-semibold" style={{ color: theme.ink }}>
              Md Fahad Khan
            </span>{" "}
            · Software Engineer
          </p>
          {devPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={devPhoto}
              alt="Md Fahad Khan"
              className="h-5 w-5 rounded-full object-cover sm:h-6 sm:w-6"
              style={{ boxShadow: `0 0 0 1.5px ${theme.accent}` }}
            />
          ) : (
            <span
              className="font-display flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-extrabold sm:h-6 sm:w-6 sm:text-[10px]"
              style={{ background: theme.accent, color: theme.bg }}
            >
              MF
            </span>
          )}
        </a>
      </div>
    </div>
  );
});

export default MapCard;
