import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAuthed, ADMIN_COOKIE } from "@/lib/auth";
import { getSql, ensureTable, type RsvpRow } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Current RSVP list as JSON, for the dashboard's live polling. Admin-gated.
export async function GET() {
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await ensureTable();
    const sql = getSql();
    const data = await sql<RsvpRow[]>`
      SELECT id, name, contact, email, attending, side, message, reference, confirmed, created_at
      FROM rsvps
      ORDER BY created_at DESC
    `;
    const rows = data.map((r) => ({ ...r, created_at: new Date(r.created_at).toISOString() }));
    return NextResponse.json({ rows });
  } catch (e) {
    console.error("Admin rsvps fetch failed:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
