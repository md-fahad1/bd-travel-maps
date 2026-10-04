"use client";

import { useEffect, useState } from "react";

/**
 * Loads an image from /public and returns it as a data: URL.
 * Embedding the image as data makes it appear reliably inside the exported
 * PNG / JPG / PDF (html-to-image sometimes drops normal <img src="/file.jpg">).
 */
export function useDataUrl(src: string) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let off = false;
    fetch(src)
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error("not found"))))
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => resolve(fr.result as string);
            fr.onerror = () => reject(fr.error);
            fr.readAsDataURL(blob);
          }),
      )
      .then((data) => {
        if (!off) setUrl(data);
      })
      .catch(() => {
        /* keep the initials fallback */
      });
    return () => {
      off = true;
    };
  }, [src]);

  return url;
}