import { cookies } from "next/headers";
import type { Metadata } from "next";
import { isAuthed, ADMIN_COOKIE } from "@/lib/auth";
import { getSql, ensureTable, type RsvpRow } from "@/lib/db";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "RSVPs", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const authed = isAuthed(cookies().get(ADMIN_COOKIE)?.value);
  if (!authed) return <AdminLogin />;

  let rows: RsvpRow[] = [];
  let dbError = false;
  try {
    await ensureTable();
    const sql = getSql();
    const data = await sql<RsvpRow[]>`
      SELECT id, name, contact, attending, side, message, reference, confirmed, created_at
      FROM rsvps
      ORDER BY created_at DESC
    `;
    rows = data.map((r) => ({ ...r, created_at: new Date(r.created_at).toISOString() }));
  } catch (e) {
    console.error("Admin load failed:", e);
    dbError = true;
  }

  return <Dashboard rows={rows} dbError={dbError} />;
}
