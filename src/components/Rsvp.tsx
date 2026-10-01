"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { WEDDING } from "@/config/wedding";
import RsvpForm from "./RsvpForm";

const EASE = [0.22, 0.61, 0.36, 1] as const;

export default function Rsvp() {
  const reduce = useReducedMotion();

  const reveal: Variants = {
    hidden: {
      opacity: reduce ? 1 : 0,
      y: reduce ? 0 : 40,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 1,
        ease: EASE,
      },
    },
  };

  const titleReveal: Variants = {
    hidden: {
      y: reduce ? "0%" : "110%",
    },
    show: {
      y: "0%",
      transition: {
        duration: reduce ? 0 : 1.15,
        ease: EASE,
      },
    },
  };

  const softReveal: Variants = {
    hidden: {
      opacity: reduce ? 1 : 0,
      y: reduce ? 0 : 25,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 1,
        delay: reduce ? 0 : 0.2,
        ease: EASE,
      },
    },
  };

  return (
    <section
      id="rsvp"
      className="relative isolate overflow-hidden bg-ink text-ivory"
    >
      {/* Atmospheric background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {/* Soft light drifting through the darkness */}
        <motion.div
          animate={
            reduce
              ? undefined
              : {
                  x: ["-5%", "5%", "-5%"],
                  y: ["-3%", "4%", "-3%"],
                  scale: [1, 1.08, 1],
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: 22,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="absolute -left-[20%] -top-[10%] h-[65vw] w-[65vw] max-h-[900px] max-w-[900px] rounded-full bg-ivory/[0.035] blur-[140px]"
        />

        <motion.div
          animate={
            reduce
              ? undefined
              : {
                  x: ["4%", "-4%", "4%"],
                  y: ["5%", "-4%", "5%"],
                  scale: [1.05, 1, 1.05],
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: 26,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="absolute -bottom-[20%] -right-[15%] h-[55vw] w-[55vw] max-h-[800px] max-w-[800px] rounded-full bg-ivory/[0.02] blur-[150px]"
        />

        {/* Very subtle grain */}
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Main composition */}
      <div className="relative mx-auto max-w-[1500px] px-6 py-[18vh] sm:px-10 lg:px-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            margin: "-12% 0px",
          }}
        >
          {/* Small opening phrase */}
          <motion.div
            variants={softReveal}
            className="mb-14 flex items-center justify-center gap-4 sm:mb-20"
          >
            <span className="text-[9px] uppercase tracking-[0.45em] text-ivory/35">
              One more thing
            </span>
          </motion.div>

          {/* Main title */}
          <div className="text-center">
            <h2 className="font-display text-[clamp(4.5rem,13vw,12rem)] font-light leading-[0.78] tracking-[-0.065em]">
              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  variants={titleReveal}
                  className="block"
                >
                  Will you
                </motion.span>
              </span>

              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  variants={titleReveal}
                  className="block italic"
                >
                  join us?
                </motion.span>
              </span>
            </h2>
          </div>

          {/* Intro */}
          <motion.div
            variants={softReveal}
            className="mx-auto mt-16 max-w-md text-center sm:mt-20"
          >
            <p className="text-sm leading-7 text-ivory/50">
              Your presence would mean so much to us. Let us know if
              you&apos;ll be there to celebrate this day with us.
            </p>

            <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-ivory/30">
              Kindly respond by {WEDDING.rsvpDeadline}
            </p>
          </motion.div>

          {/* RSVP form */}
          <motion.div
            variants={reveal}
            className="mx-auto mt-20 max-w-3xl sm:mt-28"
          >
            <div className="rounded-[2rem] bg-ivory/[0.025] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.18)] backdrop-blur-[2px] sm:rounded-[2.5rem] sm:p-10 lg:p-14">
              <RsvpForm />
            </div>
          </motion.div>

          {/* Closing thought */}
          <motion.div
            variants={softReveal}
            className="mx-auto mt-20 max-w-lg text-center sm:mt-28"
          >
            <p className="font-display text-2xl font-light leading-relaxed text-ivory/45 sm:text-3xl">
              We hope to celebrate
              <br />
              this moment with you.
            </p>

            <p className="mt-8 font-display text-lg italic text-ivory/25">
              With love
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Soft fade into whatever follows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent"
      />
    </section>
  );
}