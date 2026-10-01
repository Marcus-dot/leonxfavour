"use client";

import { useState } from "react";

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
      setError("Incorrect password.");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-ivory px-6">
      <form onSubmit={submit} className="w-full max-w-sm text-center">
        <p className="mb-2 text-[0.66rem] font-medium uppercase tracking-[0.28em] text-sage">
          Leon &amp; Favour
        </p>
        <h1 className="mb-8 font-display text-3xl font-light text-ink">RSVP list</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink outline-none transition-colors focus:border-lime-deep"
        />
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-4 w-full rounded-full bg-ink py-3.5 font-medium text-ivory transition-opacity disabled:opacity-50"
        >
          {busy ? "Checking…" : "View RSVPs"}
        </button>
        <p className="mt-4 min-h-[1.2em] text-sm text-[#B0564E]">{error}</p>
      </form>
    </main>
  );
}
