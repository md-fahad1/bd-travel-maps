"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ATTRACTIONS } from "@/data/attractions";
import { DISTRICTS } from "@/data/districts";
import { DIVISIONS } from "@/data/divisions";
import { bn } from "@/lib/bn";
import type { AppState } from "@/lib/useAppState";

interface Props {
  state: AppState;
  update: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
  goTrip: () => void;
}

const ICONS: Record<string, string> = {
  ঐতিহাসিক: "🏰", চর: "🏝️", জাদুঘর: "🏛️", দ্বীপ: "🌴", নদী: "🛶", পাহাড়: "⛰️",
  প্রকৃতি: "🌿", প্রত্নস্থল: "🗿", বন: "🌳", সংস্কৃতি: "🎭", সৈকত: "🏖️",
  স্থাপনা: "🕌", হাওর: "🌾", হ্রদ: "💧",
};

const GRADS = [
  "from-[#12795a] to-[#2fb26f]",
  "from-[#1f6feb] to-[#7d8cff]",
  "from-[#ee5a3a] to-[#ffb36b]",
  "from-[#e5384f] to-[#ff8aa0]",
  "from-[#7d4fd6] to-[#b58cff]",
  "from-[#0f9fb0] to-[#5be3d6]",
];

export default function ExploreTab({ state, update, goTrip }: Props) {
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
    <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-10">
      <div className="bg-dots pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 [mask-image:linear-gradient(#000,transparent)]" />
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl font-extrabold leading-tight sm:text-6xl"
      >
        পরের বার <span className="text-gradient">কোথায়</span> ঘুরবেন?
      </motion.h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">
        যেসব জেলায় এখনো যাননি, সেগুলোর সেরা জায়গা দেখুন আর পছন্দ হলে ট্রিপ প্ল্যানারে যোগ করুন।
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {[{ id: "all", bn: "সব বিভাগ" }, ...DIVISIONS].map((d) => {
          const active = division === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setDivision(d.id)}
              className={"relative rounded-full px-4 py-2 text-[15px] font-semibold transition-colors " + (active ? "text-white" : "bg-sand hover:bg-sand-line")}
            >
              {active && (
                <motion.span
                  layoutId="div-pill"
                  className="absolute inset-0 rounded-full bg-brand-deep"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">{d.bn.replace(" বিভাগ", "")}</span>
            </button>
          );
        })}
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

      <motion.div layout className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((a, i) => {
            const d = byId.get(a.district)!;
            const added = inTrip.has(a.district);
            const grad = GRADS[i % GRADS.length];
            return (
              <motion.article
                key={a.district}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 260, damping: 26, delay: Math.min(i, 8) * 0.04 }}
                whileHover={{ y: -8 }}
                className="group flex flex-col overflow-hidden rounded-3xl border border-sand-line bg-white shadow-sm hover:shadow-xl"
              >
                <div className={`relative flex h-28 items-end bg-gradient-to-br ${grad} p-4`}>
                  <motion.span
                    className="absolute right-4 top-3 text-5xl drop-shadow"
                    whileHover={{ rotate: 12, scale: 1.2 }}
                  >
                    {ICONS[a.type] ?? "📍"}
                  </motion.span>
                  <span className="font-display rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-ink">{d.bn}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-sm font-semibold text-ink-soft">{a.type}</span>
                  <h3 className="font-display mt-1 text-xl font-extrabold leading-snug">{a.place}</h3>
                  <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-ink-soft">{a.note}</p>
                  <motion.button
                    type="button"
                    disabled={added}
                    onClick={() => addToTrip(a.district)}
                    whileTap={{ scale: 0.95 }}
                    className={
                      "mt-4 rounded-2xl px-4 py-2.5 text-[15px] font-semibold transition-colors " +
                      (added ? "bg-brand-tint text-brand" : "bg-ink text-white hover:bg-black")
                    }
                  >
                    {added ? "ট্রিপে যোগ করা হয়েছে ✓" : "＋ ট্রিপে যোগ করুন"}
                  </motion.button>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {items.length === 0 && (
        <p className="mt-10 rounded-3xl border border-sand-line bg-white/60 p-8 text-center text-ink-soft">
          এই বিভাগের সব জেলায় আপনি গিয়েছেন — অসাধারণ! 🎉
        </p>
      )}

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center">
        <AnimatePresence>
          {state.trip.length > 0 && (
            <motion.button
              type="button"
              onClick={goTrip}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-display pointer-events-auto rounded-full bg-ink px-6 py-3.5 text-[16px] font-semibold text-white shadow-2xl"
            >
              🎒 ট্রিপ দেখুন ({bn(state.trip.length)})
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}