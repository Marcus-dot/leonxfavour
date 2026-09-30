// src/config/wedding.ts
// -----------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH. Every component reads from here.
// Nothing about the couple/date/venue should be hardcoded in components.
// Lines marked ⚠️ are placeholders — confirm with Leon before sharing the link.
// -----------------------------------------------------------------------------

export interface StoryFrame {
  src: string;
  alt: string;
  caption: string;
}

export const WEDDING = {
  // ---- Couple -------------------------------------------------------------
  groom: "Leon",
  bride: "Favour",
  surname: "Chansa",            // ⚠️ CONFIRM — read off the "Future Mrs Chansa" bouquet (photo 5)
  hashtag: "#TheChansas",       // ⚠️ CONFIRM

  // ---- Date & time --------------------------------------------------------
  // dateISO drives the countdown. Keep it a valid ISO datetime.
  // If the real date is unknown, the countdown renders em-dashes gracefully.
  dateISO: "2026-12-19T14:00:00",   // ⚠️ PLACEHOLDER — real date unknown ("soon")
  dateDisplay: "December 2026",     // ⚠️ PLACEHOLDER — e.g. "Saturday, 19 December 2026"
  timeDisplay: "Time to be confirmed", // ⚠️ N/A per Leon — e.g. "2:00 PM"
  dateConfirmed: false,             // set true once dateISO/dateDisplay are final

  // ---- Venue --------------------------------------------------------------
  venue: "Waterfalls Place",
  venueCity: "Lusaka, Zambia",
  venueMapsUrl: "",                 // ⚠️ need a Google Maps link (e.g. https://maps.app.goo.gl/…)

  // ---- RSVP ---------------------------------------------------------------
  rsvpDeadline: "Kindly respond by 30 November 2026", // ⚠️ need a real date
  // Leave rsvpEndpoint empty for demo mode (front-end only, no submit).
  // Formspree: "https://formspree.io/f/xxxxxx"
  // Your DRF:  "/api/rsvp/"
  rsvpEndpoint: "",                 // ⚠️ set before launch
  // Fallback shown if the RSVP submit fails (so no response is ever lost):
  rsvpFallbackContact: "WhatsApp us at +260 …", // ⚠️ Leon's number
} as const;

// ---- Our Story: photos 1→6 IN ORDER (the bride's requested sequence) -------
// Captions are Leon's to review/reword. Keep them short.
export const STORY: StoryFrame[] = [
  { src: "/story/1.webp", alt: "Leon by the 'Will You Marry Me?' floral heart",     caption: "The question, asked." },
  { src: "/story/2.webp", alt: "Placing the ring on Favour's hand",                 caption: "And the answer we already knew." },
  { src: "/story/3.webp", alt: "Leon kissing Favour's hand",                        caption: "A promise, sealed." },
  { src: "/story/4.webp", alt: "The ring, with the neon sign behind",               caption: "Yes — a thousand times." },
  { src: "/story/5.webp", alt: "The bouquet ribbon reading 'Future Mrs Chansa'",    caption: "Future Mrs Chansa." },
  { src: "/story/6.webp", alt: "Leon and Favour embracing",                         caption: "Forward, together." },
];

// Hero uses photo 6 (the embrace).
export const HERO_IMAGE = "/story/6.webp";

// ---- Schedule (times provisional until ceremony time is confirmed) ---------
export const SCHEDULE = [
  { time: "1:30 PM", title: "Guests Arrive",        note: "Find your seat and settle in" },
  { time: "2:00 PM", title: "The Ceremony",         note: "The moment we say I do" },
  { time: "3:30 PM", title: "Cocktails & Photos",   note: "Celebrate while we capture the day" },
  { time: "5:00 PM", title: "Reception & Dinner",   note: "Food, toasts and dancing" },
] as const;
export const SCHEDULE_PROVISIONAL = true; // shows the "times to be confirmed" note

// ---- FAQ (Leon to confirm answers) -----------------------------------------
export const FAQ = [
  { q: "What should I wear?", a: "The dress code is formal. Our colours are white and lime green — you're warmly invited to lean into the palette, though it's not required. We'd gently ask guests to avoid full bridal white." },
  { q: "Can I bring a plus-one?", a: "Please check your invitation — it will say if a guest is included. If you're unsure, just reach out to us directly." },
  { q: "Are the ceremony and reception at the same place?", a: "Yes. Everything takes place at Waterfalls Place, so there's no travel between events on the day." },
  { q: "What time should I arrive?", a: "Please aim to be seated at least twenty minutes before the ceremony begins so we can start on time." },
  { q: "Is there parking?", a: "Yes, parking is available at the venue. Details to follow closer to the day." },
] as const;
