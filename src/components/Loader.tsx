"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { WEDDING } from "@/config/wedding";

const EASE = [0.22, 0.61, 0.36, 1] as const;
const MIN_MS = 2400; // felt, not skipped
const MAX_MS = 5000; // hard safety: a slow asset never traps a guest

// Ivory overlay. Names fade up → lime line fills L→R → "loading our story".
// Dismiss on window.load + min display, capped at 5s. Exit fade lives in
// <Intro>'s AnimatePresence so the hero is revealed as this clears.
export default function Loader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const mounted = Date.now();
    let dismissed = false;
    let minTimer: ReturnType<typeof setTimeout>;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      onDone();
    };

    if (reduce) {
      const t = setTimeout(dismiss, 200);
      return () => clearTimeout(t);
    }

    const finish = () => {
      const wait = Math.max(0, MIN_MS - (Date.now() - mounted));
      minTimer = setTimeout(dismiss, wait);
    };

    const hardCap = setTimeout(dismiss, MAX_MS);
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      clearTimeout(minTimer);
      clearTimeout(hardCap);
      window.removeEventListener("load", finish);
    };
  }, [reduce, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ivory px-6"
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.2 : 0.9, ease: EASE }}
    >
      <motion.p
        className="font-display text-2xl font-light tracking-tight text-ink"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {WEDDING.groom} <span className="text-lime">&amp;</span> {WEDDING.bride}
      </motion.p>

      <div className="mt-6 h-px w-40 overflow-hidden bg-line">
        <motion.div
          className="h-full w-full origin-left bg-lime"
          initial={{ scaleX: reduce ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reduce ? 0 : 1.7, delay: reduce ? 0 : 0.3, ease: EASE }}
        />
      </div>

      <motion.p
        className="mt-5 text-[0.68rem] uppercase tracking-[0.28em] text-sage"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: reduce ? 0 : 0.6, ease: EASE }}
      >
        Loading our story
      </motion.p>
    </motion.div>
  );
}
