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

    // Demo mode, no endpoint configured yet.
    if (!WEDDING.rsvpEndpoint) {
      setStatus("success");
      setMessage(
        attending === "yes"
          ? `Thank you, ${firstName}. We can't wait to celebrate with you.`
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
          party_size: 1, // one person per card, no plus-ones
          message: data.get("message") || "",
          website: data.get("website") || "", // honeypot, stays empty for humans
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      setMessage(
        attending === "yes"
          ? `Thank you, ${firstName}. We can't wait to celebrate with you.`
          : `Thank you for letting us know, ${firstName}. You'll be missed.`
      );
      form.reset();
    } catch {
      setStatus("error");
      setMessage(`Something went wrong. Please ${WEDDING.rsvpFallbackContact}.`);
    }
  }

  const done = status === "success";

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-xl">
      {/* honeypot: visually hidden, not display:none (bots skip display:none) */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website<input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field id="name" label="Full name" required placeholder="Your name" disabled={done} />
      <Field id="email" label="Email or phone" required placeholder="So we can reach you" disabled={done} />

      <fieldset className="mb-6" disabled={done}>
        <span className="mb-3 block text-xs font-medium uppercase tracking-[0.14em] text-ivory/65">
          Will you attend?
        </span>
        <div className="flex flex-wrap gap-3">
          <Chip name="attending" value="yes" label="Joyfully accept" />
          <Chip name="attending" value="no" label="Regretfully decline" />
        </div>
      </fieldset>


      <div className="mb-6">
        <label htmlFor="message" className="mb-3 block text-xs font-medium uppercase tracking-[0.14em] text-ivory/65">
          A note for us <span className="normal-case tracking-normal text-ivory/40">(optional)</span>
        </label>
        <textarea
          id="message" name="message" rows={3} disabled={done}
          placeholder="Anything you'd like us to know"
          className="w-full rounded-sm border border-ivory/25 bg-transparent p-3 text-ivory outline-none placeholder:text-ivory/30 focus:border-lime"
        />
      </div>

      {!done && (
        <button
          type="submit" disabled={status === "submitting"}
          className="mt-2 w-full rounded-full bg-lime py-4 font-semibold text-ink transition-colors duration-300 ease-soft hover:bg-[#B9E52A] disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send RSVP"}
        </button>
      )}

      <p role="status" aria-live="polite" className="mt-5 min-h-[1.2em] text-center text-sm text-lime">
        {message}
      </p>
    </form>
  );
}

function Field({
  id, label, required, placeholder, disabled,
}: { id: string; label: string; required?: boolean; placeholder?: string; disabled?: boolean }) {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="mb-3 block text-xs font-medium uppercase tracking-[0.14em] text-ivory/65">
        {label}
      </label>
      <input
        id={id} name={id} type="text" required={required} placeholder={placeholder} disabled={disabled}
        className="w-full border-b border-ivory/25 bg-transparent py-2 text-ivory outline-none placeholder:text-ivory/30 focus:border-lime"
      />
    </div>
  );
}

function Chip({ name, value, label }: { name: string; value: string; label: string }) {
  return (
    <label className="relative flex-1 cursor-pointer" style={{ minWidth: 140 }}>
      <input type="radio" name={name} value={value} required className="peer absolute opacity-0" />
      <span className="block rounded-full border border-ivory/25 px-4 py-3.5 text-center text-sm text-ivory transition-all duration-300 ease-soft peer-checked:border-lime peer-checked:bg-lime peer-checked:font-medium peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-lime">
        {label}
      </span>
    </label>
  );
}
