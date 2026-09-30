import { SCHEDULE, SCHEDULE_PROVISIONAL } from "@/config/wedding";
import SectionReveal from "./SectionReveal";

// Vertical timeline: time on the left, event on the right, a lime dot on the
// line at each node (soft glow + ivory ring). One block reveal — not per item.
export default function Schedule() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-[12vh]">
      <SectionReveal>
        <h2 className="mb-12 text-center font-display text-sec-title font-light text-ink">
          How the day unfolds
        </h2>

        <ol className="mx-auto max-w-md">
          {SCHEDULE.map((item, i) => (
            <li key={item.title} className="grid grid-cols-[4.5rem_1fr] gap-5">
              <span className="pt-[2px] text-right text-sm text-ink-soft [font-variant-numeric:tabular-nums]">
                {item.time}
              </span>
              <div
                className={`relative border-l border-line pl-7 ${
                  i === SCHEDULE.length - 1 ? "pb-0" : "pb-10"
                }`}
              >
                <span
                  aria-hidden
                  className="absolute -left-[7px] top-[5px] h-3.5 w-3.5 rounded-full bg-lime ring-4 ring-ivory"
                  style={{ boxShadow: "0 0 12px 2px rgba(166, 214, 8, 0.45)" }}
                />
                <p className="font-display text-xl font-light leading-tight text-ink">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-sage">{item.note}</p>
              </div>
            </li>
          ))}
        </ol>

        {SCHEDULE_PROVISIONAL && (
          <p className="mx-auto mt-10 max-w-sm text-center text-xs italic leading-relaxed text-sage">
            Times are provisional and will be confirmed closer to the day.
          </p>
        )}
      </SectionReveal>
    </section>
  );
}
