import { WEDDING } from "@/config/wedding";
import SectionReveal from "./SectionReveal";

// The Day, then the two venues (blessing + reception). Stacked with dividers on
// phone, side by side with a vertical divider on desktop. Each Maps button never
// dead-ends: it falls back to a Google Maps search until Leon supplies a pin.
function mapsHref(name: string, city: string, url: string) {
  return (
    url ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${city}`)}`
  );
}

export default function Details() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-[12vh]">
      <SectionReveal>
        <div className="text-center">
          <p className="text-[0.66rem] font-medium uppercase tracking-[0.28em] text-sage">
            The Day
          </p>
          <p className="mt-4 font-display text-2xl font-light text-ink">
            {WEDDING.dateDisplay}
          </p>
          <p className="mt-2 text-sm text-ink-soft">{WEDDING.timeDisplay}</p>
        </div>

        <span aria-hidden className="mx-auto my-12 block h-px w-16 bg-line" />

        <div className="grid gap-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-line">
          <Venue
            label="The Blessing"
            name={WEDDING.venue}
            city={WEDDING.venueCity}
            href={mapsHref(WEDDING.venue, WEDDING.venueCity, WEDDING.venueMapsUrl)}
            className="border-b border-line pb-10 md:border-b-0 md:px-10 md:pb-0"
          />
          <Venue
            label="The Reception"
            name={WEDDING.receptionVenue}
            city={WEDDING.receptionCity}
            href={mapsHref(WEDDING.receptionVenue, WEDDING.receptionCity, WEDDING.receptionMapsUrl)}
            className="pt-10 md:px-10 md:pt-0"
          />
        </div>
      </SectionReveal>
    </section>
  );
}

function Venue({
  label, name, city, href, className,
}: { label: string; name: string; city: string; href: string; className?: string }) {
  return (
    <div className={`text-center ${className ?? ""}`}>
      <p className="text-[0.66rem] font-medium uppercase tracking-[0.28em] text-sage">
        {label}
      </p>
      <p className="mt-4 font-display text-xl font-light leading-snug text-ink">{name}</p>
      <p className="mt-2 text-sm text-ink-soft">{city}</p>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mt-5 inline-flex items-center overflow-hidden rounded-full border border-ink/25 px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-ink transition-transform duration-200 ease-soft active:scale-[0.98]"
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
  );
}
