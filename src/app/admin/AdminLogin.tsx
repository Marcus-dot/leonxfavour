"use client";

import { useState } from "react";
import { WEDDING } from "@/config/wedding";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setError("That password doesn't match.");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen-svh items-center justify-center bg-ivory px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-sage">
            {WEDDING.groom} <span className="text-lime-deep">&amp;</span> {WEDDING.bride}
          </p>
          <h1 className="mt-3 font-display text-[2.6rem] font-light leading-none text-ink">
            The guest list
          </h1>
          <span aria-hidden className="mx-auto mt-5 block h-px w-12 bg-lime" />
        </div>

        <form onSubmit={submit} className="mt-10">
          <label htmlFor="pw" className="mb-2 block text-[0.66rem] font-medium uppercase tracking-[0.18em] text-sage">
            Password
          </label>
          <input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter to continue"
            autoFocus
            className="w-full rounded-xl border border-line bg-paper px-4 py-3.5 text-ink outline-none transition-colors placeholder:text-sage/60 focus:border-lime-deep"
          />
          <button
            type="submit"
            disabled={busy || !password}
            className="mt-4 w-full rounded-full bg-ink py-3.5 text-sm font-medium tracking-wide text-ivory transition-all hover:bg-ink-soft active:scale-[0.99] disabled:opacity-40"
          >
            {busy ? "Checking…" : "View RSVPs"}
          </button>
          <p className="mt-4 min-h-[1.2em] text-center text-sm text-[#B0564E]">{error}</p>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-sage">
          Private dashboard for {WEDDING.groom}, {WEDDING.bride} and family.
        </p>
      </div>
    </main>
  );
}
