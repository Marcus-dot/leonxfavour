import { NextResponse } from "next/server";
import { getSql, ensureTable } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stores one RSVP. Accepts the JSON the RsvpForm sends. Honeypot submissions
// are silently accepted (so bots think they succeeded) but never stored.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Honeypot: real users leave this empty.
  if (body.website) return NextResponse.json({ ok: true });

  const name = String(body.name ?? "").trim();
  const attending = String(body.attending ?? "");
  const side = String(body.side ?? "");
  const contact = String(body.contact ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || (attending !== "yes" && attending !== "no")) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  try {
    await ensureTable();
    const sql = getSql();
    await sql`
      INSERT INTO rsvps (name, contact, attending, side, message)
      VALUES (${name}, ${contact || null}, ${attending}, ${side || null}, ${message || null})
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("RSVP insert failed:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
