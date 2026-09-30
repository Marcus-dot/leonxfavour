import Intro from "@/components/Intro";
import { WEDDING } from "@/config/wedding";

export default function Home() {
  return (
    <main>
      {/* Loader → Hero (step 2) */}
      <Intro />

      {/* Placeholder for the sections that follow — confirms the loader clears
          and the page scrolls past the hero. Replaced in the next steps. */}
      <section className="flex min-h-[60svh] flex-col items-center justify-center px-6 text-center">
        <span aria-hidden className="mb-6 block h-px w-10 bg-line" />
        <p className="max-w-xs text-sm leading-relaxed text-sage">
          The story continues below — invite, countdown, their six frames, the
          day, schedule, RSVP and FAQ arrive in the next steps.
        </p>
        <p className="mt-4 text-xs uppercase tracking-[0.24em] text-sage/70">
          {WEDDING.hashtag}
        </p>
      </section>
    </main>
  );
}
