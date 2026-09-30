import Intro from "@/components/Intro";
import Story from "@/components/Story";
import { WEDDING } from "@/config/wedding";

export default function Home() {
  return (
    <main>
      {/* Loader → Hero (step 2) */}
      <Intro />

      {/* Our Story — photos 1→6 (step 3) */}
      <Story />

      {/* Placeholder for the sections that follow — replaced in the next steps. */}
      <section className="flex min-h-[40svh] flex-col items-center justify-center px-6 text-center">
        <span aria-hidden className="mb-6 block h-px w-10 bg-line" />
        <p className="max-w-xs text-sm leading-relaxed text-sage">
          Invite, countdown, the day, schedule, RSVP and FAQ arrive next.
        </p>
        <p className="mt-4 text-xs uppercase tracking-[0.24em] text-sage/70">
          {WEDDING.hashtag}
        </p>
      </section>
    </main>
  );
}
