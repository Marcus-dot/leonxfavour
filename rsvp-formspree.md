# RSVP via Formspree (v1 — fastest)

1. formspree.io → sign up (free tier: 50 submissions/mo).
2. New form → name it "Leon & Favour RSVP" → copy endpoint, e.g. https://formspree.io/f/mabc1234
3. wedding.ts → rsvpEndpoint: "https://formspree.io/f/mabc1234"
4. wedding.ts → rsvpFallbackContact: "WhatsApp us at +260 97X XXX XXX"

RsvpForm.tsx already sends: name, contact, attending, party_size, message, website(honeypot).
Formspree accepts JSON and emails Leon each response; dashboard exports CSV.

If you outgrow the free tier or want the data in your own DB, swap to the DRF
backend (rsvp-backend-drf.py) — same wedding.ts field, point it at /api/rsvp/.
