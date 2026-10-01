import postgres from "postgres";

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
      attending  text NOT NULL,
      side       text,
      message    text,
      reference  text,
      confirmed  boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  // Migrations for tables created before these columns existed.
  await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS reference text`;
  await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS confirmed boolean NOT NULL DEFAULT false`;
}

export interface RsvpRow {
  id: number;
  name: string;
  contact: string | null;
  attending: string;
  side: string | null;
  message: string | null;
  reference: string | null;
  confirmed: boolean;
  created_at: string;
}
