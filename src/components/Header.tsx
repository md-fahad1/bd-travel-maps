"use client";

export type TabId = "map" | "explore" | "trip";

const TABS: { id: TabId; label: string }[] = [
  { id: "map", label: "আমার ম্যাপ" },
  { id: "explore", label: "কোথায় ঘুরবেন" },
  { id: "trip", label: "ট্রিপ প্ল্যানার" },
];

export default function Header({ tab, onTab }: { tab: TabId; onTab: (t: TabId) => void }) {
  return (
    <header className="mx-auto max-w-3xl px-4 pt-5">
      <div className="flex items-center justify-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand">
          <span className="h-5 w-5 rounded-full bg-flag-red" />
        </span>
        <span className="font-display text-2xl font-extrabold">আমার দেশ ম্যাপ</span>
      </div>
      <nav className="mt-5 grid grid-cols-3 gap-1 rounded-full bg-sand p-1.5" aria-label="প্রধান মেনু">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
            className={
              "font-display rounded-full px-2 py-3.5 text-[17px] font-semibold transition " +
              (tab === t.id ? "bg-white text-ink shadow-sm" : "text-ink-soft hover:text-ink")
            }
          >
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
