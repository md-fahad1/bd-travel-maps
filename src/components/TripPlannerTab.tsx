"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { ATTRACTIONS } from "@/data/attractions";
import { DISTRICTS } from "@/data/districts";
import { bn } from "@/lib/bn";
import type { AppState } from "@/lib/useAppState";

interface Props {
  state: AppState;
  update: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
  goExplore: () => void;
}

export default function TripPlannerTab({ state, update, goExplore }: Props) {
  const byId = useMemo(() => new Map(DISTRICTS.map((d) => [d.id, d])), []);
  const place = useMemo(() => new Map(ATTRACTIONS.map((a) => [a.district, a])), []);
  const days = Array.from({ length: state.tripDays }, (_, i) => i + 1);

  const setTrip = (fn: (t: AppState["trip"]) => AppState["trip"]) =>
    update((s) => ({ trip: fn(s.trip) }));

  const finishTrip = () =>
    update((s) => ({
      visited: Array.from(new Set([...s.visited, ...s.trip.filter((t) => t.done).map((t) => t.district)])),
      trip: s.trip.filter((t) => !t.done),
    }));

  const doneCount = state.trip.filter((t) => t.done).length;

  return (
    <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-10">
      <div className="bg-dots pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 [mask-image:linear-gradient(#000,transparent)]" />
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl font-extrabold leading-tight sm:text-6xl"
      >
        আপনার <span className="text-gradient">ট্রিপ প্ল্যানার</span>
      </motion.h1>
      <p className="mt-3 text-lg leading-relaxed text-ink-soft">
        কতদিনের ট্রিপ, কোন জেলা কোন দিন — সাজিয়ে নিন। ঘোরা শেষ হলে টিক দিন, জেলাটি আপনার ম্যাপে যোগ হয়ে যাবে।
      </p>

      <div className="glass mt-6 flex items-center gap-4 rounded-3xl p-5 shadow-sm">
        <span className="text-[17px]">ট্রিপ কত দিনের?</span>
        <div className="ml-auto flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.85 }}
            type="button"
            onClick={() => update({ tripDays: Math.max(1, state.tripDays - 1) })}
            className="h-10 w-10 rounded-full bg-sand text-xl hover:bg-sand-line"
            aria-label="কমান"
          >
            −
          </motion.button>
          <span className="font-display relative h-8 w-16 overflow-hidden text-center text-xl font-extrabold">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={state.tripDays}
                initial={{ y: 22, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -22, opacity: 0 }}
                className="absolute inset-0"
              >
                {bn(state.tripDays)} দিন
              </motion.span>
            </AnimatePresence>
          </span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            type="button"
            onClick={() => update({ tripDays: Math.min(14, state.tripDays + 1) })}
            className="h-10 w-10 rounded-full bg-sand text-xl hover:bg-sand-line"
            aria-label="বাড়ান"
          >
            +
          </motion.button>
        </div>
      </div>

      {state.trip.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 rounded-3xl border border-dashed border-ink-soft/40 p-10 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, -6, 6, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-6xl"
          >
            🎒
          </motion.div>
          <p className="mt-3 text-lg text-ink-soft">এখনো কোনো জায়গা যোগ করা হয়নি।</p>
          <motion.button
            type="button"
            onClick={goExplore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-display mt-5 rounded-full bg-ink px-7 py-3.5 text-lg font-semibold text-white"
          >
            কোথায় ঘুরবেন দেখুন →
          </motion.button>
        </motion.div>
      ) : (
        <div className="relative mt-8 space-y-5 border-l-2 border-dashed border-brand/30 pl-5 sm:pl-7">
          {days.map((day, di) => {
            const list = state.trip.filter((t) => Math.min(t.day, state.tripDays) === day);
            return (
              <motion.section
                key={day}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: di * 0.05 }}
                className="relative rounded-3xl border border-sand-line bg-white/80 p-5 shadow-sm"
              >
                <span className="absolute -left-[34px] top-6 h-4 w-4 rounded-full border-[3px] border-paper bg-brand sm:-left-[42px]" />
                <h2 className="font-display text-lg font-extrabold">
                  <span className="mr-2 rounded-full bg-brand-tint px-3 py-1 text-sm text-brand">দিন {bn(day)}</span>
                </h2>
                {list.length === 0 ? (
                  <p className="mt-3 text-[15px] text-ink-soft">এই দিনের জন্য কিছু ঠিক করা হয়নি।</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    <AnimatePresence initial={false}>
                      {list.map((t) => {
                        const d = byId.get(t.district)!;
                        const p = place.get(t.district);
                        return (
                          <motion.li
                            key={t.district}
                            layout
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: "auto", scale: 1 }}
                            exit={{ opacity: 0, height: 0, x: 40 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="flex items-start gap-3 overflow-hidden rounded-2xl bg-sand/70 p-3.5"
                          >
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={t.done}
                              aria-label={`${d.bn} ঘোরা হয়েছে`}
                              onClick={() =>
                                setTrip((tr) => tr.map((x) => (x.district === t.district ? { ...x, done: !x.done } : x)))
                              }
                              className={
                                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-brand transition-colors " +
                                (t.done ? "bg-brand" : "bg-white")
                              }
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                                <motion.path
                                  d="m5 12 5 5 9-10"
                                  initial={false}
                                  animate={{ pathLength: t.done ? 1 : 0, opacity: t.done ? 1 : 0 }}
                                  transition={{ duration: 0.25 }}
                                />
                              </svg>
                            </button>
                            <div className="min-w-0 flex-1">
                              <p className={"font-display text-[17px] font-extrabold transition " + (t.done ? "line-through opacity-50" : "")}>
                                {d.bn}
                              </p>
                              {p && <p className="text-[15px] text-ink-soft">{p.place}</p>}
                            </div>
                            <select
                              value={Math.min(t.day, state.tripDays)}
                              onChange={(e) =>
                                setTrip((tr) =>
                                  tr.map((x) => (x.district === t.district ? { ...x, day: Number(e.target.value) } : x)),
                                )
                              }
                              className="rounded-xl border border-sand-line bg-white px-2 py-1.5 text-sm"
                              aria-label="দিন বদলান"
                            >
                              {days.map((n) => (
                                <option key={n} value={n}>
                                  দিন {bn(n)}
                                </option>
                              ))}
                            </select>
                            <motion.button
                              type="button"
                              whileHover={{ rotate: 90, scale: 1.2 }}
                              onClick={() => setTrip((tr) => tr.filter((x) => x.district !== t.district))}
                              className="px-1 text-xl text-ink-soft hover:text-flag-red"
                              aria-label="সরান"
                            >
                              ×
                            </motion.button>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                )}
              </motion.section>
            );
          })}

          <motion.button
            type="button"
            disabled={doneCount === 0}
            onClick={finishTrip}
            whileHover={doneCount ? { scale: 1.02 } : undefined}
            whileTap={doneCount ? { scale: 0.97 } : undefined}
            className="font-display w-full rounded-2xl bg-gradient-to-r from-brand-deep to-[#2fb26f] px-5 py-4 text-lg font-semibold text-white shadow-lg shadow-brand/25 transition-opacity disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            টিক দেওয়া {bn(doneCount)}টি জেলা আমার ম্যাপে যোগ করুন
          </motion.button>
        </div>
      )}
    </div>
  );
}