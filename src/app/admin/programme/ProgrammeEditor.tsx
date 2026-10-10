"use client";

import { useState } from "react";
import type { ProgrammeItem } from "@/lib/db";

type Item = { title: string; detail: string };

export default function ProgrammeEditor({ initial }: { initial: ProgrammeItem[] }) {
  const [items, setItems] = useState<Item[]>(
    initial.map((i) => ({ title: i.title, detail: i.detail ?? "" }))
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [dirty, setDirty] = useState(false);

  function change(next: Item[]) {
    setItems(next);
    setDirty(true);
    setStatus("idle");
  }
  const edit = (i: number, field: keyof Item, value: string) =>
    change(items.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    change(next);
  };
  const remove = (i: number) => change(items.filter((_, idx) => idx !== i));
  const add = () => change([...items, { title: "", detail: "" }]);

  async function save() {
    setStatus("saving");
    const res = await fetch("/api/admin/programme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (res.ok) {
      setStatus("saved");
      setDirty(false);
    } else {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen-svh bg-ivory px-5 py-10 text-ink sm:px-8 lg:py-14">
      <div className="mx-auto max-w-3xl">
        <header className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-7">
          <div>
            <a href="/admin" className="text-[0.6rem] font-medium uppercase tracking-[0.28em] text-sage transition-colors hover:text-ink">
              ← Back to RSVPs
            </a>
            <h1 className="mt-2 font-display text-4xl font-light leading-none">Edit programme</h1>
          </div>
          <div className="flex items-center gap-3">
            {status === "saved" && !dirty && <span className="text-xs text-lime-deep">Saved ✓</span>}
            {status === "error" && <span className="text-xs text-[#B0564E]">Save failed</span>}
            <button
              onClick={save}
              disabled={status === "saving" || !dirty}
              className="rounded-full bg-ink px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-ivory transition-all hover:bg-ink-soft disabled:opacity-40"
            >
              {status === "saving" ? "Saving…" : "Save changes"}
            </button>
          </div>
        </header>

        <p className="mt-5 text-sm text-ink-soft">
          Edit the wording, add or remove items, and reorder with the arrows. Changes go live on the
          invitation within about a minute of saving.
        </p>

        <ol className="mt-8 space-y-3">
          {items.map((it, i) => (
            <li key={i} className="rounded-2xl border border-line bg-paper p-4">
              <div className="flex items-start gap-3">
                <span className="w-6 shrink-0 pt-3 text-xs text-sage [font-variant-numeric:tabular-nums]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    value={it.title}
                    onChange={(e) => edit(i, "title", e.target.value)}
                    placeholder="Item title"
                    className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm font-medium text-ink outline-none transition-colors focus:border-ink/40"
                  />
                  <input
                    value={it.detail}
                    onChange={(e) => edit(i, "detail", e.target.value)}
                    placeholder="Detail (optional, e.g. a name or role)"
                    className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm text-ink-soft outline-none transition-colors focus:border-ink/40"
                  />
                </div>
                <div className="flex shrink-0 flex-col items-center gap-1 pt-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"
                    className="rounded-md px-2 py-0.5 text-sage transition-colors hover:bg-ivory hover:text-ink disabled:opacity-30">↑</button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down"
                    className="rounded-md px-2 py-0.5 text-sage transition-colors hover:bg-ivory hover:text-ink disabled:opacity-30">↓</button>
                  <button onClick={() => remove(i)} aria-label="Remove"
                    className="rounded-md px-2 py-0.5 text-sage transition-colors hover:bg-[#B0564E]/10 hover:text-[#B0564E]">✕</button>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <button
          onClick={add}
          className="mt-4 w-full rounded-2xl border border-dashed border-line py-3 text-sm font-medium text-sage transition-colors hover:border-ink/30 hover:text-ink"
        >
          + Add item
        </button>

        <div className="mt-8 flex justify-end">
          <button
            onClick={save}
            disabled={status === "saving" || !dirty}
            className="rounded-full bg-ink px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-ivory transition-all hover:bg-ink-soft disabled:opacity-40"
          >
            {status === "saving" ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </main>
  );
}
