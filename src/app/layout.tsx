// Self-hosted via next/font: no layout shift, no external request, fast on mobile.
import { Fraunces, Inter } from "next/font/google";
import { WEDDING } from "@/config/wedding";
import SmoothScroll from "@/components/SmoothScroll";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://leonandfavour.vercel.app"
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
