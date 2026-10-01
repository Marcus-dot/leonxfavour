import { ImageResponse } from "next/og";

// Favicon: a small lime ampersand on ink, the couple's monogram, on brand.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A1D18",
          color: "#A6D608",
          fontSize: 46,
          fontWeight: 700,
        }}
      >
        &amp;
      </div>
    ),
    { ...size }
  );
}
