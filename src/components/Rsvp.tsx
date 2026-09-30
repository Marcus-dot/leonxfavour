"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { WEDDING } from "@/config/wedding";
import RsvpForm from "./RsvpForm";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// The moment of commitment: a clean dark ink panel. "Will you join us?"
// mask-rises (kinetic title #2), the deadline sits below, then the RsvpForm in
// a rounded card. The ink bg bleeds into the footer so the two dark sections
// read as one continuous passage.
export default function Rsvp() {
  const reduce = useReducedMotion();

  const line: Variants = {
    hidden: { y: reduce ? "0%" : "115%" },
    show: { y: "0%", transition: { duration: reduce ? 0 : 0.9, ease: EASE } },
  };
  const fade: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.15, ease: EASE },
    },
  };

  return (
    <section id="rsvp" className="relative overflow-hidden bg-ink text-ivory">
      <div className="relative mx-auto max-w-2xl px-6 py-[16vh]">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15% 0px" }}>
          <h2 className="text-center font-display text-sec-title font-light">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={line} className="block">
                Will you join us?
              </motion.span>
            </span>
          </h2>
          <motion.p variants={fade} className="mt-4 text-center text-sm text-ivory/60">
            {WEDDING.rsvpDeadline}
          </motion.p>
        </motion.div>

        <div className="mt-14">
          <RsvpForm />
        </div>
      </div>
    </section>
  );
}
