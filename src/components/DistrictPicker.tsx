"use client";

import { useMemo, useState } from "react";
import { DISTRICTS } from "@/data/districts";
import { DIVISIONS } from "@/data/divisions";
import { bn } from "@/lib/bn";

interface Props {
  visited: string[];
  onChange: (next: string[]) => void;
}

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, "");
}

export default function DistrictPicker({ visited, onChange }: Props) {
  const [q, setQ] = useState("");
  const set = useMemo(() => new Set(visited), [visited]);

  const groups = useMemo(() => {
    const query = normalize(q);
    return DIVISIONS.map((div) => {
      const all = DISTRICTS.filter((d) => d.division === div.id).sort((a, b) =>
        a.bn.localeCompare(b.bn, "bn"),
      );
      const shown = query
        ? all.filter((d) => normalize(d.bn).includes(query) || normalize(d.en).includes(query))
        : all;
      return { div, all, shown };
    }).filter((g) => g.shown.length > 0);
  }, [q]);

  const toggle = (id: string) =>
    onChange(set.has(id) ? visited.filter((x) => x !== id) : [...visited, id]);

  const toggleMany = (ids: string[]) => {
    const allOn = ids.every((id) => set.has(id));
    if (allOn) onChange(visited.filter((id) => !ids.includes(id)));
    else onChange(Array.from(new Set([...visited, ...ids])));
  };

  return (
    <section
      id="picker"
      className="scroll-mt-24 rounded-[28px] border border-sand-line bg-white/60 p-5 sm:p-7"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-extrabold">যেসব জেলায় গিয়েছি</h2>
        <span className="font-display rounded-full bg-brand-tint px-3.5 py-1.5 text-sm font-semibold text-brand">
          {bn(visited.length)} / {bn(DISTRICTS.length)}
        </span>
      </div>

      <label className="mt-5 flex items-center gap-3 rounded-2xl border border-sand-line bg-sand px-4 py-3.5 focus-within:border-brand">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6f6a5f" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="জেলা খুঁজুন..."
          className="w-full bg-transparent text-base outline-none placeholder:text-ink-soft/60"
        />
      </label>

      <div className="mt-4 flex gap-4 text-[15px]">
        <button
          type="button"
          onClick={() => onChange(DISTRICTS.map((d) => d.id))}
          className="underline decoration-ink/40 underline-offset-4 hover:decoration-ink"
        >
          সব বাছাই করুন
        </button>
        <button
          type="button"
          onClick={() => onChange([])}
          className="underline decoration-ink/40 underline-offset-4 hover:decoration-ink"
        >
          সব মুছুন
        </button>
      </div>

      <div className="mt-4">
        {groups.length === 0 && (
          <p className="border-t border-sand-line py-8 text-center text-ink-soft">
            কোনো জেলা পাওয়া যায়নি।
          </p>
        )}
        {groups.map(({ div, all, shown }) => {
          const ids = all.map((d) => d.id);
          const n = ids.filter((id) => set.has(id)).length;
          const full = n === ids.length;
          return (
            <div key={div.id} className="border-t border-sand-line py-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-[17px] font-extrabold">
                  {div.bn}{" "}
                  <span className="text-[15px] font-semibold text-ink-soft">
                    {bn(n)}/{bn(ids.length)}
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={() => toggleMany(ids)}
                  className="text-[15px] underline decoration-ink/40 underline-offset-4 hover:decoration-ink"
                >
                  {full ? "সব মুছুন" : "সব বাছাই"}
                </button>
              </div>
              <div className="flex flex-wrap gap-x-2.5 gap-y-2.5">
                {shown.map((d) => {
                  const on = set.has(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggle(d.id)}
                      aria-pressed={on}
                      className={
                        "rounded-full px-5 py-2.5 text-[17px] transition " +
                        (on
                          ? "bg-brand-deep text-white shadow-sm"
                          : "bg-sand text-ink hover:bg-sand-line")
                      }
                    >
                      {on && <span className="mr-2 text-[10px] align-middle">●</span>}
                      {d.bn}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
