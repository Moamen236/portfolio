"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

// Every animation is scoped to this query, so reduced-motion users get the final state.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/** Runs `cb` once the intro overlay starts leaving (or immediately when there is no intro). */
export function whenIntroDone(cb: () => void) {
  const html = document.documentElement;
  if (html.classList.contains("no-intro") || html.dataset.intro === "done") {
    cb();
    return () => {};
  }
  const run = () => {
    clearTimeout(fallback);
    cb();
  };
  const fallback = window.setTimeout(() => {
    document.removeEventListener("intro:done", run);
    cb();
  }, 2500);
  document.addEventListener("intro:done", run, { once: true });
  return () => {
    clearTimeout(fallback);
    document.removeEventListener("intro:done", run);
  };
}
