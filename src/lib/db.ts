import postgres from "postgres";
import { PROGRAMME as PROGRAMME_DEFAULT } from "@/config/wedding";

// Lazy singleton Postgres client. Reads DATABASE_URL (use the POOLED connection
// string from Neon/Supabase/Vercel Postgres). Never connects at build time -
// only when an API route or the admin page actually queries.
let _sql: ReturnType<typeof postgres> | null = null;

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  if (!_sql) {
    // Local Postgres has no SSL; hosted (Neon/Supabase/Vercel) requires it.
    const local = url.includes("localhost") || url.includes("127.0.0.1");
    _sql = postgres(url, { ssl: local ? false : "require", max: 1 });
  }
  return _sql;
}

export async function ensureTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS rsvps (
      id         serial PRIMARY KEY,
      name       text NOT NULL,
      contact    text,
      email      text,
      attending  text NOT NULL,
      side       text,
      message    text,
      reference  text,
      confirmed  boolean NOT NULL DEFAULT false,
      idempotency_key text,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  // Migrations for tables created before these columns existed.
  await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS email text`;
  await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS reference text`;
  await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS confirmed boolean NOT NULL DEFAULT false`;
  await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS idempotency_key text`;
  // Dedupe retries/double-taps: one row per idempotency key (NULLs are distinct).
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS rsvps_idem_key_uniq ON rsvps (idempotency_key)`;
}

export interface ProgrammeItem {
  title: string;
  detail: string | null;
}

// Creates the programme table and seeds it from the config default the first
// time (so the admin starts with the current programme to edit).
export async function ensureProgramme() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS programme (
      id       serial PRIMARY KEY,
      position int NOT NULL,
      title    text NOT NULL,
      detail   text
    )
  `;
  const [{ count }] = await sql<{ count: number }[]>`SELECT count(*)::int AS count FROM programme`;
  if (count === 0) {
    for (let i = 0; i < PROGRAMME_DEFAULT.length; i++) {
      const item = PROGRAMME_DEFAULT[i];
      await sql`INSERT INTO programme (position, title, detail) VALUES (${i}, ${item.title}, ${item.detail ?? null})`;
    }
  }
}

// Programme for the public page. Falls back to the config default if the DB is
// empty or unreachable, so guests always see a valid programme.
export async function getProgramme(): Promise<ProgrammeItem[]> {
  try {
    await ensureProgramme();
    const sql = getSql();
    const rows = await sql<ProgrammeItem[]>`SELECT title, detail FROM programme ORDER BY position ASC`;
    if (rows.length > 0) return rows.map((r) => ({ title: r.title, detail: r.detail }));
  } catch (e) {
    console.error("getProgramme failed, using config fallback:", e);
  }
  return PROGRAMME_DEFAULT.map((p) => ({ title: p.title, detail: p.detail ?? null }));
}

export interface RsvpRow {
  id: number;
  name: string;
  contact: string | null; // phone (used for WhatsApp)
  email: string | null;
  attending: string;
  side: string | null;
  message: string | null;
  reference: string | null;
  confirmed: boolean;
  created_at: string;
}
