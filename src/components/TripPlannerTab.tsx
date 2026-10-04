"use client";

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
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-10">
      <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
        আপনার <span className="text-brand">ট্রিপ প্ল্যানার</span>
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-ink-soft">
        কতদিনের ট্রিপ, কোন জেলা কোন দিন — সাজিয়ে নিন। ঘোরা শেষ হলে টিক দিন, জেলাটি আপনার ম্যাপে যোগ হয়ে যাবে।
      </p>

      <div className="mt-6 flex items-center gap-4 rounded-3xl border border-sand-line bg-white/70 p-5">
        <span className="text-[17px]">ট্রিপ কত দিনের?</span>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => update({ tripDays: Math.max(1, state.tripDays - 1) })}
            className="h-10 w-10 rounded-full bg-sand text-xl hover:bg-sand-line"
            aria-label="কমান"
          >
            −
          </button>
          <span className="font-display w-14 text-center text-xl font-extrabold">{bn(state.tripDays)} দিন</span>
          <button
            type="button"
            onClick={() => update({ tripDays: Math.min(14, state.tripDays + 1) })}
            className="h-10 w-10 rounded-full bg-sand text-xl hover:bg-sand-line"
            aria-label="বাড়ান"
          >
            +
          </button>
        </div>
      </div>

      {state.trip.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-ink-soft/40 p-10 text-center">
          <p className="text-lg text-ink-soft">এখনো কোনো জায়গা যোগ করা হয়নি।</p>
          <button
            type="button"
            onClick={goExplore}
            className="font-display mt-5 rounded-full bg-[#16211d] px-7 py-3.5 text-lg font-semibold text-white hover:bg-black"
          >
            কোথায় ঘুরবেন দেখুন →
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {days.map((day) => {
            const list = state.trip.filter((t) => Math.min(t.day, state.tripDays) === day);
            return (
              <section key={day} className="rounded-3xl border border-sand-line bg-white/70 p-5">
                <h2 className="font-display text-lg font-extrabold">
                  <span className="mr-2 rounded-full bg-brand-tint px-3 py-1 text-sm text-brand">
                    দিন {bn(day)}
                  </span>
                </h2>
                {list.length === 0 ? (
                  <p className="mt-3 text-[15px] text-ink-soft">এই দিনের জন্য কিছু ঠিক করা হয়নি।</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {list.map((t) => {
                      const d = byId.get(t.district)!;
                      const p = place.get(t.district);
                      return (
                        <li key={t.district} className="flex items-start gap-3 rounded-2xl bg-sand/70 p-3.5">
                          <input
                            type="checkbox"
                            checked={t.done}
                            onChange={() =>
                              setTrip((tr) => tr.map((x) => (x.district === t.district ? { ...x, done: !x.done } : x)))
                            }
                            className="mt-1.5 h-5 w-5 accent-[#12795a]"
                            aria-label={`${d.bn} ঘোরা হয়েছে`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className={"font-display text-[17px] font-extrabold " + (t.done ? "line-through opacity-60" : "")}>
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
                          <button
                            type="button"
                            onClick={() => setTrip((tr) => tr.filter((x) => x.district !== t.district))}
                            className="px-1 text-xl text-ink-soft hover:text-flag-red"
                            aria-label="সরান"
                          >
                            ×
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}

          <button
            type="button"
            disabled={doneCount === 0}
            onClick={finishTrip}
            className="font-display w-full rounded-2xl bg-brand-deep px-5 py-4 text-lg font-semibold text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-40"
          >
            টিক দেওয়া {bn(doneCount)}টি জেলা আমার ম্যাপে যোগ করুন
          </button>
        </div>
      )}
    </div>
  );
}
