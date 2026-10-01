import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAuthed, ADMIN_COOKIE } from "@/lib/auth";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 });
  }
  try {
    const sql = getSql();
    await sql`DELETE FROM rsvps WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("RSVP delete failed:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Mark a row confirmed / unconfirmed (set when Leon sends the WhatsApp note).
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 });
  }
  const body = await req.json().catch(() => ({}));
  const confirmed = Boolean(body.confirmed);
  try {
    const sql = getSql();
    await sql`UPDATE rsvps SET confirmed = ${confirmed} WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("RSVP update failed:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
