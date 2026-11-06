import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

// Sora — self-hosted variable font (weights 100–800), loaded by Next.js:
// preloaded, no external request, no layout shift (size-adjusted fallback).
const sora = localFont({
  src: "./fonts/Sora-Variable.woff2",
  variable: "--font-sora",
  weight: "100 800",
  style: "normal",
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Top Digital Marketing Agency in Thrissur, Kerala | Mindstory",
  description:
    "Mindstory, the top digital marketing agency in Thrissur, Kerala, offers SEO, SMM, PPC, and web development services to boost your brand online.",
  icons: { icon: "https://mindstory.in/wp-content/uploads/cropped-mindstory_icon-270x270.png" },
  openGraph: {
    title: "Mindstory: Elevating Brands with Expert Digital Marketing Solutions in Kerala",
    description:
      "Elevate online presence with Mindstory, Thrissur's leading Digital Marketing Company, offering expert web design, SEO, and digital marketing services.",
    url: "https://mindstory.in/",
    siteName: "Mindstory | Your Digital Marketing Partner",
    images: ["https://mindstory.in/wp-content/uploads/image_03_COM.png"],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sora.variable}>
      <body className="font-sans">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
