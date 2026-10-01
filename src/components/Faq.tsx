"use client";

import { useId, useState } from "react";
import { FAQ } from "@/config/wedding";
import SectionReveal from "./SectionReveal";

// Accessible accordion: a real button with aria-expanded/aria-controls, the
// answer in a region that eases open via grid-template-rows 0fr→1fr (smooth
// height, transform/opacity-free). The lime + rotates 45° into a × on open
// (budgeted). Reduced-motion collapses the transition to instant (global guard).
export default function Faq() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-[14vh]">
      <SectionReveal>
        <h2 className="mb-12 text-center font-display text-sec-title font-light text-ink">
          Good to know
        </h2>
        <div className="border-t border-line">
          {FAQ.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="font-display text-lg font-light leading-snug text-ink">
          {q}
        </span>
        <span
          aria-hidden
          className={`relative block h-3.5 w-3.5 shrink-0 text-lime transition-transform duration-300 ease-soft ${
            open ? "rotate-45" : ""
          }`}
        >
          <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-current" />
          <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current" />
        </span>
      </button>

      <div
        id={id}
        role="region"
        className="grid transition-[grid-template-rows] duration-500 ease-soft"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="max-w-prose pb-6 text-sm leading-relaxed text-ink-soft">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}
