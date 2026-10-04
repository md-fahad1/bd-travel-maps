"use client";

import { AnimatePresence, motion } from "framer-motion";
import ProgressRing from "./ProgressRing";
import { DISTRICTS } from "@/data/districts";
import { DIVISIONS } from "@/data/divisions";
import { bn } from "@/lib/bn";
import { rankFor } from "@/lib/rank";

/** Live progress: ring, traveller rank and a bar for each division. */
export default function StatsPanel({ visited }: { visited: string[] }) {
  const set = new Set(visited);
  const total = DISTRICTS.length;
  const count = visited.length;
  const percent = Math.round((count / total) * 100);
  const rank = rankFor(count);

  return (
    <section className="rounded-[28px] border border-sand-line bg-white/70 p-5 sm:p-7">
      <div className="flex items-center gap-5">
        <ProgressRing percent={percent}>
          <motion.span
            key={percent}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-3xl font-extrabold leading-none"
          >
            {bn(percent)}%
          </motion.span>
          <span className="mt-1 text-xs text-ink-soft">
            {bn(count)}/{bn(total)}
          </span>
        </ProgressRing>

        <div className="min-w-0">
          <p className="text-sm text-ink-soft">আপনার র‍্যাংক</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={rank.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="font-display text-2xl font-extrabold leading-tight sm:text-3xl"
            >
              <span className="mr-2">{rank.emoji}</span>
              {rank.title}
            </motion.p>
          </AnimatePresence>
          <p className="mt-1.5 text-[15px] text-ink-soft">
            {rank.next !== null
              ? `“${rank.nextTitle}” হতে আরও ${bn(rank.next - count)}টি জেলা বাকি`
              : "অভিনন্দন! পুরো বাংলাদেশ ঘোরা শেষ 🎉"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
        {DIVISIONS.map((div, i) => {
          const ds = DISTRICTS.filter((d) => d.division === div.id);
          const n = ds.filter((d) => set.has(d.id)).length;
          const pct = (n / ds.length) * 100;
          return (
            <div key={div.id}>
              <div className="mb-1.5 flex justify-between text-[14px]">
                <span className="font-semibold">{div.bn.replace(" বিভাগ", "")}</span>
                <span className="text-ink-soft">
                  {bn(n)}/{bn(ds.length)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-sand">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand to-[#2fb26f]"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.04 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}