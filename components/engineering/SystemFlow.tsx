"use client";

import { Fragment, useRef } from "react";
import type { FlowStep } from "@/data/engineering";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

type Props = {
  steps: FlowStep[];
  /** `full`: numbered nodes with notes, vertical on mobile. `compact`: one row of chips. */
  variant?: "full" | "compact";
  tone?: "light" | "night";
  label: string;
  className?: string;
  /** Light up `[data-word-heading]` words elsewhere on the page as matching steps activate. */
  lightWords?: boolean;
  /** ScrollTrigger start for the draw-in. */
  start?: string;
};

const TONES = {
  light: { idle: "#c3c9d3", on: "#2b44e0", fill: "#f2f3f5", text: "#5a6372" },
  night: { idle: "#2a3550", on: "#8ea0ff", fill: "#101827", text: "#7c879d" },
};

/**
 * The site's signature: connected nodes that draw in when they enter the viewport,
 * then a single light travels the path. The loop pauses whenever the flow is off-screen.
 */
export function SystemFlow({ steps, variant = "full", tone = "light", label, className = "", lightWords = false, start = "top 80%" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const t = TONES[tone];
  const night = tone === "night";

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const dots = q("[data-flow-dot]") as HTMLElement[];
        const light = q("[data-flow-light]")[0] as HTMLElement;
        // Dot centres relative to the flow root, re-measured whenever the loop is invalidated.
        const pos = (i: number) => {
          const a = root.current!.getBoundingClientRect();
          const b = dots[i].getBoundingClientRect();
          return { x: b.left + b.width / 2 - a.left, y: b.top + b.height / 2 - a.top };
        };

        const loop = gsap.timeline({ repeat: -1, repeatDelay: 1.6, paused: true });
        loop.set(light, { x: () => pos(0).x, y: () => pos(0).y, autoAlpha: 1 });
        dots.slice(1).forEach((dot, i) => {
          loop.to(light, { x: () => pos(i + 1).x, y: () => pos(i + 1).y, duration: 0.5, ease: "power1.inOut" });
          loop.fromTo(dot, { scale: 1 }, { scale: 1.45, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.out" }, "-=0.08");
        });
        loop.to(light, { autoAlpha: 0, duration: 0.25 });

        let started = false;
        const enter = gsap.timeline({ paused: true, onComplete: () => void ((started = true), loop.play()) });
        enter
          .fromTo(dots, { borderColor: t.idle, backgroundColor: t.fill }, { borderColor: t.on, backgroundColor: t.on, duration: 0.3, stagger: 0.12 })
          .fromTo(q("[data-flow-conn] > span"), { scale: 0 }, { scale: 1, duration: 0.3, stagger: 0.12, ease: "none" }, 0.12)
          .from(q("[data-flow-text]"), { autoAlpha: 0, y: 8, duration: 0.4, stagger: 0.06, ease: "power2.out" }, 0);

        if (lightWords)
          steps.forEach((s, i) => {
            const word = s.word && document.querySelector(`[data-word-heading="${s.word}"]`);
            if (word) enter.fromTo(word, { color: t.text }, { color: night ? "#ffffff" : "#121722", duration: 0.3 }, i * 0.12);
          });

        ScrollTrigger.create({
          trigger: root.current,
          start,
          once: true,
          onEnter: () => void enter.play(),
        });
        ScrollTrigger.create({
          trigger: root.current,
          onToggle: (self) => started && (self.isActive ? loop.resume() : loop.pause()),
        });

        const onResize = () => loop.invalidate();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
      });
    },
    { scope: root }
  );

  const dotClass = "block shrink-0 rounded-full border-2";
  const dotStyle = { borderColor: t.on, backgroundColor: t.on };
  const fill = night ? "bg-accent-soft" : "bg-accent";
  const track = night ? "bg-night-line" : "bg-line";

  const light = (
    <span
      data-flow-light
      aria-hidden="true"
      className={`pointer-events-none invisible absolute top-0 left-0 z-10 -mt-1 -ml-1 size-2 rounded-full ${fill}`}
      style={{ boxShadow: `0 0 0 4px ${night ? "rgb(142 160 255 / .18)" : "rgb(43 68 224 / .14)"}, 0 0 14px ${t.on}` }}
    />
  );

  if (variant === "compact") {
    return (
      <div ref={root} className={`relative ${className}`} role="group" aria-label={label}>
        {light}
        <ol className="flex items-center">
          {steps.map((s, i) => (
            <Fragment key={s.label}>
              <li
                className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs ${
                  night ? "border-night-line bg-night-raised text-night-text" : "border-line bg-surface text-slate"
                }`}
              >
                <span data-flow-dot className={`${dotClass} size-1.5 border`} style={dotStyle} />
                <span data-flow-text>{s.label}</span>
              </li>
              {i < steps.length - 1 && (
                <li data-flow-conn aria-hidden="true" className={`h-px min-w-3 flex-1 ${track}`}>
                  <span className={`block h-full w-full origin-left ${fill}`} />
                </li>
              )}
            </Fragment>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div ref={root} className={`relative ${className}`} role="group" aria-label={label}>
      {light}
      <ol className="grid gap-y-7 md:grid-cols-7 md:gap-x-4">
        {steps.map((s, i) => (
          <li key={s.label} className="relative pl-9 md:pl-0 md:pt-9">
            <span data-flow-dot aria-hidden="true" className={`${dotClass} absolute top-1 left-0 size-3 md:top-0`} style={dotStyle} />
            {i < steps.length - 1 && (
              <span
                data-flow-conn
                aria-hidden="true"
                className={`absolute top-4 left-[5.5px] h-[calc(100%+1rem)] w-px md:top-[5.5px] md:left-3 md:h-px md:w-[calc(100%+0.25rem)] ${track}`}
              >
                <span className={`block h-full w-full origin-top-left ${fill}`} />
              </span>
            )}
            <div data-flow-text>
              <p className="font-mono text-[11px] opacity-60">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-0.5 font-medium">{s.label}</p>
              {s.note && <p className={`mt-1 text-sm leading-snug text-pretty ${night ? "text-night-text" : "text-slate"}`}>{s.note}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
