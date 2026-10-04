"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export type TabId = "map" | "explore" | "trip";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "map", label: "আমার ম্যাপ", icon: "🗺️" },
  { id: "explore", label: "কোথায় ঘুরবেন", icon: "🧭" },
  { id: "trip", label: "ট্রিপ প্ল্যানার", icon: "🎒" },
];

export default function Header({ tab, onTab }: { tab: TabId; onTab: (t: TabId) => void }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-x-0 border-t-0 border-b-sand-line/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <button type="button" onClick={() => onTab("map")} className="flex items-center gap-2.5">
            <motion.span
              whileHover={{ rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand shadow-md shadow-brand/30"
            >
              <motion.span
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
                className="h-4 w-4 rounded-full bg-flag-red"
              />
            </motion.span>
            <span className="font-display hidden text-xl font-extrabold sm:inline">আমার দেশ ম্যাপ</span>
          </button>

          <nav className="relative flex gap-1 rounded-full bg-sand/90 p-1" aria-label="প্রধান মেনু">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTab(t.id)}
                  aria-current={active ? "page" : undefined}
                  className={
                    "font-display relative rounded-full px-3 py-2.5 text-[15px] font-semibold transition-colors sm:px-5 sm:text-[16px] " +
                    (active ? "text-ink" : "text-ink-soft hover:text-ink")
                  }
                >
                  {active && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-sm"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative">
                    <span className="mr-1.5 hidden sm:inline">{t.icon}</span>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      <motion.div
        style={{ scaleX }}
        className="h-[3px] origin-left bg-gradient-to-r from-brand via-teal-400 to-flag-red"
      />
    </header>
  );
}