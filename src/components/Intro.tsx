"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Loader from "./Loader";
import Hero from "./Hero";

// Coordinates the loader → hero handoff: the hero's entrance begins the moment
// the loader starts its exit fade, so the two moments blend into one.
export default function Intro() {
  const [done, setDone] = useState(false);
  return (
    <>
      <AnimatePresence>
        {!done && <Loader key="loader" onDone={() => setDone(true)} />}
      </AnimatePresence>
      <Hero start={done} />
    </>
  );
}
