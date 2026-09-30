# START HERE — Claude Code session setup

Everything's prepped. Follow these steps in your `~/projects/leonxfavour` folder.

## 1. Drop the kit files in place

From this kit, place files like so (create folders as needed):

```
leonxfavour/
├── CLAUDE.md                      ← from kit (root)
├── BUILD-SPEC.md                  ← from kit (root, reference)
├── public/
│   ├── story/1.webp … 6.webp      ← from kit /story
│   └── og.jpg                     ← generate later (1200×630, photo 6 + names)
└── src/
    ├── config/wedding.ts          ← from kit
    ├── app/globals.css            ← from kit
    ├── hooks/useCountdown.ts      ← from kit
    └── components/RsvpForm.tsx    ← from kit
tailwind.config.ts                 ← from kit (root)
```

`fonts-layout-snippet.tsx` and `rsvp-backend-drf.py` are reference snippets, not drop-in files — Claude Code will fold them into `layout.tsx` / your Django app.

## 2. Paste this as your first Claude Code message

> Scaffold a Next.js 14 (App Router) + TypeScript + Tailwind project in this folder for a phone-first wedding invitation microsite. Read `CLAUDE.md` and `BUILD-SPEC.md` first — they are the source of truth, follow them exactly.
>
> The kit files are already in place: `src/config/wedding.ts` (all content), `src/app/globals.css` (design tokens), `tailwind.config.ts`, `src/hooks/useCountdown.ts`, `src/components/RsvpForm.tsx`, and photos in `public/story/1–6.webp`. Use `fonts-layout-snippet.tsx` to wire `layout.tsx` (next/font: Fraunces + Inter).
>
> Build in this order, and pause after each so I can review on my phone: (1) project scaffold + tokens + fonts wired, (2) Loader → Hero with the orchestrated load sequence — get this feeling right before moving on, (3) Our Story section (photos 1→6 in order, alternating sides on desktop, single column on phone), (4) Invite+Countdown, The Day/The Place, Schedule, (5) RSVP section wrapping the existing RsvpForm, (6) FAQ + Footer, (7) reduced-motion pass + Lighthouse mobile + deploy prep.
>
> Respect the lime budget in CLAUDE.md strictly. Start with step 1.

## 3. RSVP: fastest path (Formspree, ~10 min)

1. Sign up at formspree.io, create a form, copy its endpoint (`https://formspree.io/f/xxxxxx`).
2. Put it in `wedding.ts` → `rsvpEndpoint`.
3. Set `rsvpFallbackContact` to Leon's WhatsApp number.
4. Done — responses go to Leon's email + Formspree dashboard. The form already POSTs the right shape.

Switch to the DRF backend (`rsvp-backend-drf.py`) later only if Leon wants an exportable database — same `wedding.ts` field, just point it at `/api/rsvp/`.

## 4. Before you send the link to anyone

- [ ] Real date + time in `wedding.ts` (`dateConfirmed: true`)
- [ ] Google Maps link + RSVP deadline
- [ ] Confirm surname **Chansa** + `#TheChansas`
- [ ] Leon approves the 6 captions + FAQ answers
- [ ] RSVP submit tested end-to-end (accept AND decline)
- [ ] `og.jpg` generated (it'll be shared on WhatsApp — the preview matters)
- [ ] Real-device check: an actual Android phone, not just DevTools
- [ ] Lighthouse mobile perf ≥ 90

## Deploy
Push to the `leonxfavour` GitHub repo → import in Vercel → it auto-builds. Custom domain optional (e.g. leonandfavour.com) — Vercel handles the DNS + SSL.
