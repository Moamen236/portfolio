"use client";

import { useRef } from "react";
import { journey, layers } from "@/data/career";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export function Journey() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        // Progress line follows the scroll through the timeline.
        gsap.fromTo(
          "[data-progress]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-timeline]", start: "top 65%", end: "bottom 65%", scrub: true } }
        );

        gsap.utils.toArray<HTMLElement>("[data-entry]", root.current).forEach((entry) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: entry, start: "top 68%", once: true } });
          tl.from(entry.querySelector("[data-marker]"), { scale: 0, duration: 0.4, ease: "back.out(2)" })
            .from(entry.querySelectorAll("[data-copy]"), { autoAlpha: 0, x: -16, duration: 0.6, stagger: 0.06, ease: "power3.out" }, 0)
            .from(entry.querySelectorAll("[data-seg]"), { scaleX: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }, 0.2);
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="experience" aria-labelledby="experience-title" className="border-t border-line py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-10">
          <h2 id="experience-title" className="h2">
            Experience
          </h2>
          <p className="lede self-end">
            Six years of widening scope — from interfaces, to full applications, to owning what runs in production.
          </p>
        </div>

        <div className="mt-16 hidden grid-cols-[2.5rem_9rem_minmax(0,1fr)_14rem] gap-x-6 text-sm text-slate md:mt-24 md:grid">
          <span />
          <span />
          <span />
          <span className="grid grid-cols-4 gap-1 text-center text-[0.7rem]">
            {layers.map((l) => (
              <span key={l} className="truncate" title={l}>
                {l === "Infrastructure" ? "Infra" : l}
              </span>
            ))}
          </span>
        </div>

        <ol data-timeline className="relative mt-12 md:mt-4">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[0.6875rem] w-px bg-line md:left-[0.6875rem]">
            <span data-progress className="block h-full w-full origin-top bg-accent" />
          </span>

          {journey.map((j) => (
            <li
              key={j.period + j.company}
              data-entry
              className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 pb-14 last:pb-0 md:grid-cols-[2.5rem_9rem_minmax(0,1fr)_14rem] md:gap-x-6"
            >
              <span aria-hidden="true" className="relative pt-1.5">
                <span data-marker className="block size-[1.4rem] rounded-full border-2 border-accent bg-paper" />
              </span>
              <p data-copy className="font-mono text-sm text-slate md:pt-1.5">
                {j.period}
              </p>
              <div className="col-start-2 md:col-start-auto">
                <h3 data-copy className="text-[length:var(--text-h3)] font-semibold leading-tight tracking-tight">
                  {j.phase}
                </h3>
                <p data-copy className="mt-1 font-medium">
                  {j.role}, {j.company}
                </p>
                <p data-copy className="mt-2 max-w-xl text-pretty text-slate">
                  {j.detail}
                </p>
              </div>
              <div className="col-start-2 mt-4 md:col-start-auto md:mt-2.5">
                <p className="sr-only">Scope: {j.scope.join(", ")}</p>
                <div aria-hidden="true" className="grid grid-cols-4 gap-1">
                  {layers.map((l) => (
                    <span key={l} className="h-1.5 overflow-hidden rounded-full bg-line">
                      {j.scope.includes(l) && <span data-seg className="block h-full w-full origin-left bg-ink" />}
                    </span>
                  ))}
                </div>
                <p aria-hidden="true" className="mt-2 text-xs text-slate md:hidden">
                  {j.scope.join(" + ")}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
