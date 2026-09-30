# leonxfavour — Wedding Invitation Microsite
### Design & build brief for Claude Code

A digital wedding invitation for **Leon & Favour Chansa**. Guests (mostly on phones) land on a beautiful loader, then scroll one long, elegant page: names + countdown, their proposal story told through six sequenced photos, the day's details, schedule, RSVP, and FAQ.

This document is the source of truth. Build to it. A working visual prototype accompanies it — match its *feel*, improve on its *engineering*.

---

## 0. Non-negotiables (the brief in one breath)

- **Phone-first.** Design every section at ~390px wide first, then let it breathe up to desktop. Most guests open this on a phone.
- **White + lime green.** Ivory/white does ~90% of the work. Lime green is *one confident accent*, never a wash. If it starts looking like a tech startup or a sports brand, you've used too much.
- **No template smell.** No stock-y AI defaults: no terracotta/cream+Playfair combo, no identical rounded cards with the same grey shadow, no ALL-CAPS eyebrow above every heading, no `→` glued to buttons, no fade-up on literally every element.
- **The photos are the star.** Six real photos, shown *in their given order 1→6* — the bride wants them to tell the story in sequence. Don't reorder, don't crop faces out.
- **Elegant, not busy.** One memorable motion moment (the loader→hero handoff). Everything else quiet.

---

## 1. Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Your stack; static export friendly; good image handling |
| Styling | **Tailwind + CSS variables for tokens** | Tokens below map cleanly to `:root` vars; Tailwind for layout speed |
| Animation | **Framer Motion** for reveals + loader; **native CSS** for hovers | GSAP is overkill here; Framer covers scroll reveals and the loader sequence |
| Images | **next/image**, photos in `/public/story/` as optimized `.webp` (~1400px long edge, q80) | The raw uploads are 2–6 MB each; compress or the site crawls on Zambian mobile data |
| Fonts | **next/font** (self-hosted Google fonts) | No layout shift, no external request |
| RSVP backend | **Formspree** (fastest) or a small **Django/DRF endpoint** you already know | See §9 |
| Hosting | **Vercel** (or Netlify) from the `leonxfavour` repo | Zero-config for Next; free tier is plenty |

> **Performance is a design decision here.** Target: usable first paint on a mid-range Android over 4G. Compress images hard, lazy-load everything below the hero, keep JS light.

---

## 2. Design tokens

```css
:root{
  /* base */
  --ivory:      #FBFAF6;  /* page background — warm white, not blue-white */
  --paper:      #FFFFFF;  /* pure white for the darkest-photo contrast moments */
  --ink:        #1A1D18;  /* near-black, warm/olive-leaning — NOT #000, NOT blue-black */
  --ink-soft:   #3E4239;  /* body text on light */
  --sage:       #8A8F82;  /* secondary/muted text, captions, labels */
  --line:       #E4E2D8;  /* hairline dividers */

  /* the one accent — used sparingly */
  --lime:       #A6D608;  /* the bright lime — GLOWS, rules, active states, the fill. Never large text. */
  --lime-deep:  #5A7302;  /* deep olive-lime — safe for text on ivory (passes contrast) */
  --lime-wash:  #F2F7E2;  /* barely-there lime tint for a rare section background */
}
```

**Contrast rule:** bright `--lime` (#A6D608) fails text contrast on white. Only ever use it for: the loader fill, the thin rule under the names, countdown *numerals* on the dark panel, RSVP selected-chip background, hover glows, the timeline dots. For any lime *text* on ivory, use `--lime-deep`.

**Where lime is allowed to appear (the whole budget):**
1. Loader progress fill
2. A ~50px rule under the hero names
3. Countdown numerals (deep) / the `&` in names (bright, small)
4. Story caption index numbers (deep, italic)
5. Schedule timeline dots
6. RSVP: selected chip + submit button + radial glow in the dark panel corner
7. FAQ expand icon + footer rule/hashtag

That's it. If it's somewhere else, question it.

---

## 3. Typography

Two families, clearly distinct:

- **Display — `Fraunces`** (variable, optical sizing on). Weights 300/400, italic available. Used for: names, section titles, story captions, the invitation line, schedule event titles, FAQ questions. Fraunces has warmth and a bit of character — it avoids the overused Playfair "wedding default" while staying classic.
- **Body/UI — `Inter`.** Weights 300–600. Used for: everything functional — meta rows, labels, form fields, notes, buttons.

**Type scale (fluid, clamp-based):**

| Role | Font | Size (`clamp`) | Weight | Notes |
|---|---|---|---|---|
| Hero names | Fraunces | `clamp(3.4rem, 17vw, 7rem)` | 300 | line-height ~0.94, stacked |
| Section title | Fraunces | `clamp(2rem, 7vw, 3.2rem)` | 300 | letter-spacing -0.015em |
| Invitation line | Fraunces *italic* | `clamp(1.4rem, 5vw, 2.1rem)` | 300 | line-height 1.5 |
| Story caption | Fraunces | `clamp(1.15rem, 4vw, 1.5rem)` | 300 | |
| Countdown number | Fraunces | `clamp(2.4rem, 10vw, 4rem)` | 400 | tabular-nums |
| Body / notes | Inter | 0.9–1rem | 400 | color `--ink-soft` or `--sage` |
| Label / meta | Inter | 0.66–0.82rem | 500 | letter-spacing 0.16–0.28em, *this* is where uppercase is OK (sparingly) |

**Avoid these tells:** don't accent a single word in a headline in a different color/italic; don't put an ALL-CAPS eyebrow above *every* heading (one or two, max, and only where it's a real label); no meta strings joined with middle-dots as decoration.

Body line length: keep under ~66 characters. Give Fraunces body a touch more line-height than Inter.

---

## 4. Page structure (single long scroll)

```
┌─────────────────────────────┐
│  LOADER (overlay, ~2.4s)    │  names fade in · lime line fills · "loading our story"
├─────────────────────────────┤
│  HERO (100svh)              │  full-bleed photo 6 (the embrace) · slow zoom
│    "Together with families" │  eyebrow
│    Leon & Favour            │  huge stacked serif, lime & between
│    ── lime rule ──          │
│    Date · Waterfalls Place  │
│    ↓ scroll                 │
├─────────────────────────────┤
│  INVITE + COUNTDOWN         │  ivory · italic invite line · 4-cell countdown · #TheChansas
├─────────────────────────────┤
│  OUR STORY  (photos 1–6)    │  "How we got here" · alternating L/R photo + caption
│    01 The question, asked.  │  (single column on phone, 2-col on desktop)
│    02 …                     │
│    …through 06              │
├─────────────────────────────┤
│  THE DAY / THE PLACE        │  two details, hairline divider · "Open in Maps" ghost btn
├─────────────────────────────┤
│  SCHEDULE                   │  vertical timeline · lime dots · provisional-times note
├─────────────────────────────┤
│  RSVP  (dark panel)         │  ink bg · lime accents · name / contact / attending /
│                             │  party size / note · lime submit
├─────────────────────────────┤
│  FAQ                        │  native <details> accordion · lime + icon
├─────────────────────────────┤
│  FOOTER (dark)              │  Leon & Favour · lime rule · date · #TheChansas
└─────────────────────────────┘
```

**Alignment:** hero and section heads **centered** (weddings earn centered; it reads as ceremony, not as a generated-landing-page default). Story captions **left/right aligned** to alternate with their photo. RSVP form left-aligned labels.

**No sticky nav.** It's one short page; a nav bar adds template chrome. Optionally a single "RSVP" pill that appears after the hero and scrolls to the form — only if Leon wants it.

---

## 5. Section detail

### Loader
- Covers viewport, `--ivory` background. Sequence: names (`Leon & Favour`) fade up → thin lime line fills L→R over ~1.7s → "Loading our story" label.
- Dismiss on `window.load` **+ min display ~2.4s** so it's felt, not skipped. Hard safety timeout at 5s so a slow asset never traps a guest. Fade out over ~0.9s revealing the hero.
- `prefers-reduced-motion`: show it static, dismiss fast (~200ms).

### Hero
- Full-bleed **photo 6** (the embrace — warmest, most editorial). `object-position` ~center 30% so faces sit in frame on tall phones.
- Dark gradient scrim bottom→top so white text stays legible over any photo.
- Entrance is the *one orchestrated moment*: eyebrow → "Leon" → "&" → "Favour" → rule grows → meta, staggered ~0.2s each, starting as the loader clears. Slow 9s background zoom (scale 1.08→1).
- Meta row: `{Date} · Waterfalls Place`. Date is a placeholder until Leon confirms (see §7).

### Invite + Countdown
- One italic Fraunces line of warm invitation copy. Then a 4-cell countdown (Days / Hours / Minutes / Seconds), numerals in `--lime-deep`, tabular-nums so they don't jitter. `#TheChansas` below.
- Countdown reads from a single `WEDDING_DATE` constant. If the date is unset/invalid, render em-dashes gracefully (don't show `NaN`).

### Our Story  ← the heart of the site
- Heading: "How we got here" + sub "Six frames, in the order she wanted them told."
- Six figures, photos **1→6 in order**, captions:
  1. The question, asked. *(photo 1 — him waiting by the "Will You Marry Me?" heart)*
  2. And the answer we already knew. *(photo 2 — the ring going on)*
  3. A promise, sealed. *(photo 3 — kissing her hand)*
  4. Yes — a thousand times. *(photo 4 — ring on hand, neon behind)*
  5. Future Mrs Chansa. *(photo 5 — the bouquet ribbon)*
  6. Forward, together. *(photo 6 — the embrace)*
- **Phone:** single column, photo then caption, generous vertical rhythm (~10vh between).
- **Desktop (≥800px):** 2-col, photo and caption alternate sides (odd=photo left, even=photo right). Caption = italic deep-lime index number + serif line.
- Subtle: photo scales 1.04 on hover (desktop only), 1.4s ease. That's the only hover flourish in the whole site.
- These are Leon's real captions to review/reword — keep them short.

### The Day / The Place
- Two blocks between hairline rules. "THE DAY" → date + time. "THE PLACE" → Waterfalls Place, Lusaka. Ghost "Open in Maps" button (needs a real Maps link from Leon).
- On phone: stacked with a horizontal divider. Desktop: side by side with a vertical divider.

### Schedule
- Vertical timeline, time on the left (~28% col), event on the right, lime dot on the line at each node with a soft glow + ivory ring.
- **Times are provisional** (ceremony time still N/A) — include the italic note: "Times are provisional and will be confirmed closer to the day." Remove once real.

### RSVP  ← the one functional thing
- **Dark panel** (`--ink` bg) to make it feel like the moment of commitment, with a faint lime radial glow in one corner.
- Fields: Full name (req) · Email or phone (req) · Attending? (two chips: "Joyfully accept" / "Regretfully decline", req) · Number in party (select) · Note (optional textarea).
- Selected chip = lime bg, ink text. Submit = lime button, ink text.
- Inline validation, polite `aria-live` status message. On success, disable the form and thank them by first name.
- Deadline line up top (needs a real date). See §9 for wiring.

### FAQ
- Native `<details>/<summary>` accordion (accessible, no JS needed). Lime "+" that rotates/collapses to "−" on open. Hairline between items.
- Starter Qs (in prototype): dress code (white + lime green, avoid bridal white), plus-ones, same venue for both, arrival time, parking. Leon to confirm answers.

### Footer
- Dark. "Leon & Favour" in serif, lime rule, date + venue meta, `#TheChansas`.

---

## 6. Motion rules

- **One hero moment** on load. Everything else: gentle scroll-reveal (opacity + 32px rise, ~1s ease, `IntersectionObserver`, fire once, threshold ~0.15).
- **Do NOT** fade-up every card and add a hover transition to everything — that's the generated-page tell. Reveals on section blocks, not on each list item.
- Hover flourishes: story photo zoom, button fills. Nothing else.
- **Respect `prefers-reduced-motion`**: kill the zoom, the reveals (show everything), the loader fill animation. Non-negotiable for accessibility.
- Ease everywhere: `cubic-bezier(.22,.61,.36,1)`.

---

## 7. Placeholders Leon must fill (get these before build day)

Put all of these in a single `src/config/wedding.ts` so nothing is hardcoded in components:

```ts
export const WEDDING = {
  groom: "Leon",
  bride: "Favour",
  surname: "Chansa",                 // CONFIRM — read off the "Future Mrs Chansa" bouquet
  hashtag: "#TheChansas",            // confirm
  dateISO: "2026-12-19T14:00",       // ⚠️ PLACEHOLDER — real date unknown ("soon")
  dateDisplay: "December 2026",      // ⚠️ PLACEHOLDER
  timeDisplay: "Time to be confirmed",// ⚠️ N/A per Leon
  venue: "Waterfalls Place",
  venueCity: "Lusaka, Zambia",
  venueMapsUrl: "",                  // ⚠️ need a Google Maps link
  rsvpDeadline: "Kindly respond by …",// ⚠️ need a date
  rsvpEndpoint: "",                  // ⚠️ Formspree ID or your DRF endpoint
};
```

**Chase Leon for:** exact date, ceremony time, Maps link, RSVP deadline, whether captions/FAQ answers are approved, and confirmation of the **Chansa** surname + hashtag.

---

## 8. Assets

- Six photos → `/public/story/1.webp … 6.webp`, ~1400px long edge, quality ~80. (Raw uploads are 2–6MB; unoptimized they'll wreck load time on mobile data.)
- Hero uses photo 6. Story uses 1–6 in order.
- Generate an OG/social share image (photo 6 + names) so the link previews nicely when Leon shares it on WhatsApp — guests *will* share it there.
- Favicon: a simple 🤍 or a tiny lime monogram.

---

## 9. RSVP wiring (pick one)

**Fastest — Formspree:** create a form, drop the endpoint in `rsvpEndpoint`, POST the fields. Responses land in Leon's email + a dashboard. ~10 min.

**Your stack — DRF:** a single `POST /api/rsvp/` writing to an `Rsvp` model (name, contact, attending bool, party_size, message, created_at). You already run Django/DRF daily — trivial, and Leon gets a real list you can export. Add basic rate-limiting + a honeypot field since the endpoint is public.

Either way: never lose an RSVP to a JS error — if the fetch fails, show a fallback ("please WhatsApp us at …") rather than a dead button.

---

## 10. Quality floor (don't ship without)

- Responsive 360px → desktop, no horizontal scroll at any width.
- `100svh` not `100vh` for the hero (mobile browser chrome).
- `viewport-fit=cover` + safe-area insets (notch phones).
- Visible keyboard focus states; RSVP fully keyboard-usable; labels tied to inputs.
- `prefers-reduced-motion` honored everywhere.
- Real `<title>`, meta description, OG tags.
- Lighthouse: aim 90+ perf on mobile. Compress images, lazy-load below hero.
- Test the actual RSVP submit end-to-end before sending the link to anyone.

---

## 11. Build order (suggested)

1. Scaffold Next+TS+Tailwind, drop in tokens (`:root` vars) + fonts.
2. `wedding.ts` config + optimized images.
3. Loader → Hero (nail the handoff first; it sets the tone).
4. Story section (the emotional core — get the rhythm right).
5. Countdown, Details, Schedule.
6. RSVP + backend wiring + test.
7. FAQ, Footer.
8. Reduced-motion pass, Lighthouse pass, real-device check, deploy to Vercel.

---

*Accompanying visual prototype shows the intended feel with the real photos. It's a static single-file mock — the Next build is the real thing. Match the mood, beat the engineering.*
