import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isAuthed, ADMIN_COOKIE } from "@/lib/auth";
import { getSql, ensureProgramme } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Load the current programme (admin editor).
export async function GET() {
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await ensureProgramme();
    const sql = getSql();
    const items = await sql`SELECT title, detail FROM programme ORDER BY position ASC`;
    return NextResponse.json({ items });
  } catch (e) {
    console.error("programme load failed:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Replace the whole programme (handles edit / add / remove / reorder at once),
// then revalidate the public page so guests see the change within moments.
export async function PUT(req: Request) {
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const raw = Array.isArray(body.items) ? body.items : null;
  if (!raw) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const clean = raw
    .map((it: { title?: unknown; detail?: unknown }) => ({
      title: String(it?.title ?? "").trim(),
      detail: String(it?.detail ?? "").trim(),
    }))
    .filter((it: { title: string }) => it.title.length > 0);

  try {
    await ensureProgramme();
    const sql = getSql();
    await sql.begin(async (tx) => {
      await tx`DELETE FROM programme`;
      for (let i = 0; i < clean.length; i++) {
        await tx`INSERT INTO programme (position, title, detail) VALUES (${i}, ${clean[i].title}, ${clean[i].detail || null})`;
      }
    });
    revalidatePath("/");
    return NextResponse.json({ ok: true, count: clean.length });
  } catch (e) {
    console.error("programme save failed:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
