"use client";

import { useState } from "react";
import Loader from "./Loader";
import Hero from "./Hero";

// The loader now exits by LIFTING itself (translateY → -100%) and calls onDone
// when that lift completes, so there's no opacity fade here (a fade on top of
// the lift reads muddy). The Hero stays mounted underneath the whole time; its
// mask-rise fires on onDone, so the panel lifting away reveals the names rising
// into place as one continuous move.
export default function Intro() {
  const [done, setDone] = useState(false);
  return (
    <>
      {!done && <Loader onDone={() => setDone(true)} />}
      <Hero start={done} />
    </>
  );
}
