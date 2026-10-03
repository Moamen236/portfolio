"use client";

import { useRef } from "react";
import { journey, layers } from "@/data/career";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

// Desktop graph: five equal columns, each commit node sits on its column's left edge.
const NODE = 14; // px
const col = (i: number) => `calc(${i * 20}% + ${NODE / 2}px)`;
const MAIN_Y = "72%";
const BRANCH_Y = "26%";

function Marker({ current, index, className = "" }: { current?: boolean; index?: number; className?: string }) {
  return (
    <span
      data-git-node={index ?? ""}
      className={`block size-3.5 rounded-full border-2 border-accent ${current ? "bg-accent shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-accent)_16%,transparent)]" : "bg-paper"} ${className}`}
    />
  );
}

function Scope({ scope }: { scope: (typeof journey)[number]["scope"] }) {
  return (
    <div className="mt-5">
      <p className="sr-only">Scope: {scope.join(", ")}</p>
      <div aria-hidden="true" className="grid max-w-56 grid-cols-4 gap-1">
        {layers.map((l) => (
          <span key={l} className="h-1 overflow-hidden rounded-full bg-line">
            {scope.includes(l) && <span data-seg className="block h-full w-full origin-left bg-ink" />}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Journey() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: the history draws left to right, commits land as the line reaches them.
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const D = 1.8;
        const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-git-graph]", start: "top 75%", once: true } });
        tl.fromTo("[data-git-main]", { scaleX: 0 }, { scaleX: 1, duration: D, ease: "none" }, 0)
          .fromTo("[data-git-branch]", { clipPath: "inset(-10% 100% -10% 0%)" }, { clipPath: "inset(-10% 0% -10% 0%)", duration: D * 0.4, ease: "none" }, D * 0.25)
          .from("[data-git-future]", { autoAlpha: 0, duration: 0.4 }, D);
        journey.forEach((j, i) => {
          const t = (i / (journey.length - 1)) * D;
          tl.from(`[data-git-graph] [data-git-node="${i}"]`, { scale: 0, duration: 0.35, ease: "back.out(2.5)" }, t)
            .from(`[data-entry="${i}"] [data-copy]`, { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.05, ease: "power3.out" }, t)
            .from(`[data-entry="${i}"] [data-seg]`, { scaleX: 0, duration: 0.4, stagger: 0.06 }, t + 0.15);
        });
        tl.from("[data-git-head]", { autoAlpha: 0, y: 6, duration: 0.4 }, D);
      });

      // Mobile/tablet: vertical history, progress follows the scroll.
      mm.add(`${MOTION_OK} and (max-width: 1023px)`, () => {
        gsap.fromTo(
          "[data-progress]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-timeline]", start: "top 65%", end: "bottom 65%", scrub: true } }
        );
        gsap.utils.toArray<HTMLElement>("[data-entry]", root.current).forEach((entry) => {
          gsap
            .timeline({ scrollTrigger: { trigger: entry, start: "top 72%", once: true } })
            .from(entry.querySelectorAll("[data-git-node]"), { scale: 0, duration: 0.35, ease: "back.out(2)" })
            .from(entry.querySelectorAll("[data-copy]"), { autoAlpha: 0, x: -12, duration: 0.5, stagger: 0.05, ease: "power3.out" }, 0)
            .from(entry.querySelectorAll("[data-seg]"), { scaleX: 0, duration: 0.4, stagger: 0.06 }, 0.15);
        });
      });
    },
    { scope: root }
  );

  const branchIndex = journey.findIndex((j) => j.lane === "branch");

  return (
    <section ref={root} id="experience" aria-labelledby="experience-title" className="border-t border-line py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-10">
          <h2 id="experience-title" className="h2">
            Experience
          </h2>
          <div className="self-end">
            <p className="lede">Each role widened the scope — from interfaces to owning what runs in production.</p>
            <div aria-hidden="true" className="mt-5 grid max-w-72 grid-cols-4 gap-1 font-mono text-[10px] text-slate">
              {layers.map((l) => (
                <span key={l} className="truncate border-t-2 border-ink pt-1.5">
                  {l === "Infrastructure" ? "Infra" : l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop commit graph (decorative; the list below carries the content). */}
        <div data-git-graph aria-hidden="true" className="relative mt-24 hidden h-24 lg:block">
          <span className="absolute -top-1 left-0 font-mono text-[11px] text-slate">main</span>
          <span className="absolute h-px bg-line" style={{ left: col(0), width: "80%", top: MAIN_Y }}>
            <span data-git-main className="block h-full w-full origin-left bg-accent" />
          </span>
          <span
            data-git-future
            className="absolute border-t border-dashed border-accent/50"
            style={{ left: col(4), right: 0, top: MAIN_Y }}
          />
          {branchIndex > 0 && (
            <>
              <svg
                data-git-branch
                className="absolute overflow-visible"
                style={{ left: col(branchIndex - 1), width: "40%", top: 0, height: "100%" }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 72 C 22 72, 22 26, 50 26 C 78 26, 78 72, 100 72"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeOpacity={0.7}
                  strokeWidth={1.25}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <span className="absolute font-mono text-[11px] text-slate" style={{ left: col(branchIndex), top: "-0.25rem", transform: "translateX(-50%)" }}>
                part-time
              </span>
            </>
          )}
          {journey.map((j, i) => (
            <span
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: col(i), top: j.lane === "branch" ? BRANCH_Y : MAIN_Y }}
            >
              <Marker current={j.current} index={i} />
              {j.current && (
                <span
                  data-git-head
                  className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] whitespace-nowrap text-paper"
                >
                  HEAD → main
                </span>
              )}
            </span>
          ))}
        </div>

        <ol data-timeline className="relative mt-12 lg:mt-10 lg:grid lg:grid-cols-5">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[0.6875rem] w-px bg-line lg:hidden">
            <span data-progress className="block h-full w-full origin-top bg-accent" />
          </span>

          {journey.map((j, i) => {
            const branch = j.lane === "branch";
            return (
              <li
                key={j.period + j.company}
                data-entry={i}
                className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] pb-14 last:pb-0 lg:block lg:pr-6 lg:pb-0"
              >
                <span aria-hidden="true" className="relative block lg:hidden">
                  {branch ? (
                    <>
                      <svg className="absolute top-[-19px] left-0 h-[30px] w-11" viewBox="0 0 44 30">
                        <path d="M11 0 C 11 15, 33 12, 33 30" fill="none" stroke="var(--color-accent)" strokeOpacity={0.6} />
                      </svg>
                      <span className="absolute top-[11px] bottom-6 left-[32.5px] w-px bg-accent/60" />
                      <svg className="absolute bottom-0 left-0 h-6 w-11" viewBox="0 0 44 24">
                        <path d="M33 0 C 33 14, 11 10, 11 24" fill="none" stroke="var(--color-accent)" strokeOpacity={0.6} />
                      </svg>
                      <Marker className="absolute top-1 left-[26px]" />
                    </>
                  ) : (
                    <Marker current={j.current} className="relative top-1 left-1" />
                  )}
                </span>

                <div className={branch ? "pl-4 lg:pl-0" : ""}>
                  <p data-copy className="font-mono text-sm text-slate">
                    {j.period}
                    {branch && <span className="lg:hidden"> · part-time</span>}
                  </p>
                  <h3 data-copy className="mt-2 text-[length:var(--text-h3)] leading-tight font-semibold tracking-tight lg:text-[1.3rem]">
                    {j.phase}
                  </h3>
                  <p data-copy className="mt-1.5 font-medium">
                    {j.role}
                    <span className="text-slate">, {j.company}</span>
                  </p>
                  <p data-copy className="mt-2 text-sm text-pretty text-slate">
                    {j.detail}
                  </p>
                  <Scope scope={j.scope} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
