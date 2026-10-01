"use client";

import { useState } from "react";
import { WEDDING } from "@/config/wedding";
import type { RsvpRow } from "@/lib/db";

function sideLabel(side: string | null) {
  if (side === "favour") return `${WEDDING.bride}'s side`;
  if (side === "leon") return `${WEDDING.groom}'s side`;
  return "-";
}

// Normalise a contact into a WhatsApp number (Zambia). Returns "" if the guest
// gave an email / no usable number.
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

export default function Dashboard({ rows: initialRows, dbError }: { rows: RsvpRow[]; dbError: boolean }) {
  const [rows, setRows] = useState(initialRows);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function remove(r: RsvpRow) {
    if (!window.confirm(`Delete ${r.name}'s RSVP? This can't be undone.`)) return;
    setDeleting(r.id);
    const res = await fetch(`/api/admin/rsvp/${r.id}`, { method: "DELETE" });
    if (res.ok) {
      setRows((rs) => rs.filter((x) => x.id !== r.id));
    } else {
      window.alert("Couldn't delete that one. Please try again.");
    }
    setDeleting(null);
  }

  function sendConfirmation(r: RsvpRow) {
    const phone = waNumber(r.contact);
    if (!phone) {
      window.alert(`${r.name} didn't leave a phone number (email only), so WhatsApp isn't possible for them.`);
      return;
    }
    const text = encodeURIComponent(confirmationMessage(r.name, r.reference));
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
    // Mark confirmed optimistically (Leon can still re-send later).
    setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, confirmed: true } : x)));
    fetch(`/api/admin/rsvp/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmed: true }),
    }).catch(() => {});
  }

  const total = rows.length;
  const accepted = rows.filter((r) => r.attending === "yes").length;
  const declined = rows.filter((r) => r.attending === "no").length;
  const favour = rows.filter((r) => r.side === "favour").length;
  const leon = rows.filter((r) => r.side === "leon").length;

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
    <main className="min-h-[100svh] bg-ivory px-5 py-10 text-ink sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.28em] text-sage">
              Leon &amp; Favour
            </p>
            <h1 className="font-display text-3xl font-light">RSVPs</h1>
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
          <div className="mt-10 rounded-2xl border border-line bg-paper p-6 text-sm text-ink-soft">
            Couldn&rsquo;t reach the database. Make sure <code>DATABASE_URL</code> is set in the
            Vercel project settings, then reload.
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <Stat label="Total" value={total} />
              <Stat label="Accepted" value={accepted} accent />
              <Stat label="Declined" value={declined} />
              <Stat label={`${WEDDING.bride}'s side`} value={favour} />
              <Stat label={`${WEDDING.groom}'s side`} value={leon} />
            </div>

            {total === 0 ? (
              <p className="mt-16 text-center text-sm text-sage">No RSVPs yet.</p>
            ) : (
              <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-paper">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-[0.62rem] uppercase tracking-[0.14em] text-sage">
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Contact</th>
                      <th className="px-4 py-3 font-medium">Attending</th>
                      <th className="px-4 py-3 font-medium">Side</th>
                      <th className="px-4 py-3 font-medium">Reference</th>
                      <th className="px-4 py-3 font-medium">Note</th>
                      <th className="px-4 py-3 font-medium">Submitted</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="border-b border-line/60 last:border-0 align-top">
                        <td className="px-4 py-3 font-medium">{r.name}</td>
                        <td className="px-4 py-3 text-ink-soft">{r.contact || "-"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              r.attending === "yes"
                                ? "rounded-full bg-lime-wash px-2.5 py-1 text-xs font-medium text-lime-deep"
                                : "rounded-full bg-line/60 px-2.5 py-1 text-xs font-medium text-ink-soft"
                            }
                          >
                            {r.attending === "yes" ? "Accepted" : "Declined"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-ink-soft">{sideLabel(r.side)}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">
                          {r.reference || "-"}
                        </td>
                        <td className="max-w-[16rem] px-4 py-3 text-ink-soft">{r.message || "-"}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sage">
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            {r.attending === "yes" && (
                              <button
                                onClick={() => sendConfirmation(r)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
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
                              aria-label={`Delete ${r.name}'s RSVP`}
                              className="rounded-full px-2.5 py-1 text-xs font-medium text-sage transition-colors hover:bg-[#B0564E]/10 hover:text-[#B0564E] disabled:opacity-40"
                            >
                              {deleting === r.id ? "…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4 text-center">
      <div className={`font-display text-3xl font-light ${accent ? "text-lime-deep" : "text-ink"}`}>
        {value}
      </div>
      <div className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-sage">
        {label}
      </div>
    </div>
  );
}
