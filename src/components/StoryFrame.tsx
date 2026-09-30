"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import type { StoryFrame as Frame } from "@/config/wedding";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// One frame: the photo uncovers via a clip-path wipe while the inner image
// settles 1.12→1.04, then drifts slower than the frame on scroll (parallax).
// The caption's index + line each rise out of a mask just after.
export default function StoryFrame({ frame, index }: { frame: Frame; index: number }) {
  const reduce = useReducedMotion();
  const figureRef = useRef<HTMLElement>(null);
  const number = index + 1;
  const photoLeft = number % 2 === 1; // 01/03/05 → photo left on desktop

  const { scrollYProgress } = useScroll({
    target: figureRef,
    offset: ["start end", "end start"],
  });
  // Inner image drifts ~3% slower than the frame; headroom comes from scale 1.04.
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-1.5%", "1.5%"]);

  const clip: Variants = {
    hidden: { clipPath: reduce ? "inset(0 0 0 0)" : "inset(100% 0 0 0)" },
    show: { clipPath: "inset(0 0 0 0)", transition: { duration: reduce ? 0 : 1.1, ease: EASE } },
  };
  const settle: Variants = {
    hidden: { scale: reduce ? 1 : 1.12 },
    show: { scale: reduce ? 1 : 1.04, transition: { duration: reduce ? 0 : 1.2, ease: EASE } },
  };

  const capContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.15, delayChildren: reduce ? 0 : 0.15 } },
  };
  const capLine: Variants = {
    hidden: { y: reduce ? "0%" : "120%" },
    show: { y: "0%", transition: { duration: reduce ? 0 : 0.8, ease: EASE } },
  };

  return (
    <div className="md:grid md:grid-cols-2 md:items-center md:gap-14">
      <motion.figure
        ref={figureRef}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-12% 0px" }}
        variants={clip}
        style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
        className={`group relative overflow-hidden ${photoLeft ? "" : "md:order-2"}`}
      >
        <motion.div variants={settle} style={{ y }} className="absolute inset-0 will-change-transform">
          <div className="relative h-full w-full transition-transform duration-[1400ms] ease-soft md:group-hover:scale-[1.04]">
            <Image
              src={frame.src}
              alt={frame.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </motion.div>
      </motion.figure>

      <motion.figcaption
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-12% 0px" }}
        variants={capContainer}
        className={`mt-6 md:mt-0 ${
          photoLeft ? "md:pl-2 md:text-left" : "md:order-1 md:pr-2 md:text-right"
        } text-center`}
      >
        <span className="block overflow-hidden">
          <motion.span
            variants={capLine}
            className="block font-display text-2xl font-light italic text-lime-deep"
          >
            {String(number).padStart(2, "0")}
          </motion.span>
        </span>
        <span className="mt-1 block overflow-hidden">
          <motion.span
            variants={capLine}
            className="block font-display text-[clamp(1.15rem,4vw,1.5rem)] font-light leading-snug text-ink"
          >
            {frame.caption}
          </motion.span>
        </span>
      </motion.figcaption>
    </div>
  );
}
