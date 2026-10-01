import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { WEDDING } from "@/config/wedding";

// 1200×630 WhatsApp/social share card: photo 6 beside the names in Fraunces.
// Guests share this link on WhatsApp, so the preview matters. The brand font is
// fetched from Google Fonts with a graceful fallback so a build never breaks.
export const alt = `${WEDDING.groom} & ${WEDDING.bride}, Wedding Invitation`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFraunces(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400&text=${encodeURIComponent(text)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    ).then((r) => r.text());
    const url = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "public/og-bg.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const names = `${WEDDING.groom} & ${WEDDING.bride}`;
  const font = await loadFraunces(`${names} ${WEDDING.dateDisplay}`);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#FBFAF6" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "62%",
            padding: "0 70px",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#8A8F82",
            }}
          >
            Together with their families
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 24,
              fontFamily: font ? "Fraunces" : "serif",
              color: "#1A1D18",
              lineHeight: 1,
            }}
          >
            <div style={{ fontSize: 118 }}>{WEDDING.groom}</div>
            <div style={{ fontSize: 58, color: "#5A7302", margin: "4px 0" }}>&amp;</div>
            <div style={{ fontSize: 118 }}>{WEDDING.bride}</div>
          </div>
          <div style={{ display: "flex", width: 70, height: 5, background: "#A6D608", margin: "34px 0 26px" }} />
          <div style={{ fontSize: 26, color: "#3E4239" }}>{WEDDING.dateDisplay}</div>
        </div>

        <div style={{ display: "flex", width: "38%", height: "100%" }}>
          {/* Satori (ImageResponse) requires a raw img; next/image is not supported here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc}
            alt=""
            width={456}
            height={630}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Fraunces", data: font, style: "normal", weight: 400 }] : undefined,
    }
  );
}
