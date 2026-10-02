"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MOTION_OK, FINE_POINTER } from "@/lib/gsap";

const INTERACTIVE = "a, button, [role='button'], [data-cursor]";

/**
 * A small node that trails the native cursor (which stays visible) on desktop only.
 * Grows over interactive elements; `data-cursor="Label"` shows a short label.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const node = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(`${FINE_POINTER} and ${MOTION_OK}`);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !node.current) return;
    const el = node.current;
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    let current: Element | null = null;
    let currentText = "";

    const setState = (target: Element | null) => {
      const text = target?.getAttribute("data-cursor") || "";
      if (target === current && text === currentText) return;
      current = target;
      currentText = text;
      gsap.to(ring.current, { scale: target ? (text ? 2.3 : 1.8) : 1, duration: 0.3, ease: "power3.out" });
      gsap.to(ring.current, { backgroundColor: target ? "rgba(43,68,224,0.08)" : "rgba(43,68,224,0)", duration: 0.3 });
      if (label.current) label.current.textContent = text;
      gsap.to(label.current, { autoAlpha: text ? 1 : 0, duration: 0.2 });
    };

    const move = (e: PointerEvent) => {
      gsap.set(el, { autoAlpha: 1 });
      x(e.clientX);
      y(e.clientY);
      setState((e.target as Element).closest?.(INTERACTIVE) ?? null);
    };
    const leave = () => gsap.to(el, { autoAlpha: 0, duration: 0.2 });

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={node} aria-hidden="true" className="pointer-events-none invisible fixed top-0 left-0 z-[90]">
      <div
        ref={ring}
        className="absolute -top-3.5 -left-3.5 size-7 rounded-full border border-accent/50"
      />
      <div className="absolute -top-[2px] -left-[2px] size-1 rounded-full bg-accent" />
      <span
        ref={label}
        className="invisible absolute top-6 left-6 rounded-full bg-ink px-2 py-0.5 font-mono text-[11px] whitespace-nowrap text-paper"
      />
    </div>
  );
}
