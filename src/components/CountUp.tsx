"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { bn } from "@/lib/bn";

/** Animates a number up to `value` and shows it in Bangla digits. */
export default function CountUp({ value, duration = 1.2, suffix = "" }: { value: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const prev = useRef(0);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(prev.current, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, inView, duration]);

  return (
    <span ref={ref}>
      {bn(n)}
      {suffix}
    </span>
  );
}