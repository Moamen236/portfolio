"use client";

import { useRef } from "react";
import { profile } from "@/data/profile";
import { Monogram } from "./Monogram";
import { gsap, useGSAP } from "@/lib/gsap";

// MA → MOAMEN ALI, once per session. The overlay never takes pointer events, so the page is usable underneath.
export function Intro() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      const finish = () => {
        html.dataset.intro = "done";
        document.dispatchEvent(new Event("intro:done"));
      };
      if (html.classList.contains("no-intro")) return finish();
      try {
        sessionStorage.setItem("intro", "1");
      } catch {}

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo("[data-mono-trace] path, [data-mono-depth] path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut", stagger: 0.05 })
        .from("[data-mono-node]", { scale: 0, transformOrigin: "50% 50%", duration: 0.25, stagger: 0.04 }, 0.3)
        .from("[data-intro-char]", { yPercent: 110, duration: 0.4, stagger: 0.02 }, 0.5)
        .add(finish, 1.05)
        .to(root.current, { yPercent: -100, duration: 0.5, ease: "power3.inOut" }, 1.05)
        .set(root.current, { display: "none" });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="intro pointer-events-none fixed inset-0 z-[100] items-center justify-center bg-paper"
    >
      <div className="flex items-center gap-4 text-ink md:gap-5">
        <Monogram size={44} />
        <span className="flex overflow-hidden text-xl font-semibold tracking-[0.18em] md:text-2xl">
          {profile.name.toUpperCase().split("").map((c, i) => (
            <span key={i} data-intro-char className="inline-block whitespace-pre">
              {c}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
