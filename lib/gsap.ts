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
