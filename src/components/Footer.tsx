import { WEDDING } from "@/config/wedding";
import SectionReveal from "./SectionReveal";

// Dark footer, shares the ink background with the RSVP panel above so the two
// read as one continuous dark passage. Lime spent only on the rule and the
// hashtag (budgeted) + the small & in the names.
export default function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto max-w-3xl px-6 pb-[max(4rem,env(safe-area-inset-bottom))] pt-24 text-center">
        <SectionReveal>
          <p className="font-display text-[clamp(2.2rem,8vw,3.2rem)] font-light leading-none">
            {WEDDING.groom} <span className="text-lime">&amp;</span> {WEDDING.bride}
          </p>

          <span aria-hidden className="mx-auto my-8 block h-px w-16 bg-lime" />

          <p className="text-sm text-ivory/60">{WEDDING.dateDisplay}</p>
          <p className="mt-1 text-sm text-ivory/60">{WEDDING.venueCity}</p>

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.3em] text-lime">
            {WEDDING.hashtag}
          </p>
        </SectionReveal>
      </div>
    </footer>
  );
}
