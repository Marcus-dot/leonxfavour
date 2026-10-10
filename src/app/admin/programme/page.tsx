import { cookies } from "next/headers";
import type { Metadata } from "next";
import { isAuthed, ADMIN_COOKIE } from "@/lib/auth";
import { getProgramme } from "@/lib/db";
import AdminLogin from "../AdminLogin";
import ProgrammeEditor from "./ProgrammeEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit programme", robots: { index: false, follow: false } };

export default async function ProgrammeAdminPage() {
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) return <AdminLogin />;
  const items = await getProgramme();
  return <ProgrammeEditor initial={items} />;
}
