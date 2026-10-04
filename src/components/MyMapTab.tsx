"use client";

import { useRef, useState } from "react";
import DistrictPicker from "./DistrictPicker";
import MapCard from "./MapCard";
import { DISTRICTS } from "@/data/districts";
import { DIVISIONS } from "@/data/divisions";
import { THEMES } from "@/data/themes";
import { bn } from "@/lib/bn";
import { exportCard, type ExportFormat } from "@/lib/exportCard";
import type { AppState } from "@/lib/useAppState";

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
}

/** Resize an uploaded photo to a small square JPEG so it fits in localStorage. */
function readPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("bad image"));
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const s = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function MyMapTab({ state, update }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<ExportFormat | null>(null);
  const [error, setError] = useState("");
  const theme = THEMES.find((t) => t.id === state.theme) ?? THEMES[0];

  const toggle = (id: string) =>
    update({
      visited: state.visited.includes(id)
        ? state.visited.filter((x) => x !== id)
        : [...state.visited, id],
    });

  const download = async (format: ExportFormat) => {
    if (!cardRef.current) return;
    setError("");
    setBusy(format);
    try {
      await exportCard(cardRef.current, format, theme.bg);
    } catch (e) {
      console.error(e);
      setError("ডাউনলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setBusy(null);
    }
  };

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      update({ photo: await readPhoto(file) });
    } catch {
      setError("ছবিটি পড়া যায়নি।");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="px-5 pb-10 pt-10 text-center sm:pt-14">
        <span className="font-display inline-block rounded-full bg-brand-tint px-4 py-2 text-sm font-semibold text-brand">
          {bn(DISTRICTS.length)} জেলা · {bn(DIVISIONS.length)} বিভাগ
        </span>
        <h1 className="font-display mx-auto mt-6 max-w-2xl text-[44px] font-extrabold leading-[1.15] tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-r from-brand to-flag-red bg-clip-text text-transparent">
            বাংলাদেশের
          </span>{" "}
          কতটুকু ঘুরে দেখেছেন?
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
          যে জেলাগুলোতে গিয়েছেন সেগুলো বেছে নিন, পছন্দের রঙের থিম দিন, আর ডাউনলোড করুন আপনার ভ্রমণের
          সুন্দর একটি ম্যাপ।
        </p>
        <a
          href="#picker"
          className="font-display mt-8 inline-flex items-center gap-2 rounded-full bg-[#16211d] px-8 py-4 text-lg font-semibold text-white transition hover:bg-black"
        >
          জেলা বাছাই শুরু করুন <span aria-hidden>↓</span>
        </a>
        <ol className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-x-8 gap-y-3 text-[15px] text-ink-soft">
          {["জেলা বাছাই করুন", "থিম বেছে নিন", "PNG, JPG বা PDF ডাউনলোড করুন"].map((t, i) => (
            <li key={t} className="flex items-center gap-2.5">
              <span className="font-display flex h-8 w-8 items-center justify-center rounded-full border border-sand-line bg-white text-sm font-semibold text-ink">
                {bn(i + 1)}
              </span>
              {t}
            </li>
          ))}
        </ol>
      </section>

      <div className="mx-auto max-w-3xl space-y-5 px-4 pb-16">
        <DistrictPicker visited={state.visited} onChange={(visited) => update({ visited })} />

        {/* Customize + preview + download */}
        <section className="rounded-[28px] border border-sand-line bg-white/60 p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-3.5">
            <span className="text-[17px] text-ink-soft">থিম</span>
            {THEMES.map((t) => {
              const active = t.id === state.theme;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-label={t.name}
                  aria-pressed={active}
                  onClick={() => update({ theme: t.id })}
                  className={
                    "relative h-[52px] w-[52px] overflow-hidden rounded-full transition " +
                    (active ? "ring-[3px] ring-ink ring-offset-[3px] ring-offset-paper" : "ring-1 ring-sand-line")
                  }
                  style={{ background: t.swatchBg }}
                >
                  <span
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-tl-full"
                    style={{ background: t.accent }}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-3 rounded-2xl border border-dashed border-ink-soft/40 bg-white/50 p-2.5 pr-5 text-[17px] hover:bg-white"
            >
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-sand">
                {state.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={state.photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6f6a5f" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" />
                  </svg>
                )}
              </span>
              {state.photo ? "ছবি বদলান" : "আপনার ছবি যোগ করুন"}
            </button>
            {state.photo && (
              <button
                type="button"
                onClick={() => update({ photo: null })}
                className="text-[15px] text-ink-soft underline underline-offset-4"
              >
                সরান
              </button>
            )}
          </div>

          <input
            value={state.name}
            maxLength={24}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="আপনার নাম (ঐচ্ছিক)"
            className="mt-4 w-full rounded-2xl border border-sand-line bg-sand px-5 py-4 text-lg outline-none placeholder:text-ink-soft/60 focus:border-brand"
          />

          <label className="mt-5 flex cursor-pointer items-center gap-3.5 text-[17px]">
            <input
              type="checkbox"
              checked={state.showLabels}
              onChange={(e) => update({ showLabels: e.target.checked })}
              className="peer sr-only"
            />
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-brand bg-white text-white peer-checked:bg-brand">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className={state.showLabels ? "" : "opacity-0"}>
                <path d="m5 12 5 5 9-10" />
              </svg>
            </span>
            জেলার নাম
          </label>

          <div className="mt-6">
            <MapCard
              ref={cardRef}
              visited={state.visited}
              theme={theme}
              name={state.name}
              photo={state.photo}
              showLabels={state.showLabels}
              onToggle={toggle}
            />
          </div>
          <p className="mt-4 text-center text-[15px] text-ink-soft">
            টিপস: ম্যাপের জেলায় সরাসরি ক্লিক করেও বাছাই করতে পারেন।
          </p>

          <div className="mt-6 border-t border-sand-line pt-6">
            <h2 className="font-display text-xl font-extrabold">আপনার ম্যাপ ডাউনলোড করুন</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {(["png", "jpg"] as const).map((f, i) => (
                <button
                  key={f}
                  type="button"
                  disabled={busy !== null}
                  onClick={() => download(f)}
                  className={
                    "font-display rounded-2xl border px-5 py-4 text-lg font-semibold transition disabled:opacity-60 " +
                    (i === 0
                      ? "border-[#16211d] bg-[#16211d] text-white hover:bg-black"
                      : "border-sand-line bg-white hover:bg-sand")
                  }
                >
                  {busy === f ? "…" : "↓"} {f.toUpperCase()}
                </button>
              ))}
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => download("pdf")}
                className="font-display col-span-2 rounded-2xl border border-sand-line bg-white px-5 py-4 text-lg font-semibold transition hover:bg-sand disabled:opacity-60"
              >
                {busy === "pdf" ? "…" : "↓"} PDF
              </button>
            </div>
            {error && <p className="mt-3 text-center text-sm text-flag-red">{error}</p>}
          </div>
        </section>
      </div>
    </>
  );
}
