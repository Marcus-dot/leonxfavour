"use client";

import { useState } from "react";
import { WEDDING } from "@/config/wedding";
import type { RsvpRow } from "@/lib/db";

function sideLabel(side: string | null) {
  if (side === "favour") return `${WEDDING.bride}'s side`;
  if (side === "leon") return `${WEDDING.groom}'s side`;
  return null;
}

// Normalise a contact into a WhatsApp number (Zambia). Returns "" for email / none.
function waNumber(contact: string | null) {
  const d = (contact || "").replace(/[^\d]/g, "");
  if (!d) return "";
  if (d.startsWith("260")) return d;
  if (d.startsWith("0")) return "260" + d.slice(1);
  if (d.length === 9) return "260" + d;
  return d;
}

function confirmationMessage(name: string, reference: string | null) {
  return (
    `Hello ${name}, your RSVP for ${WEDDING.groom} & ${WEDDING.bride}'s wedding is confirmed. ` +
    `Reference: ${reference || "(pending)"}. ` +
    `Please keep this message and present it at the entrance.`
  );
}

type Filter = "all" | "yes" | "no" | "favour" | "leon";

export default function Dashboard({ rows: initialRows, dbError }: { rows: RsvpRow[]; dbError: boolean }) {
  const [rows, setRows] = useState(initialRows);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const total = rows.length;
  const accepted = rows.filter((r) => r.attending === "yes").length;
  const declined = rows.filter((r) => r.attending === "no").length;
  const favour = rows.filter((r) => r.side === "favour").length;
  const leon = rows.filter((r) => r.side === "leon").length;
  const confirmed = rows.filter((r) => r.confirmed).length;

  const visible = rows.filter((r) => {
    if (filter === "yes" || filter === "no") return r.attending === filter;
    if (filter === "favour" || filter === "leon") return r.side === filter;
    return true;
  });

  async function remove(r: RsvpRow) {
    if (!window.confirm(`Delete ${r.name}'s RSVP? This can't be undone.`)) return;
    setDeleting(r.id);
    const res = await fetch(`/api/admin/rsvp/${r.id}`, { method: "DELETE" });
    if (res.ok) setRows((rs) => rs.filter((x) => x.id !== r.id));
    else window.alert("Couldn't delete that one. Please try again.");
    setDeleting(null);
  }

  function sendConfirmation(r: RsvpRow) {
    const phone = waNumber(r.contact);
    if (!phone) {
      window.alert(`${r.name} left an email (no phone), so WhatsApp isn't possible for them.`);
      return;
    }
    const text = encodeURIComponent(confirmationMessage(r.name, r.reference));
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
    setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, confirmed: true } : x)));
    fetch(`/api/admin/rsvp/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmed: true }),
    }).catch(() => {});
  }

  function exportCsv() {
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = ["Name", "Contact", "Attending", "Side", "Reference", "Confirmed", "Note", "Submitted"];
    const lines = [header.map(esc).join(",")];
    for (const r of rows) {
      lines.push(
        [
          r.name,
          r.contact,
          r.attending === "yes" ? "Accepted" : "Declined",
          r.side === "favour" ? WEDDING.bride : r.side === "leon" ? WEDDING.groom : "",
          r.reference,
          r.confirmed ? "Yes" : "No",
          r.message,
          new Date(r.created_at).toLocaleString(),
        ]
          .map(esc)
          .join(",")
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <main className="min-h-[100svh] bg-ivory px-5 py-10 text-ink sm:px-8 lg:py-14">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-7">
          <div>
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-sage">
              {WEDDING.groom} <span className="text-lime-deep">&amp;</span> {WEDDING.bride}
            </p>
            <h1 className="mt-1.5 font-display text-4xl font-light leading-none">The guest list</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCsv}
              disabled={total === 0}
              className="rounded-full border border-ink/20 px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:border-ink/50 disabled:opacity-40"
            >
              Export CSV
            </button>
            <button
              onClick={logout}
              className="rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-sage transition-colors hover:text-ink"
            >
              Log out
            </button>
          </div>
        </header>

        {dbError ? (
          <div className="mt-10 rounded-2xl border border-line bg-paper p-6 text-sm leading-relaxed text-ink-soft">
            Couldn&rsquo;t reach the database. Make sure <code className="rounded bg-ivory px-1.5 py-0.5">DATABASE_URL</code>{" "}
            is set in the Vercel project, then reload.
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Stat label="Total" value={total} />
              <Stat label="Accepted" value={accepted} accent />
              <Stat label="Declined" value={declined} />
              <Stat label={`${WEDDING.bride}'s side`} value={favour} />
              <Stat label={`${WEDDING.groom}'s side`} value={leon} />
              <Stat label="Confirmed" value={confirmed} />
            </div>

            {/* Filters */}
            <div className="mt-8 flex flex-wrap gap-2">
              {(
                [
                  ["all", `All (${total})`],
                  ["yes", `Accepted (${accepted})`],
                  ["no", `Declined (${declined})`],
                  ["favour", `${WEDDING.bride} (${favour})`],
                  ["leon", `${WEDDING.groom} (${leon})`],
                ] as [Filter, string][]
              ).map(([key, text]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                    filter === key
                      ? "bg-ink text-ivory"
                      : "border border-line text-ink-soft hover:border-ink/30"
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>

            {/* List */}
            {total === 0 ? (
              <p className="mt-20 text-center text-sm text-sage">No RSVPs yet.</p>
            ) : visible.length === 0 ? (
              <p className="mt-20 text-center text-sm text-sage">None in this view.</p>
            ) : (
              <ul className="mt-6 space-y-3">
                {visible.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-ink/15"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-display text-xl font-light">{r.name}</p>
                        {r.contact && <p className="mt-0.5 truncate text-sm text-ink-soft">{r.contact}</p>}
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                          r.attending === "yes"
                            ? "bg-lime-wash text-lime-deep"
                            : "bg-line/60 text-ink-soft"
                        }`}
                      >
                        {r.attending === "yes" ? "Accepted" : "Declined"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-sage">
                      {sideLabel(r.side) && <span>{sideLabel(r.side)}</span>}
                      {r.reference && (
                        <span className="rounded bg-ivory px-2 py-0.5 font-medium tracking-wide text-ink">
                          {r.reference}
                        </span>
                      )}
                      <span>{new Date(r.created_at).toLocaleDateString()}</span>
                      {r.confirmed && <span className="font-medium text-lime-deep">✓ Confirmed</span>}
                    </div>

                    {r.message && (
                      <p className="mt-3 border-l-2 border-line pl-3 text-sm italic text-ink-soft">
                        {r.message}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-2">
                      {r.attending === "yes" && (
                        <button
                          onClick={() => sendConfirmation(r)}
                          className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                            r.confirmed
                              ? "border-lime-deep/30 bg-lime-wash text-lime-deep"
                              : "border-ink/20 text-ink hover:border-lime-deep/50 hover:text-lime-deep"
                          }`}
                        >
                          {r.confirmed ? "✓ Sent · Resend" : "Send confirmation"}
                        </button>
                      )}
                      <button
                        onClick={() => remove(r)}
                        disabled={deleting === r.id}
                        className="ml-auto rounded-full px-3 py-1.5 text-xs font-medium text-sage transition-colors hover:text-[#B0564E] disabled:opacity-40"
                      >
                        {deleting === r.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-paper px-4 py-5 text-center">
      <div className={`font-display text-[2.2rem] font-light leading-none ${accent ? "text-lime-deep" : "text-ink"}`}>
        {value}
      </div>
      <div className="mt-2 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-sage">{label}</div>
    </div>
  );
}
