"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { WEDDING } from "@/config/wedding";
import RsvpForm from "./RsvpForm";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// The moment of commitment: a dark ink panel that bleeds into the footer so the
// two dark sections read as one passage. "Will you / join us?" mask-rises
// (kinetic title #2), then the form in a rounded card. The ambient light is
// STATIC — per MOTION-SPEC, nothing animates on a timer except the hero zoom and
// the load cascade. Everything collapses to its final state under reduced-motion.
export default function Rsvp() {
  const reduce = useReducedMotion();

  const reveal: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 40 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 1, ease: EASE } },
  };
  const titleReveal: Variants = {
    hidden: { y: reduce ? "0%" : "110%" },
    show: { y: "0%", transition: { duration: reduce ? 0 : 1.1, ease: EASE } },
  };
  const softReveal: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.2, ease: EASE } },
  };

  return (
    <section id="rsvp" className="relative isolate overflow-hidden bg-ink text-ivory">
      {/* Static atmosphere — soft ivory light + the faintest grain for depth */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[20%] -top-[10%] h-[65vw] max-h-[900px] w-[65vw] max-w-[900px] rounded-full bg-ivory/[0.035] blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[15%] h-[55vw] max-h-[800px] w-[55vw] max-w-[800px] rounded-full bg-ivory/[0.02] blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-[18vh] sm:px-10">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-12% 0px" }}>
          {/* Opening phrase */}
          <motion.p
            variants={softReveal}
            className="mb-14 text-center text-[0.6rem] uppercase tracking-[0.4em] text-ivory/35 sm:mb-20"
          >
            One more thing
          </motion.p>

          {/* Title */}
          <h2 className="text-center font-display text-[clamp(3rem,11vw,6.5rem)] font-light leading-[0.86] tracking-[-0.03em]">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={titleReveal} className="block">
                Will you
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={titleReveal} className="block italic">
                join us?
              </motion.span>
            </span>
          </h2>

          {/* Intro */}
          <motion.div variants={softReveal} className="mx-auto mt-14 max-w-md text-center sm:mt-16">
            <p className="text-sm leading-7 text-ivory/55">
              Your presence would mean so much to us. Let us know if you&rsquo;ll be
              there to celebrate the day with us.
            </p>
            <p className="mt-5 text-[0.62rem] uppercase tracking-[0.28em] text-ivory/35">
              {WEDDING.rsvpDeadline}
            </p>
          </motion.div>

          {/* Form */}
          <motion.div variants={reveal} className="mx-auto mt-16 max-w-2xl sm:mt-20">
            <div className="rounded-[2rem] border border-ivory/10 bg-ivory/[0.025] p-6 backdrop-blur-[2px] sm:rounded-[2.5rem] sm:p-10">
              <RsvpForm />
            </div>
          </motion.div>

          {/* Closing */}
          <motion.div variants={softReveal} className="mx-auto mt-16 max-w-lg text-center sm:mt-24">
            <p className="font-display text-2xl font-light leading-relaxed text-ivory/45 sm:text-3xl">
              We hope to celebrate
              <br />
              this moment with you.
            </p>
            <p className="mt-6 font-display text-lg italic text-ivory/30">With love</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
