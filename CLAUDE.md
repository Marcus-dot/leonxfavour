# CLAUDE.md — leonxfavour

Digital wedding invitation microsite for **Leon & Favour Chansa**. One long, elegant, phone-first scroll: loader → hero → their proposal story (6 photos) → details → schedule → RSVP → FAQ. Read `BUILD-SPEC.md` for the full brief; this file is the always-on guardrail.

## The five rules (do not violate)

1. **Phone-first.** Design at ~390px, then scale up. Most guests are on phones on mobile data.
2. **White + lime green.** Ivory/white does ~90% of the work. Lime is ONE rationed accent (see budget below). If it looks like a startup or a sports brand, there's too much lime.
3. **No template smell.** Banned: terracotta/cream + Playfair; identical rounded cards with one grey shadow; ALL-CAPS eyebrow above every heading; `→` glued to buttons; fade-up on every element; middle-dot meta strings as decoration; tinted-black standing in for the ink token.
4. **Photos are the star, shown 1→6 in order.** The bride wants the sequence intact. Never reorder or crop faces out.
5. **Elegant, not busy.** ONE orchestrated motion moment (loader→hero). Everything else quiet.

## Stack
Next.js (App Router) + TypeScript · Tailwind + CSS-var tokens · Framer Motion (reveals + loader) · next/image (webp in `/public/story/`) · next/font (Fraunces + Inter) · RSVP → Formspree or DRF. Deploy: Vercel.

## Tokens (from globals.css — never invent colours)
`--ivory #FBFAF6` · `--paper #FFF` · `--ink #1A1D18` · `--ink-soft #3E4239` · `--sage #8A8F82` · `--line #E4E2D8` · `--lime #A6D608` · `--lime-deep #5A7302` · `--lime-wash #F2F7E2`
Ease: `cubic-bezier(.22,.61,.36,1)`.

## Lime budget (the ENTIRE allowance — nowhere else)
1. Loader fill · 2. ~50px rule under hero names · 3. countdown numerals (deep) + the `&` in names (bright, small) · 4. story caption index numbers (deep italic) · 5. schedule timeline dots · 6. RSVP selected chip + submit + corner glow · 7. FAQ + icon + footer rule/hashtag.
**Bright `--lime` fails text contrast on white — never use it for body/large text. Lime text on ivory = `--lime-deep` only.**

## Type
Fraunces (display: names, titles, captions, invite line) · Inter (everything functional). Don't accent one word in a headline. Uppercase only on small Inter labels, sparingly. Body under ~66 chars/line.

## Config
Everything couple/date/venue lives in `src/config/wedding.ts`. Never hardcode names/dates/venue in components. Lines marked ⚠️ are placeholders pending Leon.

## Quality floor (don't call a section done without)
Responsive 360px→desktop, no horizontal scroll · `100svh` hero · `viewport-fit=cover` + safe-area insets · visible keyboard focus · `prefers-reduced-motion` honoured (kill zoom/reveals/loader fill) · countdown SSR-safe (em-dashes until mounted, never NaN) · RSVP tested end-to-end with a fallback contact on failure · Lighthouse mobile perf 90+ (compress images, lazy-load below hero).

## Motion
One hero load sequence. Elsewhere: gentle scroll-reveal (opacity + ~32px rise, ~1s, IntersectionObserver, once, on section blocks NOT every list item). Hover flourishes: story photo zoom + button fills only.

## Build order
tokens+fonts → loader→hero (nail this first) → story → countdown/details/schedule → RSVP+backend+test → FAQ/footer → reduced-motion + Lighthouse + real-device + deploy.
## Motion & award-craft (see MOTION-SPEC.md — read it in full)
Target: "sexiest premium thing they've seen" = art direction + DIRECTED MOTION + 60fps, all three. The model is By-Kin restraint (weighted smooth scroll, editorial type, transitions that make it feel like one continuous surface), NOT WebGL spectacle. A wedding invite on WhatsApp data must load fast.

Stack (keep this small): Lenis (smooth scroll) + Framer Motion (reveals/parallax/mask-rises) + native CSS (hovers). NO GSAP, NO Three.js, NO WebGL — wrong tool, too heavy, dies on mobile.

The signature moves (don't ship plain fades instead):
- Hero: loader→hero is ONE continuous move (photo scales 1.15→1.0 as loader dissolves). Names do a line-MASK-RISE (text rises out of overflow:hidden), staggered — not opacity fades. Then lime rule draws, meta rises. Subtle 12s ambient zoom after.
- Story: each photo reveals via clip-path wipe + inner image settling 1.1→1.0; caption line mask-rises 0.15s later; inner image parallaxes ~6-10% slower on scroll.
- Smooth scroll (Lenis, lerp .1) is the biggest premium tell. Disable entirely under reduced-motion.
- Buttons: lime fill wipes up from bottom (scaleY on pseudo), press scale .98.

Performance budget (a section isn't done if it breaks these): 60fps on mid-range Android (test DevTools CPU 4x + Fast 3G); animate ONLY transform/opacity; hero photo is LCP (priority, <2.5s); reduced-motion kills Lenis+parallax+clip+zoom and renders final state instantly; test on a REAL phone before "done". One ease everywhere: cubic-bezier(.22,.61,.36,1). Staggers small (0.08–0.15s).
