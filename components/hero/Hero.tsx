"use client";

import { useRef } from "react";
import { profile } from "@/data/profile";
import { shipFlow } from "@/data/engineering";
import { SystemFlow } from "@/components/engineering/SystemFlow";
import { Portrait } from "./Portrait";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER, whenIntroDone } from "@/lib/gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        tl.fromTo("[data-char]", { y: 0, yPercent: 105 }, { yPercent: 0, duration: 0.9, stagger: 0.03 })
          .fromTo("[data-hero-reveal]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.35)
          // Portrait: frame wipes up, mark draws, stem drops, services plug in.
          .fromTo("[data-portrait-frame]", { clipPath: "inset(100% 0% 0% 0% round 1.25rem)" }, { clipPath: "inset(0% 0% 0% 0% round 1.25rem)", duration: 1, ease: "power3.inOut" }, 0.1)
          .from("[data-portrait-img]", { scale: 1.08, duration: 1.3 }, 0.1)
          .fromTo("[data-portrait-mark] [data-mono-trace] path, [data-portrait-mark] [data-mono-depth] path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 0)
          .fromTo("[data-portrait-mark] [data-mono-node]", { scale: 0, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.3, stagger: 0.04 }, 0.4)
          .fromTo("[data-portrait-stem]", { scaleY: 0, opacity: 1 }, { scaleY: 1, duration: 0.4 }, 0.5)
          .fromTo("[data-port-line]", { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.5, stagger: 0.08 }, 0.9)
          .fromTo("[data-portrait-port] > span:last-child", { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.08 }, 0.85)
          .fromTo("[data-portrait-port] > span:first-child", { opacity: 0, x: (i) => (i < 2 ? -8 : 8) }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.08 }, 1);

        const stop = whenIntroDone(() => tl.play());

        gsap.to(art.current, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        return stop;
      });

      // Slight depth on desktop: the portrait leans away from the pointer.
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const x = gsap.quickTo(art.current, "x", { duration: 1.2, ease: "power3" });
        const y = gsap.quickTo(art.current, "y", { duration: 1.2, ease: "power3" });
        const move = (e: PointerEvent) => {
          x((e.clientX / window.innerWidth - 0.5) * -10);
          y((e.clientY / window.innerHeight - 0.5) * -8);
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 pb-10 md:pb-12">
      <div className="container-x grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16">
        <div className="order-2 lg:order-1">
          <h1
            aria-label={profile.name}
            className="text-[clamp(3.4rem,9vw,8.25rem)] leading-[0.88] font-semibold tracking-[-0.045em]"
          >
            {profile.name.split(" ").map((word) => (
              <span key={word} aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
                {word.split("").map((c, i) => (
                  <span key={i} data-char className="inline-block">
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p data-hero-reveal className="mt-6 text-xl font-medium tracking-tight md:mt-8 md:text-2xl">
            {profile.role}
          </p>
          <p data-hero-reveal className="lede mt-4 md:text-xl">
            {profile.statement}
          </p>
          <div data-hero-reveal className="mt-8 flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-[0.95rem] font-medium text-paper transition-colors hover:bg-accent"
            >
              View work
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center rounded-full border border-ink/25 bg-paper px-6 text-[0.95rem] font-medium transition-colors hover:border-ink"
            >
              Contact
            </a>
          </div>
        </div>

        <div ref={art} className="order-1 lg:order-2">
          <Portrait />
        </div>
      </div>

      <div data-hero-reveal className="container-x mt-14 hidden lg:block">
        <SystemFlow steps={shipFlow} variant="compact" start="top bottom" label="From code to production" />
      </div>
    </section>
  );
}
