// src/config/wedding.ts
// -----------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH. Every component reads from here.
// Nothing about the couple/date/venue should be hardcoded in components.
// Lines marked ⚠️ are placeholders, confirm with Leon before sharing the link.
// -----------------------------------------------------------------------------

export interface StoryFrame {
  src: string;
  alt: string;
  caption: string;
  width: number;  // intrinsic px, drives aspect ratio so faces are never cropped
  height: number;
}

export const WEDDING = {
  // ---- Couple -------------------------------------------------------------
  groom: "Leon",
  bride: "Favour",
  surname: "Chansa",            // ⚠️ CONFIRM, read off the "Future Mrs Chansa" bouquet (photo 5)
  hashtag: "#TheChansas",       // ⚠️ CONFIRM

  // ---- Date & time --------------------------------------------------------
  // dateISO drives the countdown. The displayed invite time is 9:30hrs (per
  // Leon) so guests are seated for the 10:00hrs blessing, never surface 10:00.
  dateISO: "2026-10-10T09:30:00",   // Sat 10 Oct 2026, invite time 9:30hrs
  dateDisplay: "Saturday, 10th October, 2026",
  timeDisplay: "9:30hrs",           // invite time (actual blessing 10:00hrs, do not display)
  dateConfirmed: true,              // date & time final

  // ---- Venues -------------------------------------------------------------
  // Two venues: the marriage blessing (ceremony), then the reception.
  venue: "Lifeline Community Fellowship Church", // blessing / ceremony
  venueCity: "Lusaka, Zambia",
  venueMapsUrl: "",                 // ⚠️ Leon to share the blessing location link
  receptionVenue: "Waterfalls Place", // reception
  receptionCity: "Lusaka, Zambia",
  receptionMapsUrl: "",             // ⚠️ reception location link

  // ---- RSVP ---------------------------------------------------------------
  rsvpDeadline: "Kindly respond by Tuesday, 6th October",
  // RSVP contact numbers, shown in the RSVP section. While the form is in demo
  // mode these are how guests actually respond, so they're surfaced, not hidden.
  rsvpContacts: ["+260 97 7694819", "+260 96 8399657"],
  // Leave rsvpEndpoint empty for demo mode (front-end only, no submit).
  // Formspree: "https://formspree.io/f/xxxxxx"
  // Your DRF:  "/api/rsvp/"
  rsvpEndpoint: "/api/rsvp",        // custom admin backend (needs DATABASE_URL set)
  // Fallback shown if the RSVP submit fails (so no response is ever lost):
  rsvpFallbackContact: "WhatsApp us on +260 97 7694819 or +260 96 8399657",
} as const;

// ---- Our Story: photos 1→6 IN ORDER (the bride's requested sequence) -------
// Captions are Leon's to review/reword. Keep them short.
export const STORY: StoryFrame[] = [
  { src: "/story/1.webp", alt: "Leon by the 'Will You Marry Me?' floral heart",     caption: "The question, asked.",            width: 1034, height: 1400 },
  { src: "/story/2.webp", alt: "Placing the ring on Favour's hand",                 caption: "And the answer we already knew.", width: 1153, height: 1364 },
  { src: "/story/3.webp", alt: "Leon kissing Favour's hand",                        caption: "A promise, sealed.",             width: 1187, height: 1326 },
  { src: "/story/4.webp", alt: "The ring, with the neon sign behind",               caption: "Yes, a thousand times.",        width: 1180, height: 1333 },
  { src: "/story/5.webp", alt: "The bouquet ribbon reading 'Future Mrs Chansa'",    caption: "Future Mrs Chansa.",             width: 1050, height: 1400 },
  { src: "/story/6.webp", alt: "Leon and Favour embracing",                         caption: "Forward, together.",             width: 931,  height: 1400 },
];

// Hero uses photo 6 (the embrace).
export const HERO_IMAGE = "/story/6.webp";

// ---- Schedule (times provisional until ceremony time is confirmed) ---------
export const SCHEDULE = [
  { time: "9:30hrs",   title: "Marriage Blessing",       note: "Lifeline Community Fellowship Church" },
  { time: "17:00hrs", title: "Reception & Celebration", note: "Waterfalls Place, Lusaka" },
] as const;
export const SCHEDULE_PROVISIONAL = false; // times now confirmed by Leon

// ---- FAQ (Leon to confirm answers) -----------------------------------------
export const FAQ = [
  { q: "Can I bring a plus-one?", a: "Each invitation admits one person, so we're unable to accommodate plus-ones. Thank you for understanding, it helps us keep the day intimate." },
  { q: "What about gifts?", a: "Your presence is the greatest gift. For those who wish to bless us further, we warmly welcome a contribution from a minimum of K500, placed in an envelope." },
  { q: "What time should I arrive?", a: "Please aim to be seated by 9:30hrs so the blessing can begin on time." },
  { q: "Where does the day take place?", a: "The marriage blessing is held at Lifeline Community Fellowship Church, and the reception follows at Waterfalls Place, both in Lusaka. Location links will be shared closer to the day." },
  { q: "What should I wear?", a: "There's no dress code, simply come in whatever makes you feel wonderful and ready to celebrate with us." },
  { q: "Can I bring my children?", a: "As much as we adore your little ones, we've chosen to make this an adults-only celebration. We hope it gives you a chance to relax and enjoy the day with us." },
] as const;
