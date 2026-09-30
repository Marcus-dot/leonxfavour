// src/components/RsvpForm.tsx
// Works in 3 modes based on WEDDING.rsvpEndpoint:
//   ""            -> demo mode (no network; thanks the user client-side)
//   Formspree URL -> POST JSON to Formspree
//   "/api/rsvp/"  -> POST JSON to your DRF endpoint
// If the network submit fails, shows the fallback contact so no RSVP is lost.
"use client";

import { useState } from "react";
import { WEDDING } from "@/config/wedding";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD =
  "w-full rounded-xl border border-ivory/15 bg-ivory/[0.03] px-4 py-3.5 text-ivory outline-none transition-colors duration-300 ease-soft placeholder:text-ivory/30 focus:border-lime/70 focus:bg-ivory/[0.06]";

export default function RsvpForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const attending = data.get("attending");
    if (!name || !attending) {
      setStatus("error");
      setMessage("Please add your name and let us know if you can make it.");
      return;
    }
    const firstName = name.split(" ")[0];

    // Demo mode — no endpoint configured yet.
    if (!WEDDING.rsvpEndpoint) {
      setStatus("success");
      setMessage(
        attending === "yes"
          ? `Thank you, ${firstName} — we can't wait to celebrate with you.`
          : `Thank you for letting us know, ${firstName}. You'll be missed.`
      );
      form.reset();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(WEDDING.rsvpEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          contact: data.get("email"),
          attending,
          party_size: Number(data.get("guests") || 1),
          message: data.get("message") || "",
          website: data.get("website") || "", // honeypot — stays empty for humans
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      setMessage(
        attending === "yes"
          ? `Thank you, ${firstName} — we can't wait to celebrate with you.`
          : `Thank you for letting us know, ${firstName}. You'll be missed.`
      );
      form.reset();
    } catch {
      setStatus("error");
      setMessage(`Something went wrong. Please ${WEDDING.rsvpFallbackContact}.`);
    }
  }

  const done = status === "success";
  const error = status === "error";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-xl rounded-[28px] border border-ivory/10 bg-ivory/[0.02] p-6 sm:p-8"
    >
      {/* honeypot: visually hidden, not display:none (bots skip display:none) */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website<input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" placeholder="Your name" disabled={done} required />
        <Field id="email" label="Email or phone" placeholder="So we can reach you" disabled={done} required />
      </div>

      <fieldset className="mt-5" disabled={done}>
        <Label>Will you attend?</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Chip name="attending" value="yes" label="Joyfully accept" />
          <Chip name="attending" value="no" label="Regretfully decline" />
        </div>
      </fieldset>

      <div className="mt-5">
        <label htmlFor="guests" className="mb-2 block">
          <Label>Number in your party</Label>
        </label>
        <div className="relative">
          <select
            id="guests"
            name="guests"
            disabled={done}
            defaultValue="1"
            className={`${FIELD} cursor-pointer appearance-none pr-11`}
          >
            <option value="1" className="bg-ink text-ivory">Just me</option>
            {[2, 3, 4, 5].map((n) => (
              <option key={n} value={n} className="bg-ink text-ivory">
                {n === 5 ? "5 or more" : `${n} of us`}
              </option>
            ))}
          </select>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory/45"
          >
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="mb-2 block">
          <Label>
            A note for us <span className="font-normal normal-case tracking-normal text-ivory/35">(optional)</span>
          </Label>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          disabled={done}
          placeholder="Anything you'd like us to know"
          className={`${FIELD} resize-none rounded-2xl`}
        />
      </div>

      {!done && (
        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-7 w-full rounded-full bg-lime py-4 font-semibold text-ink transition-all duration-300 ease-soft hover:bg-[#B9E52A] active:scale-[0.99] disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send our RSVP"}
        </button>
      )}

      <p
        role="status"
        aria-live="polite"
        className={`mt-5 min-h-[1.2em] text-center text-sm ${
          error ? "text-[#E8B4B4]" : "text-lime"
        }`}
      >
        {message}
      </p>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.16em] text-ivory/55">
      {children}
    </span>
  );
}

function Field({
  id, label, required, placeholder, disabled,
}: { id: string; label: string; required?: boolean; placeholder?: string; disabled?: boolean }) {
  return (
    <div>
      <label htmlFor={id}>
        <Label>{label}</Label>
      </label>
      <input
        id={id}
        name={id}
        type="text"
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className={FIELD}
      />
    </div>
  );
}

function Chip({ name, value, label }: { name: string; value: string; label: string }) {
  return (
    <label className="relative cursor-pointer">
      <input type="radio" name={name} value={value} required className="peer absolute opacity-0" />
      <span className="block rounded-full border border-ivory/20 px-4 py-3.5 text-center text-sm text-ivory transition-all duration-300 ease-soft peer-checked:border-lime peer-checked:bg-lime peer-checked:font-medium peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-lime">
        {label}
      </span>
    </label>
  );
}
