import { toJpeg, toPng } from "html-to-image";

export type ExportFormat = "png" | "jpg" | "pdf";

const TARGET_WIDTH = 1200; // output pixel width

function ratioFor(node: HTMLElement) {
  return Math.max(2, TARGET_WIDTH / node.offsetWidth);
}

function save(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Renders the card node and downloads it as PNG / JPG / PDF. */
export async function exportCard(node: HTMLElement, format: ExportFormat, bg: string) {
  const opts = { pixelRatio: ratioFor(node), backgroundColor: bg, cacheBust: true };

  // Safari sometimes skips fonts/images on the first render, so warm up once.
  try {
    await toPng(node, { ...opts, pixelRatio: 1 });
  } catch {
    /* ignore warm-up failure */
  }

  if (format === "png") {
    save(await toPng(node, opts), "amar-bangladesh-map.png");
    return;
  }

  const jpg = await toJpeg(node, { ...opts, quality: 0.95 });
  if (format === "jpg") {
    save(jpg, "amar-bangladesh-map.jpg");
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
  pdf.save("amar-bangladesh-map.pdf");
}
