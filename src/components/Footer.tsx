"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer className="relative mt-4 overflow-hidden bg-ink px-5 pb-10 pt-16 text-white">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full bg-brand/40 blur-[90px]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            আপনার <span className="text-[#5be3a6]">বাংলাদেশ</span> ঘোরা শুরু হোক আজই
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/70">
            ম্যাপ বানান, বন্ধুদের সাথে শেয়ার করুন, আর দেখুন কে বেশি জেলা ঘুরেছে!
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.div
            whileHover={{ y: -4 }}
            className="mx-auto mt-10 flex max-w-sm items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.07] p-4 text-left backdrop-blur"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/developer.jpeg"
              alt="Md Fahad Khan"
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-[#5be3a6]"
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50">Developed by</p>
              <p className="font-display text-xl font-extrabold">Md Fahad Khan</p>
              <p className="text-sm text-[#5be3a6]">Software Engineer</p>
            </div>
          </motion.div>
        </Reveal>

        <p className="mt-10 text-[15px] leading-relaxed text-white/60">
          বাংলাদেশের জন্য ভালোবাসা দিয়ে তৈরি ♥ · আপনার বাছাই ও ছবি শুধু আপনার ব্রাউজারেই থাকে
        </p>
        <p className="mt-1 text-sm text-white/40">ম্যাপের সীমানা: © geoBoundaries (geoboundaries.org), CC BY 4.0</p>
      </div>
    </footer>
  );
}