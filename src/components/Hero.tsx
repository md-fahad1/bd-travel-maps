"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import CountUp from "./CountUp";
import Marquee from "./Marquee";
import { DISTRICTS, MAP_HEIGHT, MAP_WIDTH } from "@/data/districts";
import { DIVISIONS } from "@/data/divisions";
import { bn } from "@/lib/bn";

const WORDS = ["কতটুকু", "ঘুরে", "দেখেছেন?"];

/** The big animated map: districts "light up" one by one, then it starts over. */
function LiveMap({ visited }: { visited: Set<string> }) {
  return (
    <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="h-full w-full drop-shadow-[0_24px_40px_rgba(18,121,90,0.25)]">
      {DISTRICTS.map((d, i) => (
        <motion.path
          key={d.id}
          d={d.d}
          stroke="#faf8f4"
          strokeWidth={1.1}
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, fill: visited.has(d.id) ? "#12795a" : "#e3dccd" }}
          transition={{ opacity: { delay: i * 0.018, duration: 0.5 }, fill: { duration: 0.45 } }}
        />
      ))}
    </svg>
  );
}

export default function Hero({ onStart, onExplore }: { onStart: () => void; onExplore: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const mapY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Demo: fill random districts one by one, pause, reset.
  const order = useMemo(() => [...DISTRICTS].sort(() => Math.random() - 0.5).map((d) => d.id), []);
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((x) => (x >= order.length + 6 ? 0 : x + 1)), 170);
    return () => clearInterval(t);
  }, [order.length]);
  const lit = useMemo(() => new Set(order.slice(0, n)), [order, n]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden">
      {/* aurora blobs */}
      <motion.div style={{ y: blobY1 }} className="pointer-events-none absolute -left-24 -top-24 -z-10 h-[420px] w-[420px] rounded-full bg-[#2fb26f]/25 blur-[90px]" />
      <motion.div style={{ y: blobY2 }} className="pointer-events-none absolute -right-20 top-40 -z-10 h-[380px] w-[380px] rounded-full bg-flag-red/20 blur-[100px]" />
      <div className="bg-dots pointer-events-none absolute inset-0 -z-20 [mask-image:linear-gradient(#000,transparent_85%)]" />

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-10 pt-10 md:grid-cols-[1.1fr_0.9fr] md:pt-16">
        <div className="text-center md:text-left">
          <motion.span
            initial={{ opacity: 0, y: -12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="font-display glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-brand"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flag-red opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-flag-red" />
            </span>
            বাংলাদেশের নিজের ভ্রমণ ম্যাপ
          </motion.span>

          <h1 className="font-display mt-6 text-[44px] font-extrabold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
            <motion.span
              className="text-gradient inline-block"
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              বাংলাদেশের
            </motion.span>
            <br />
            {WORDS.map((w, i) => (
              <motion.span
                key={w}
                className="mr-3 inline-block"
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft md:mx-0"
          >
            জেলা বেছে নিন, পছন্দের থিম দিন — আর নিমেষেই বানিয়ে ফেলুন আপনার ভ্রমণের সুন্দর শেয়ার-যোগ্য ম্যাপ।
            ফ্রি, লগইন ছাড়াই।
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start"
          >
            <motion.button
              type="button"
              onClick={onStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="font-display group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-ink/20"
            >
              <span className="animate-shimmer absolute inset-y-0 left-0 w-1/3 bg-white/25 blur-md" />
              <span className="relative">জেলা বাছাই শুরু করুন</span>
              <motion.span
                aria-hidden
                className="relative"
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              >
                ↓
              </motion.span>
            </motion.button>
            <motion.button
              type="button"
              onClick={onExplore}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="font-display glass rounded-full px-7 py-4 text-lg font-semibold text-ink"
            >
              কোথায় ঘুরবেন দেখুন →
            </motion.button>
          </motion.div>

          {/* stats */}
          <motion.dl
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.95 } } }}
            className="mt-10 grid max-w-md grid-cols-3 gap-3 text-center md:text-left"
          >
            {[
              { v: DISTRICTS.length, l: "জেলা" },
              { v: DIVISIONS.length, l: "বিভাগ" },
              { v: 5, l: "থিম" },
            ].map((s) => (
              <motion.div
                key={s.l}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                className="glass rounded-2xl px-4 py-3"
              >
                <dt className="font-display text-3xl font-extrabold text-brand">
                  <CountUp value={s.v} />
                </dt>
                <dd className="text-sm text-ink-soft">{s.l}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        {/* animated map */}
        <motion.div style={{ y: mapY }} className="relative mx-auto w-full max-w-[420px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.2 }}
            className="animate-float relative aspect-[600/847] w-full"
          >
            <div className="absolute inset-6 -z-10 rounded-[48px] bg-gradient-to-br from-brand/15 to-flag-red/15 blur-2xl" />
            <LiveMap visited={lit} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="glass font-display absolute left-0 top-10 rounded-2xl px-4 py-2.5 text-sm font-bold shadow-lg sm:-left-6"
          >
            <span className="text-brand">{bn(Math.min(n, order.length))}</span>
            <span className="text-ink-soft"> / {bn(DISTRICTS.length)} জেলা ✓</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
            transition={{ opacity: { delay: 1.3 }, x: { delay: 1.3 }, y: { repeat: Infinity, duration: 4, delay: 1.5 } }}
            className="glass font-display absolute bottom-16 right-0 rounded-2xl px-4 py-2.5 text-sm font-bold shadow-lg sm:-right-4"
          >
            📸 PNG · JPG · PDF
          </motion.div>
        </motion.div>
      </div>

      <Marquee />
    </section>
  );
}