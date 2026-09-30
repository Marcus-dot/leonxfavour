import { WEDDING } from "@/config/wedding";
import SectionReveal from "./SectionReveal";

// The Day / The Place. Stacked with a horizontal divider on phone, side by side
// with a vertical divider on desktop. The Maps button never dies: it falls back
// to a Google Maps search for the venue until Leon supplies an exact link.
export default function Details() {
  const mapsHref =
    WEDDING.venueMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${WEDDING.venue} ${WEDDING.venueCity}`
    )}`;

  return (
    <section className="mx-auto max-w-4xl px-6 py-[12vh]">
      <SectionReveal>
        <div className="grid gap-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-line">
          <div className="border-b border-line pb-10 text-center md:border-b-0 md:px-10 md:pb-0">
            <p className="text-[0.66rem] font-medium uppercase tracking-[0.28em] text-sage">
              The Day
            </p>
            <p className="mt-4 font-display text-2xl font-light text-ink">
              {WEDDING.dateDisplay}
            </p>
            <p className="mt-2 text-sm text-ink-soft">{WEDDING.timeDisplay}</p>
          </div>

          <div className="pt-10 text-center md:px-10 md:pt-0">
            <p className="text-[0.66rem] font-medium uppercase tracking-[0.28em] text-sage">
              The Place
            </p>
            <p className="mt-4 font-display text-2xl font-light text-ink">
              {WEDDING.venue}
            </p>
            <p className="mt-2 text-sm text-ink-soft">{WEDDING.venueCity}</p>

            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-6 inline-flex items-center overflow-hidden rounded-full border border-ink/25 px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-ink transition-transform duration-200 ease-soft active:scale-[0.98]"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-[400ms] ease-soft group-hover:scale-y-100"
              />
              <span className="relative transition-colors duration-[400ms] ease-soft group-hover:text-ivory">
                Open in Maps
              </span>
            </a>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
