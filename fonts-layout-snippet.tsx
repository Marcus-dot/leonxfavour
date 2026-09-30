// --- Add to src/app/layout.tsx ---
// Self-hosted via next/font: no layout shift, no external request, fast on mobile.

import { Fraunces, Inter } from "next/font/google";
import { WEDDING } from "@/config/wedding";
import type { Metadata } from "next";
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
  title: `${WEDDING.groom} & ${WEDDING.bride} — Wedding Invitation`,
  description: `${WEDDING.groom} and ${WEDDING.bride} invite you to celebrate their wedding at ${WEDDING.venue}, ${WEDDING.venueCity}.`,
  openGraph: {
    title: `${WEDDING.groom} & ${WEDDING.bride}`,
    description: `Join us at ${WEDDING.venue}. ${WEDDING.dateDisplay}.`,
    images: ["/og.jpg"], // generate a 1200x630 share image (photo 6 + names) — guests share on WhatsApp
    type: "website",
  },
  themeColor: "#FBFAF6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
