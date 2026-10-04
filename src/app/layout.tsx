import type { Metadata, Viewport } from "next";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import "@fontsource/anek-bangla/600.css";
import "@fontsource/anek-bangla/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "আমার দেশ ম্যাপ",
  description:
    "যে জেলাগুলোতে গিয়েছেন সেগুলো বেছে নিন, পছন্দের রঙের থিম দিন, আর ডাউনলোড করুন আপনার ভ্রমণের সুন্দর একটি ম্যাপ।",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf8f4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
