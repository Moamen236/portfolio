"use client";

import { useRef } from "react";
import { profile } from "@/data/profile";
import type { Diagram } from "@/data/projects";
import { Schematic } from "@/components/animations/Schematic";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";

// The kind of system the rest of the page is about: request path through to data and workers.
const system: Diagram = {
  nodes: [
    { id: "web", label: "Browser", x: 60, y: 70 },
    { id: "mobile", label: "Mobile app", x: 60, y: 190 },
    { id: "edge", label: "Cloudflare", x: 190, y: 130 },
    { id: "proxy", label: "Nginx", x: 320, y: 130 },
    { id: "app", label: "Laravel API", x: 450, y: 130 },
    { id: "db", label: "MySQL", x: 580, y: 50 },
    { id: "cache", label: "Redis", x: 580, y: 130 },
    { id: "queue", label: "Queue", x: 580, y: 210 },
    { id: "worker", label: "Workers", x: 710, y: 210 },
  ],
  edges: [
    ["web", "edge"],
    ["mobile", "edge"],
    ["edge", "proxy"],
    ["proxy", "app"],
    ["app", "db"],
    ["app", "cache"],
    ["app", "queue"],
    ["queue", "worker"],
  ],
};

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          "[data-char]",
          { y: 0, yPercent: 105 },
          { yPercent: 0, duration: 1, stagger: 0.035 }
        )
          .fromTo("[data-hero-reveal]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.45);

        // Diagram drifts slightly slower than the page.
        gsap.to(art.current, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });

      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const x = gsap.quickTo(art.current, "x", { duration: 1.2, ease: "power3" });
        const y = gsap.quickTo(art.current, "y", { duration: 1.2, ease: "power3" });
        const move = (e: PointerEvent) => {
          x((e.clientX / window.innerWidth - 0.5) * -18);
          y((e.clientY / window.innerHeight - 0.5) * -12);
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 pb-14 md:pb-20">
      <div className="container-x flex flex-1 items-center">
        <div
          ref={art}
          aria-hidden="true"
          className="pointer-events-none w-[165%] shrink-0 text-slate/80 sm:w-full md:ml-auto md:w-[62%] md:max-w-[50rem]"
        >
          <Schematic diagram={system} width={770} height={260} title="" />
        </div>
      </div>

      <div className="container-x relative pt-10">
        <h1
          aria-label={profile.name}
          className="font-semibold leading-[0.86] tracking-[-0.045em] text-[length:var(--text-display)]"
        >
          {profile.name.split(" ").map((word, w) => (
            <span key={w} aria-hidden="true" className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              {word.split("").map((c, i) => (
                <span key={i} data-char className="inline-block">
                  {c}
                </span>
              ))}
              {w === 0 ? " " : null}
            </span>
          ))}
        </h1>

        <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-10">
          <p data-hero-reveal className="text-xl font-medium tracking-tight md:text-2xl">
            {profile.role}
          </p>
          <div>
            <p data-hero-reveal className="lede text-lg md:text-xl">
              {profile.statement}
            </p>
            <div data-hero-reveal className="mt-8 flex flex-wrap gap-3">
              <a
                href="#work"
                className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-[0.95rem] font-medium text-paper transition-colors hover:bg-accent"
              >
                View projects
              </a>
              <a
                href="#contact"
                className="inline-flex h-12 items-center rounded-full border border-ink/25 px-6 text-[0.95rem] font-medium transition-colors hover:border-ink"
              >
                Let&apos;s connect
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
