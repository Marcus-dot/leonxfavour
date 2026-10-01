import Intro from "@/components/Intro";
import InviteCountdown from "@/components/InviteCountdown";
import Story from "@/components/Story";
import Details from "@/components/Details";
import Schedule from "@/components/Schedule";
import Rsvp from "@/components/Rsvp";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      {/* Loader → Hero (step 2) */}
      <Intro />

      {/* Invite + Countdown (step 4) */}
      <InviteCountdown />

      {/* Our Story — photos 1→6 (step 3) */}
      <Story />

      {/* The Day / The Venues + Schedule (step 4) */}
      <Details />
      <Schedule />

      {/* RSVP — dark panel (step 5) */}
      <Rsvp />

      {/* FAQ + Footer (step 6) — Faq ivory, Footer shares the RSVP ink */}
      <Faq />
      <Footer />
    </main>
  );
}
