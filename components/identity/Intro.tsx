"use client";

import { useRef } from "react";
import { profile } from "@/data/profile";
import { shipFlow } from "@/data/engineering";
import { Monogram } from "./Monogram";
import { gsap, useGSAP } from "@/lib/gsap";

const MIN_READY = 0.85; // progress the bar may reach before the page has actually loaded
const MAX_WAIT = 3000; // never hold the screen longer than this, loaded or not

/**
 * Loading screen on every load: MA draws, the deploy path fills while fonts and assets load,
 * then MA opens into MOAMEN ALI and the screen lifts. It never takes pointer events.
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const light = useRef<HTMLSpanElement>(null);
  const status = useRef<HTMLSpanElement>(null);
  const name = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      const finish = () => {
        html.dataset.intro = "done";
        document.dispatchEvent(new Event("intro:done"));
      };
      if (html.classList.contains("no-intro")) return finish();

      // Real readiness: web fonts and the window load event (images), capped by MAX_WAIT.
      let ready = false;
      const loaded = new Promise<void>((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", () => r(), { once: true })));
      Promise.race([Promise.all([document.fonts?.ready, loaded]), new Promise((r) => setTimeout(r, MAX_WAIT))]).then(() => {
        ready = true;
        if (tl.paused()) tl.play();
      });

      const nodes = gsap.utils.toArray<HTMLElement>("[data-load-node]", root.current);
      const last = nodes.length - 1;
      const width = track.current!.offsetWidth;
      const state = { p: 0 };
      let step = -1;
      const render = () => {
        gsap.set(fill.current, { scaleX: state.p });
        gsap.set(light.current, { x: state.p * width });
        const i = Math.min(last, Math.floor(state.p * last + 0.001));
        if (i === step) return;
        step = i;
        nodes.forEach((n, k) => (n.dataset.on = String(k <= i)));
        if (status.current) status.current.textContent = i === last ? "live" : `deploying · ${shipFlow[i].label.toLowerCase()}`;
      };

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo("[data-mono-trace] path, [data-mono-depth] path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut", stagger: 0.05 })
        .fromTo("[data-mono-node]", { scale: 0, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.25, stagger: 0.04 }, 0.25)
        .from("[data-load-ui]", { autoAlpha: 0, y: 8, duration: 0.3 }, 0.2)
        .to(state, { p: MIN_READY, duration: 0.9, ease: "power1.inOut", onUpdate: render }, 0.3)
        .addPause("+=0", () => {
          if (ready) gsap.delayedCall(0, () => tl.play());
        })
        .to(state, { p: 1, duration: 0.3, ease: "power1.out", onUpdate: render })
        .to("[data-load-ui]", { autoAlpha: 0, y: -6, duration: 0.25 }, "+=0.1")
        // MA opens into the full name.
        .fromTo(name.current, { width: 0 }, { width: "auto", duration: 0.45, ease: "power3.inOut" }, "<")
        .from("[data-intro-char]", { yPercent: 110, duration: 0.35, stagger: 0.02 }, "<0.1")
        .add(finish, "+=0.1")
        .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.55, ease: "power3.inOut" }, "<")
        .set(root.current, { display: "none" });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="intro pointer-events-none fixed inset-0 z-[100] flex-col items-center justify-center [background:inherit]"
    >
      <div className="flex items-center text-ink">
        <Monogram size={52} />
        <span ref={name} className="block w-0 overflow-hidden whitespace-nowrap">
          <span className="flex pl-5 text-xl font-semibold tracking-[0.18em] md:pl-6 md:text-2xl">
            {profile.name.toUpperCase().split("").map((c, i) => (
              <span key={i} data-intro-char className="inline-block whitespace-pre">
                {c}
              </span>
            ))}
          </span>
        </span>
      </div>

      <div data-load-ui className="mt-12 w-[min(22rem,72vw)]">
        <div ref={track} className="relative h-px bg-line">
          <span ref={fill} className="absolute inset-0 origin-left scale-x-0 bg-accent" />
          {shipFlow.map((s, i) => (
            <span
              key={s.label}
              data-load-node
              data-on="false"
              className="absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-paper transition-colors duration-200 data-[on=true]:border-accent data-[on=true]:bg-accent"
              style={{ left: `${(i / (shipFlow.length - 1)) * 100}%` }}
            />
          ))}
          <span
            ref={light}
            className="absolute top-1/2 left-0 -mt-1 -ml-1 size-2 rounded-full bg-accent"
            style={{ boxShadow: "0 0 0 4px color-mix(in srgb, var(--color-accent) 14%, transparent), 0 0 12px var(--color-accent)" }}
          />
        </div>
        <div className="mt-4 flex justify-between font-mono text-[11px] text-slate">
          <span>{shipFlow[0].label}</span>
          <span ref={status} className="text-accent">
            deploying · {shipFlow[0].label.toLowerCase()}
          </span>
          <span>{shipFlow[shipFlow.length - 1].label}</span>
        </div>
      </div>
    </div>
  );
}
