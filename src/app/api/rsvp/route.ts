import { NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { getSql, ensureTable } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Short, readable reference (no ambiguous chars like O/0/I/1/L), e.g. LF-K7F2.
function makeReference() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) code += alphabet[randomInt(alphabet.length)];
  return `LF-${code}`;
}

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
  const contact = String(body.contact ?? "").trim(); // phone
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !contact || (attending !== "yes" && attending !== "no")) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  try {
    await ensureTable();
    const sql = getSql();
    const reference = makeReference();
    await sql`
      INSERT INTO rsvps (name, contact, email, attending, side, message, reference)
      VALUES (${name}, ${contact}, ${email || null}, ${attending}, ${side || null}, ${message || null}, ${reference})
    `;
    return NextResponse.json({ ok: true, reference });
  } catch (e) {
    console.error("RSVP insert failed:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
