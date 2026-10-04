"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import Reveal from "./Reveal";
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

  const randomPick = () => {
    const rest = DISTRICTS.filter((d) => !set.has(d.id));
    if (!rest.length) return;
    onChange([...visited, rest[Math.floor(Math.random() * rest.length)].id]);
  };

  return (
    <section id="picker" className="scroll-mt-24 rounded-[28px] border border-sand-line bg-white/70 p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-extrabold sm:text-2xl">যেসব জেলায় গিয়েছি</h2>
        <motion.span
          key={visited.length}
          initial={{ scale: 1.25 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="font-display rounded-full bg-brand-tint px-3.5 py-1.5 text-sm font-semibold text-brand"
        >
          {bn(visited.length)} / {bn(DISTRICTS.length)}
        </motion.span>
      </div>

      <label className="mt-5 flex items-center gap-3 rounded-2xl border border-sand-line bg-sand px-4 py-3.5 transition focus-within:border-brand focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(10,157,107,0.15)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a6f66" strokeWidth="2" strokeLinecap="round">
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

      <div className="mt-4 flex flex-wrap gap-2 text-[15px]">
        {[
          { l: "সব বাছাই করুন", f: () => onChange(DISTRICTS.map((d) => d.id)) },
          { l: "সব মুছুন", f: () => onChange([]) },
          { l: "🎲 এলোমেলো একটা", f: randomPick },
        ].map((b) => (
          <motion.button
            key={b.l}
            type="button"
            onClick={b.f}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.94 }}
            className="rounded-xl border border-sand-line bg-white px-4 py-2 font-semibold transition hover:border-brand hover:text-brand"
          >
            {b.l}
          </motion.button>
        ))}
      </div>

      <div className="mt-4">
        {groups.length === 0 && (
          <p className="border-t border-sand-line py-8 text-center text-ink-soft">কোনো জেলা পাওয়া যায়নি।</p>
        )}
                {groups.map(({ div, all, shown }) => {
          const ids = all.map((d) => d.id);
          const n = ids.filter((id) => set.has(id)).length;
          const full = n === ids.length;
          const pct = Math.round((n / ids.length) * 100);
          return (
            <Reveal key={div.id} y={16}>
              <div className="mt-3 rounded-2xl border border-sand-line bg-white/60 p-3.5 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display flex items-center gap-2 text-base font-extrabold sm:text-[17px]">
                      <span className="h-4 w-1 shrink-0 rounded-full bg-gradient-to-b from-brand to-teal-400" />
                      {div.bn}
                      <span className="text-sm font-semibold text-ink-soft">
                        {bn(n)}/{bn(ids.length)}
                      </span>
                    </h3>
                    <div className="mt-2 h-1 w-full max-w-[160px] overflow-hidden rounded-full bg-sand">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand to-teal-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleMany(ids)}
                    className="shrink-0 rounded-full border border-sand-line bg-white px-3 py-1 text-xs font-semibold text-ink-soft transition hover:border-brand hover:text-brand sm:text-sm"
                  >
                    {full ? "সব মুছুন" : "সব বাছাই"}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {shown.map((d) => {
                    const on = set.has(d.id);
                    return (
                      <motion.button
                        key={d.id}
                        type="button"
                        onClick={() => toggle(d.id)}
                        aria-pressed={on}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        animate={{
                          backgroundColor: on ? "#067a54" : "#f3f8f5",
                          color: on ? "#ffffff" : "#0d1f19",
                        }}
                        transition={{ duration: 0.2 }}
                        className={
                          "flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-[15px] font-medium sm:text-base " +
                          (on
                            ? "border-brand-deep shadow-md shadow-brand/25"
                            : "border-sand-line hover:border-brand/50")
                        }
                      >
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.span
                              initial={{ width: 0, opacity: 0, scale: 0 }}
                              animate={{ width: "auto", opacity: 1, scale: 1 }}
                              exit={{ width: 0, opacity: 0, scale: 0 }}
                              className="inline-block text-[11px]"
                            >
                              ✓
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <span className="truncate">{d.bn}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}