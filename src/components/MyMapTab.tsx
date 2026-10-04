"use client";

import { useEffect, useRef, useState } from "react";
import DistrictPicker from "./DistrictPicker";
import MapCard from "./MapCard";
import Toast from "./Toast";
import { DISTRICTS } from "@/data/districts";
import { DIVISIONS } from "@/data/divisions";
import { THEMES } from "@/data/themes";
import { bn } from "@/lib/bn";
import { exportCard, setPreviewHandler, type ExportFormat } from "@/lib/exportCard";
import type { AppState } from "@/lib/useAppState";

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
}

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

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("canvas unavailable"));
          return;
        }

        const s = Math.min(img.width, img.height);

        ctx.drawImage(
          img,
          (img.width - s) / 2,
          (img.height - s) / 2,
          s,
          s,
          0,
          0,
          size,
          size
        );

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
  const [toast, setToast] = useState("");
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  const previewShown = useRef(false);

  useEffect(() => {
    setPreviewHandler((blob, name) => {
      previewShown.current = true;
      setPreview({ url: URL.createObjectURL(blob), name });
    });
    return () => setPreviewHandler(null);
  }, []);

  const closePreview = () => {
    const url = preview?.url;
    setPreview(null);
    if (url) setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const theme = THEMES.find((t) => t.id === state.theme) ?? THEMES[0];

  const toggle = (id: string) => {
    update({
      visited: state.visited.includes(id)
        ? state.visited.filter((x) => x !== id)
        : [...state.visited, id],
    });
  };

  const download = async (format: ExportFormat) => {
    if (!cardRef.current) return;

    setError("");
    setBusy(format);
    previewShown.current = false;

    try {
      await exportCard(cardRef.current, format, theme.bg);
      if (!previewShown.current) {
        setToast(`✓ ${format.toUpperCase()} ডাউনলোড শুরু হয়েছে`);
        setTimeout(() => setToast(""), 3000);
      }
    } catch (e) {
      console.error(e);
      setError(
        "ডাউনলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন। (" +
          (e instanceof Error ? e.message : "unknown") +
          ")",
      );
    } finally {
      setBusy(null);
    }
  };

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    e.target.value = "";

    if (!file) return;

    try {
      update({
        photo: await readPhoto(file),
      });
    } catch {
      setError("ছবিটি পড়া যায়নি।");
    }
  };

   return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-8 pt-8 text-center sm:px-6 sm:pb-12 sm:pt-12">
        <div className="pointer-events-none absolute -left-24 top-0 -z-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-10 -z-10 h-72 w-72 rounded-full bg-flag-red/10 blur-3xl" />

        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-tint px-3.5 py-1.5 text-xs font-semibold text-brand sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {bn(DISTRICTS.length)} জেলা · {bn(DIVISIONS.length)} বিভাগ
          </span>

          <h1 className="rise [animation-delay:100ms] font-display mx-auto mt-4 max-w-2xl text-[32px] font-extrabold leading-tight tracking-tight sm:mt-5 sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-brand to-flag-red bg-clip-text text-transparent">
              বাংলাদেশের
            </span>{" "}
            কতটুকু ঘুরে দেখেছেন?
          </h1>

          <p className="rise [animation-delay:200ms] mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:mt-4 sm:text-lg">
            ঘুরে দেখা জেলাগুলো বেছে নিন, পছন্দের থিম দিন এবং নিজের ভ্রমণ ম্যাপ তৈরি করে শেয়ার করুন।
          </p>

          <a
            href="#picker"
            className="btn-shine glow-ring font-display relative mt-5 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand-deep via-brand to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 sm:mt-6 sm:text-base"
          >
            জেলা বাছাই শুরু করুন
            <span aria-hidden>↓</span>
          </a>

          <div className="mx-auto mt-5 flex flex-wrap justify-center gap-2 text-xs sm:mt-6 sm:gap-3 sm:text-sm">
            {["জেলা বাছাই", "থিম নির্বাচন", "ম্যাপ ডাউনলোড"].map((label, i) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-sand-line bg-white/70 py-1 pl-1 pr-3 text-ink-soft"
              >
                <span className="font-display flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                  {bn(i + 1)}
                </span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl space-y-5 px-3 pb-12 sm:px-5 sm:pb-16">
        <div id="picker" className="scroll-mt-20">
          <DistrictPicker
            visited={state.visited}
            onChange={(visited) => update({ visited })}
          />
        </div>

        <div className="card-lift rounded-[24px] border border-sand-line bg-white/70 p-4 shadow-sm backdrop-blur-sm sm:p-5">
          <h2 className="font-display mb-3 text-base font-extrabold sm:text-lg">
            আপনার প্রোফাইল
          </h2>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onPhoto}
          />

          <div className="grid gap-3 md:grid-cols-[1.1fr_1fr_auto] md:items-center">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-dashed border-ink-soft/30 bg-white/70 p-2 pr-4 text-left transition hover:bg-white"
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-sand">
                  {state.photo ? (
                    <img
                      src={state.photo}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#5a6f66"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" />
                    </svg>
                  )}
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold sm:text-base">
                    {state.photo ? "ছবি বদলান" : "আপনার ছবি যোগ করুন"}
                  </span>
                  <span className="block text-xs text-ink-soft">
                    কার্ডে চৌকো করে বসবে
                  </span>
                </span>
              </button>

              {state.photo && (
                <button
                  type="button"
                  onClick={() => update({ photo: null })}
                  className="shrink-0 text-xs text-ink-soft underline underline-offset-4 sm:text-sm"
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
              className="w-full rounded-2xl border border-sand-line bg-sand px-4 py-3 text-sm outline-none placeholder:text-ink-soft/60 focus:border-brand sm:text-base"
            />

            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-sand px-4 py-3 text-sm sm:text-base">
              <span className="text-ink-soft">জেলার নাম দেখান</span>

              <input
                type="checkbox"
                checked={state.showLabels}
                onChange={(e) =>
                  update({
                    showLabels: e.target.checked,
                  })
                }
                className="peer sr-only"
              />

              <span className="relative h-6 w-11 shrink-0 rounded-full bg-[#cbddd2] transition peer-checked:bg-brand after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
            </label>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
          <section className="lg:sticky lg:top-24">
            <div className="rounded-[28px] border border-sand-line bg-white/60 p-3 shadow-sm sm:p-4">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="font-display flex items-center gap-2 text-base font-extrabold sm:text-lg">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-flag-red" />
                  লাইভ প্রিভিউ
                </h2>
                <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink-soft">
                  {bn(state.visited.length)}/{bn(DISTRICTS.length)} জেলা
                </span>
              </div>

              <div className="mx-auto w-full max-w-md lg:max-w-none">
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

              <p className="mt-3 text-center text-xs text-ink-soft sm:text-sm">
                ম্যাপের যেকোনো জেলায় ক্লিক করেও বাছাই করতে পারেন।
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="card-lift rounded-[24px] border border-sand-line bg-white/70 p-4 shadow-sm backdrop-blur-sm sm:p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="font-display flex h-7 w-7 items-center justify-center rounded-full bg-[#16211d] text-sm font-bold text-white">
                  ২
                </span>
                <h2 className="font-display text-base font-extrabold sm:text-lg">
                  থিম বাছাই করুন
                </h2>
              </div>

              <div className="grid grid-cols-5 gap-2">
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
                        "flex flex-col items-center gap-1.5 rounded-2xl p-1.5 transition " +
                        (active
                          ? "bg-sand ring-2 ring-ink"
                          : "hover:bg-sand/70")
                      }
                    >
                      <span
                        className="relative block h-12 w-full overflow-hidden rounded-xl ring-1 ring-black/10"
                        style={{ background: t.swatchBg }}
                      >
                        <span
                          className="absolute left-2 top-2 h-4 w-4 rounded-full"
                          style={{ background: t.accent }}
                        />
                        <span
                          className="absolute inset-x-2 bottom-2 h-1.5 rounded-full"
                          style={{ background: t.base }}
                        />
                      </span>
                      <span className="text-[11px] font-semibold text-ink-soft sm:text-xs">
                        {t.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            

            <div className="card-lift rounded-[24px] border border-sand-line bg-white/70 p-4 shadow-sm backdrop-blur-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-display flex h-7 w-7 items-center justify-center rounded-full bg-[#16211d] text-sm font-bold text-white">
                    ৩
                  </span>
                  <h2 className="font-display text-base font-extrabold sm:text-lg">
                    ম্যাপ ডাউনলোড করুন
                  </h2>
                </div>

                <span className="rounded-full bg-sand px-3 py-1 text-xs text-ink-soft">
                  {bn(state.visited.length)} জেলা নির্বাচিত
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {(
                  [
                    { f: "png", hint: "সেরা মান" },
                    { f: "jpg", hint: "ছোট ফাইল" },
                    { f: "pdf", hint: "প্রিন্টের জন্য" },
                  ] as const
                ).map(({ f, hint }, index) => (
                  <button
                    key={f}
                    type="button"
                    disabled={busy !== null}
                    onClick={() => download(f)}
                    className={
                      "font-display flex flex-col items-center rounded-2xl border px-2 py-3 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 " +
                      (index === 0
                        ? "border-transparent bg-gradient-to-r from-brand-deep to-brand text-white"
                        : "border-sand-line bg-white hover:bg-sand")
                    }
                  >
                    <span className="text-sm font-extrabold sm:text-base">
                      {busy === f ? "..." : "↓ " + f.toUpperCase()}
                    </span>
                    <span
                      className={
                        "mt-0.5 text-[10px] font-normal sm:text-xs " +
                        (index === 0 ? "text-white/70" : "text-ink-soft")
                      }
                    >
                      {hint}
                    </span>
                  </button>
                ))}
              </div>

              {error && (
                <p className="mt-3 text-center text-xs text-flag-red sm:text-sm">
                  {error}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
      {preview && (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center"
          onClick={closePreview}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-base font-extrabold">✓ আপনার ম্যাপ তৈরি হয়েছে</h3>
            <p className="mt-1 text-xs text-ink-soft">
              নিচের বাটনে চাপ দিয়ে সেভ করুন। না হলে ছবিতে অনেকক্ষণ চেপে ধরে "Download image" বেছে নিন।
            </p>

            <div className="mt-3 max-h-[55vh] overflow-auto rounded-2xl border border-sand-line bg-sand">
              {preview.name.endsWith(".pdf") ? (
                <p className="p-6 text-center text-sm">📄 {preview.name}</p>
              ) : (
                <img src={preview.url} alt="আপনার ম্যাপ" className="w-full" />
              )}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <a
                href={preview.url}
                download={preview.name}
                className="font-display rounded-2xl bg-gradient-to-r from-brand-deep to-brand px-3 py-3 text-center text-sm font-extrabold text-white"
              >
                ↓ সেভ করুন
              </a>
              <button
                type="button"
                onClick={closePreview}
                className="font-display rounded-2xl border border-sand-line bg-white px-3 py-3 text-sm font-extrabold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </>
  );
}