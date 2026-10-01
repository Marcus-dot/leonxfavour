// Self-hosted variable fonts via next/font/local: no layout shift, and NO
// build-time Google fetch (so a flaky network can never fail the build).
import localFont from "next/font/local";
import { WEDDING } from "@/config/wedding";
import SmoothScroll from "@/components/SmoothScroll";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-latin.woff2", style: "normal" },
    { path: "./fonts/fraunces-latin-italic.woff2", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = localFont({
  src: [{ path: "./fonts/inter-latin.woff2", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://leonxfavour.vercel.app"
  ),
  title: `${WEDDING.groom} & ${WEDDING.bride}, Wedding Invitation`,
  description: `${WEDDING.groom} and ${WEDDING.bride} invite you to celebrate their wedding at ${WEDDING.venue}, ${WEDDING.venueCity}.`,
  openGraph: {
    // og:image is provided by src/app/opengraph-image.tsx (file convention).
    title: `${WEDDING.groom} & ${WEDDING.bride}`,
    description: `Join us at ${WEDDING.venue}. ${WEDDING.dateDisplay}.`,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FBFAF6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
