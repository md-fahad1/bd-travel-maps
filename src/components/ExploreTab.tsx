"use client";

import { useMemo, useState } from "react";
import { ATTRACTIONS } from "@/data/attractions";
import { DISTRICTS } from "@/data/districts";
import { DIVISIONS } from "@/data/divisions";
import { bn } from "@/lib/bn";
import type { AppState } from "@/lib/useAppState";

interface Props {
  state: AppState;
  update: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
}

export default function ExploreTab({ state, update }: Props) {
  const [division, setDivision] = useState<string>("all");
  const [onlyNew, setOnlyNew] = useState(true);
  const visited = useMemo(() => new Set(state.visited), [state.visited]);
  const inTrip = useMemo(() => new Set(state.trip.map((t) => t.district)), [state.trip]);
  const byId = useMemo(() => new Map(DISTRICTS.map((d) => [d.id, d])), []);

  const items = ATTRACTIONS.filter((a) => {
    const d = byId.get(a.district);
    if (!d) return false;
    if (division !== "all" && d.division !== division) return false;
    if (onlyNew && visited.has(a.district)) return false;
    return true;
  });

  const addToTrip = (district: string) =>
    update((s) =>
      s.trip.some((t) => t.district === district)
        ? {}
        : { trip: [...s.trip, { district, day: 1, done: false }] },
    );

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-10">
      <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
        পরের বার <span className="text-brand">কোথায়</span> ঘুরবেন?
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-ink-soft">
        যেসব জেলায় এখনো যাননি, সেগুলোর সেরা জায়গা দেখুন আর পছন্দ হলে ট্রিপ প্ল্যানারে যোগ করুন।
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {[{ id: "all", bn: "সব বিভাগ" }, ...DIVISIONS].map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDivision(d.id)}
            className={
              "rounded-full px-4 py-2 text-[15px] transition " +
              (division === d.id ? "bg-brand-deep text-white" : "bg-sand hover:bg-sand-line")
            }
          >
            {d.bn.replace(" বিভাগ", "")}
          </button>
        ))}
      </div>

      <label className="mt-5 flex cursor-pointer items-center gap-3 text-[16px]">
        <input
          type="checkbox"
          checked={onlyNew}
          onChange={(e) => setOnlyNew(e.target.checked)}
          className="h-5 w-5 accent-[#12795a]"
        />
        শুধু যেসব জেলায় যাইনি
      </label>

      <p className="mt-4 text-[15px] text-ink-soft">{bn(items.length)}টি জায়গা</p>

      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {items.map((a) => {
          const d = byId.get(a.district)!;
          const added = inTrip.has(a.district);
          return (
            <article key={a.district} className="flex flex-col rounded-3xl border border-sand-line bg-white/70 p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-brand-tint px-3 py-1 text-sm font-semibold text-brand">{d.bn}</span>
                <span className="text-sm text-ink-soft">{a.type}</span>
              </div>
              <h3 className="font-display mt-3 text-xl font-extrabold leading-snug">{a.place}</h3>
              <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-ink-soft">{a.note}</p>
              <button
                type="button"
                disabled={added}
                onClick={() => addToTrip(a.district)}
                className={
                  "mt-4 rounded-2xl px-4 py-2.5 text-[15px] font-semibold transition " +
                  (added ? "bg-sand text-ink-soft" : "bg-[#16211d] text-white hover:bg-black")
                }
              >
                {added ? "ট্রিপে যোগ করা হয়েছে ✓" : "ট্রিপে যোগ করুন"}
              </button>
            </article>
          );
        })}
      </div>

      {items.length === 0 && (
        <p className="mt-10 rounded-3xl border border-sand-line bg-white/60 p-8 text-center text-ink-soft">
          এই বিভাগের সব জেলায় আপনি গিয়েছেন — অসাধারণ! 🎉
        </p>
      )}
    </div>
  );
}
