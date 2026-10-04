import { toJpeg, toPng } from "html-to-image";

export type ExportFormat = "png" | "jpg" | "pdf";

const TARGET_WIDTH = 1080; // output pixel width

function ratioFor(node: HTMLElement) {
  return Math.max(2, TARGET_WIDTH / node.offsetWidth);
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [head, body] = dataUrl.split(",");
  const mime = head.match(/:(.*?);/)?.[1] ?? "image/png";
  const bin = atob(body);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

async function saveBlob(blob: Blob, filename: string) {
  const ua = navigator.userAgent;
  const mobile =
    /iPhone|iPad|iPod|Android/i.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);

  // Phones: open the share sheet so the person can "Save Image" / "Save to Files".
  if (mobile && typeof navigator.canShare === "function") {
    const file = new File([blob], filename, { type: blob.type });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "আমার দেশ ম্যাপ" });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        /* share blocked, fall through to normal download */
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

async function save(dataUrl: string, filename: string) {
  await saveBlob(dataUrlToBlob(dataUrl), filename);
}

/** Make sure every <img> inside the card is fully decoded before we snapshot it. */
async function waitForImages(node: HTMLElement) {
  const imgs = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    imgs.map(async (img) => {
      try {
        if (!img.complete) {
          await new Promise<void>((res) => {
            img.addEventListener("load", () => res(), { once: true });
            img.addEventListener("error", () => res(), { once: true });
          });
        }
        await img.decode();
      } catch {
        /* ignore broken image */
      }
    }),
  );
  if (document.fonts?.ready) await document.fonts.ready;
}

function baseOptions(node: HTMLElement, bg: string) {
  return { pixelRatio: ratioFor(node), backgroundColor: bg, cacheBust: false };
}

/** Renders the card node and downloads it as PNG / JPG / PDF. */
export async function exportCard(node: HTMLElement, format: ExportFormat, bg: string) {
  await waitForImages(node);
  const opts = baseOptions(node, bg);

  // Safari sometimes skips fonts/images on the first render, so warm up once.
  try {
    await toPng(node, { ...opts, pixelRatio: 1 });
  } catch {
    /* ignore warm-up failure */
  }

  if (format === "png") {
    await save(await toPng(node, opts), "amar-bangladesh-map.png");
    return;
  }

  const jpg = await toJpeg(node, { ...opts, quality: 0.95 });
  if (format === "jpg") {
    await save(jpg, "amar-bangladesh-map.jpg");
    return;
  }

  const { jsPDF } = await import("jspdf");
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("image load failed"));
    img.src = jpg;
  });
  const margin = 24;
  const w = img.naturalWidth / (opts.pixelRatio / 2); // keep the PDF a sensible size
  const h = img.naturalHeight / (opts.pixelRatio / 2);
  const pdf = new jsPDF({
    orientation: h > w ? "portrait" : "landscape",
    unit: "px",
    format: [w + margin * 2, h + margin * 2],
  });
  pdf.setFillColor(bg);
  pdf.rect(0, 0, w + margin * 2, h + margin * 2, "F");
  pdf.addImage(jpg, "JPEG", margin, margin, w, h);
  await saveBlob(pdf.output("blob"), "amar-bangladesh-map.pdf");
}

/**
 * Share the card through the phone's share sheet (Web Share API).
 * Falls back to a normal PNG download where sharing files isn't supported.
 */
export async function shareCard(node: HTMLElement, bg: string): Promise<"shared" | "downloaded"> {
  await waitForImages(node);
  const dataUrl = await toPng(node, baseOptions(node, bg));
  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], "amar-bangladesh-map.png", { type: "image/png" });
  const data = { files: [file], title: "আমার দেশ ম্যাপ", text: "আমার বাংলাদেশ ভ্রমণ ম্যাপ 🇧🇩" };
  if (navigator.canShare?.(data)) {
    try {
      await navigator.share(data);
      return "shared";
    } catch (e) {
      if ((e as Error).name === "AbortError") return "shared";
    }
  }
  await save(dataUrl, "amar-bangladesh-map.png");
  return "downloaded";
}