// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "var(--ivory)",
        paper: "var(--paper)",
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
        },
        sage: "var(--sage)",
        line: "var(--line)",
        lime: {
          DEFAULT: "var(--lime)",
          deep: "var(--lime-deep)",
          wash: "var(--lime-wash)",
        },
      },
      fontFamily: {
        // wired to next/font in layout.tsx (see kit). Fraunces = display, Inter = body.
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        photo: "var(--shadow)",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      fontSize: {
        // fluid display sizes (name/title) — use via arbitrary values or these tokens
        "hero-name": ["clamp(3.4rem, 17vw, 7rem)", { lineHeight: "0.94", letterSpacing: "-0.01em" }],
        "sec-title": ["clamp(2rem, 7vw, 3.2rem)", { lineHeight: "1.06", letterSpacing: "-0.015em" }],
        "count-num": ["clamp(2.4rem, 10vw, 4rem)", { lineHeight: "1" }],
      },
    },
  },
  plugins: [],
};

export default config;
