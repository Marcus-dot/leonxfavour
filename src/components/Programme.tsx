import { getProgramme } from "@/lib/db";
import SectionReveal from "./SectionReveal";

// Reception order of proceedings. A quiet numbered list (no lime, off budget),
// two columns on desktop in reading order, single column on phone. Items come
// from the DB (editable in /admin/programme), falling back to the config
// default so guests always see a valid programme.
export default async function Programme() {
  const PROGRAMME = await getProgramme();
  return (
    <section className="mx-auto max-w-3xl px-6 py-[12vh]">
      <SectionReveal>
        <header className="mb-12 text-center">
          <p className="text-[0.66rem] font-medium uppercase tracking-[0.28em] text-sage">
            At the reception
          </p>
          <h2 className="mt-3 font-display text-sec-title font-light text-ink">
            Order of Proceedings
          </h2>
        </header>

        <ol className="md:columns-2 md:gap-14">
          {PROGRAMME.map((item, i) => (
            <li
              key={item.title}
              className="flex break-inside-avoid gap-4 border-b border-line/60 py-3.5"
            >
              <span className="w-6 shrink-0 pt-1 text-xs text-sage [font-variant-numeric:tabular-nums]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-display text-base font-light leading-snug text-ink">
                  {item.title}
                </p>
                {item.detail && <p className="mt-1 text-sm text-sage">{item.detail}</p>}
              </div>
            </li>
          ))}
        </ol>
      </SectionReveal>
    </section>
  );
}
