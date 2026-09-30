# MOTION & INTERACTION SPEC — leonxfavour
### The award-craft layer. Read alongside BUILD-SPEC.md and CLAUDE.md.

The brief is "the sexiest premium thing they've ever seen." Based on how Awwwards
sites are actually judged, that means **three things at once** — miss one and it
caps out at "nice":

1. **Art direction** — a specific point of view (BUILD-SPEC covers this).
2. **Directed motion** — choreography, not effects bolted on. ← this document.
3. **Performance** — 60fps on a mid-range phone. ← the guardrails below, non-negotiable.

> The reference is **restraint that reads as expensive** (the By-Kin model:
> "confident editorial typography, weighted smooth scroll, and transitions that
> never call attention to themselves yet make the whole thing feel like a single
> continuous surface"). NOT WebGL spectacle. A wedding invite opened on WhatsApp
> data in Lusaka must load fast and hit 60fps, or the "premium" is a lie. Beauty
> at 60fps is the whole discipline.

---

## Hard performance budget (a section is not "done" if it breaks these)

- **60fps** on a mid-range Android. Test: DevTools → Performance → CPU 4× slowdown + Fast 3G. If it stutters, cut the effect.
- Only ever animate **`transform` and `opacity`** (GPU-composited). Never animate `width`, `height`, `top`, `left`, `margin`, `filter`, `box-shadow` on scroll — they trigger layout/paint and kill the framerate.
- Add `will-change: transform` **only** to the element mid-animation, and remove it after. Never blanket it.
- Total JS for motion: keep it lean. Framer Motion + Lenis is plenty. **No Three.js, no WebGL, no GSAP** for this project — wrong tool, too heavy, and the payoff isn't there for a photo-led invite.
- Largest Contentful Paint under ~2.5s on 4G. The hero photo is the LCP — it must be `priority` in next/image, preloaded, and already compressed (it is).
- Respect `prefers-reduced-motion` on **every** effect here. A broken reduced-motion path is an instant juror fail.

---

## 1. Smooth scroll (the single biggest "premium" tell)

Momentum/weighted scroll is what makes award sites feel like "one continuous surface" instead of a stack of divs. This is the highest-leverage single addition.

- Use **Lenis** (`@studio-freight/lenis`, ~edge-light). Wrap the app once.
- Settings: `lerp: 0.1` (weighted but not sluggish), `duration: ~1.2`, `smoothWheel: true`. On touch, keep it subtle or native — over-smoothed touch scroll feels laggy on phones, which is the opposite of premium. Test on a real phone and dial `syncTouch`/`smoothTouch` down if it feels heavy.
- **Disable Lenis entirely under `prefers-reduced-motion`** (fall back to native scroll).
- Drive scroll-linked animations off Lenis's scroll event (or Framer's `useScroll`) so everything shares one timeline.

## 2. Hero — the load-to-hero handoff

This is the first impression; it earns the most craft. The loader→hero should feel like **one continuous move**, not "loader disappears, then hero appears."

- Loader sits on the ivory. As it completes, the hero photo **scales from ~1.15→1.0 over ~1.8s** on the same ease while the scrim fades in — so the loader dissolving *becomes* the hero. Don't cut between them; cross them.
- Names: a **line-mask reveal**, not a fade. Each name in a `overflow:hidden` wrapper, the text rising from 100%→0 `translateY` with a slight stagger (Leon, then &, then Favour). This "text rises out of a mask" move is the editorial signature — it reads far more expensive than opacity fades.
- Then the lime rule draws L→R, then the meta line rises. One clean cascade, ~2s total, then it's still.
- Slow ambient zoom continues *very* subtly on the hero image after load (scale 1.0→1.04 over ~12s, `ease-out`) — a living photo, not a static one. Kill under reduced-motion.

## 3. Story section — the emotional core, most directed motion

Six photos telling a sequence. This is where choreography pays off most.

- **Image reveal:** each photo uncovers via a **clip-path / mask wipe** (e.g. `clip-path: inset(100% 0 0 0)` → `inset(0 0 0 0)`) as it enters, paired with a gentle scale-down of the inner `<img>` from 1.1→1.0. The frame reveals, the image settles — two synced moves. Far richer than a fade-up, still cheap (transform + clip-path only).
- **Caption:** the line rises out of a mask just after its photo begins revealing (~0.15s later). The index number (01–06) fades/rises with a touch more delay. Stagger creates the "directed" feel.
- **Parallax:** as each photo scrolls through the viewport, drift the inner image ~6–10% slower than the frame (`translateY`, scroll-linked). Subtle. This is the depth cue that makes editorial sites feel three-dimensional. Test the framerate — if it dips, reduce or drop it.
- Desktop alternation (photo L / caption R, then swap) already in BUILD-SPEC — keep it; alternate the reveal direction too (odd wipes up, even wipes up but caption enters from its side).

## 4. Section transitions — "continuous surface"

The award tell is that motion lives *between* states, not on the page. Guests should never feel a hard cut.

- Every section block rises into place on a shared reveal (opacity 0→1 + `translateY(40px→0)`, ~0.9s, the house ease), fired once via IntersectionObserver at ~15% threshold. **Section blocks, not every child** — staggering every list item is the AI-generated tell.
- Where two dark sections meet (RSVP, footer), let the ink background bleed continuously so it reads as one dark passage rather than two panels.
- Numbers in the countdown: when they first reveal, a quick mask-rise per cell. After that they just tick (no animation on each second — that'd be noise).

## 5. Micro-interactions (reward attention, don't shout)

- **Buttons:** on hover, a lime fill wipes in from the bottom (`transform: scaleY` on a pseudo-element, `transform-origin: bottom`), text color crosses to ink. ~0.4s house ease. On press, a subtle scale to 0.98. This is a "camera move," not a color swap.
- **RSVP chips:** selected state animates the lime fill in (scale/opacity), not an instant paint.
- **Story photos (desktop):** on hover, inner image scales to 1.04 *and* the caption index shifts a few px — a paired move, so it feels intentional.
- **Custom cursor: NO.** Wrong register for a wedding, and useless on the phones most guests use.
- **FAQ:** the answer height eases open (`grid-template-rows: 0fr→1fr` technique for smooth height, or Framer's layout), the + rotates to ×. Never a snap.

## 6. Type as motion (sparingly — one or two places)

Kinetic type is an Awwwards staple but overused it's exhausting. Use it in exactly **two** places:
- The hero names (mask-rise, above).
- The two big script-feel section titles ("How we got here", "Will you join us?") — a mask-rise on scroll-in. That's it. Everywhere else type is still.

## 7. The details that separate 7.5 from 9

- **Consistent easing.** One ease (`cubic-bezier(.22,.61,.36,1)`) across the whole site. Mixed eases read as amateur.
- **Nothing animates on a timer the user didn't trigger**, except the two ambient moments (hero zoom, and the one-time load cascade). Everything else responds to scroll or input.
- **Stagger is small.** 0.08–0.15s between siblings. Big staggers feel slow and cheap.
- **Kill motion gracefully.** Under `prefers-reduced-motion`: no Lenis, no parallax, no clip reveals, no zoom — everything renders in its final state, instantly, and the site is still beautiful as a set of static frames. (Juror test #1: screenshot the hero — is the *static* frame strong? It must be.)
- **Test on a real phone before calling anything done.** Not DevTools emulation — an actual mid-range Android on real data. This is the test that separates premium from "looked good on my MacBook."

---

## Libraries (the whole motion stack — keep it this small)

- **Lenis** — smooth scroll.
- **Framer Motion** — reveals, mask-rises, `useScroll` parallax, layout transitions.
- Native CSS — hovers, button fills, FAQ.

No GSAP, no Three.js, no WebGL. If a guest's phone can't run it at 60fps, it isn't premium — it's broken. Restraint *is* the luxury here.

---

## Build note for Claude Code

Fold this into the build: add Lenis in step 1 (scaffold), the hero mask-rise + handoff in step 2 (do NOT ship a plain fade hero — the mask-rise is the signature), story clip-reveals + parallax in step 3. Everything else layers the micro-interactions as each section is built. After every section, run the DevTools throttle test and check `prefers-reduced-motion`. A section that's beautiful but drops frames is not done.
