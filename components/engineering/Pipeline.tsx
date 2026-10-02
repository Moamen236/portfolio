"use client";

import { Fragment, useRef } from "react";
import { pipeline } from "@/data/engineering";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Step = { label: string; note: string; word?: string };
const words = ["Code", "Container", "Server", "Production"];

const IDLE = { border: "#2a3550", text: "#7c879d" };
const LIVE = { border: "rgba(142,160,255,0.6)", text: "#ffffff" };

function Connector({ desktopOnly = false, down = false }: { desktopOnly?: boolean; down?: boolean }) {
  // Vertical below the node on mobile; horizontal into the gap on desktop (unless `down`).
  const place = down
    ? "top-full left-1/2 h-16 w-px"
    : "top-full left-6 h-6 w-px md:top-1/2 md:left-full md:h-px md:w-10";
  return (
    <span
      data-step="conn"
      aria-hidden="true"
      className={`absolute ${place} ${desktopOnly ? "hidden md:block" : ""} bg-night-line`}
    >
      <span className="block h-full w-full origin-top-left bg-accent-soft" />
    </span>
  );
}

function Node({ step, children }: { step: Step; children?: React.ReactNode }) {
  return (
    <li
      data-step="node"
      data-word={step.word}
      className="relative rounded-lg border bg-night-raised px-4 py-4"
      style={{ borderColor: LIVE.border, color: LIVE.text }}
    >
      <span className="flex items-center gap-2.5 font-mono text-sm">
        <span data-dot aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent-soft" />
        {step.label}
      </span>
      <span className="mt-1.5 block text-sm leading-snug text-night-text">{step.note}</span>
      {children}
    </li>
  );
}

export function Pipeline() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none", duration: 1 },
          scrollTrigger: { trigger: "[data-flow]", start: "top 78%", end: "bottom 50%", scrub: 0.6 },
        });
        gsap.utils.toArray<HTMLElement>("[data-step]", root.current).forEach((el) => {
          const kind = el.dataset.step;
          if (kind === "conn") {
            tl.fromTo(el.firstElementChild, { scale: 0 }, { scale: 1 });
          } else if (kind === "frame") {
            tl.fromTo(el, { borderColor: IDLE.border }, { borderColor: LIVE.border, duration: 0.5 });
          } else {
            tl.fromTo(el, { borderColor: IDLE.border, color: IDLE.text }, { borderColor: LIVE.border, color: LIVE.text, duration: 0.6 });
            tl.fromTo(el.querySelector("[data-dot]"), { scale: 0.4, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.6 }, "<");
            if (el.dataset.word) {
              tl.fromTo(`[data-word-heading="${el.dataset.word}"]`, { color: IDLE.text }, { color: LIVE.text, duration: 0.6 }, "<");
            }
          }
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="on-night bg-night py-24 text-paper md:py-36">
      <div className="container-x">
        <div className="grid gap-6 md:gap-8">
          <h2 className="h2" aria-label="Code, container, server, production">
            {words.map((w, i) => (
              <Fragment key={w}>
                <span aria-hidden="true" className="whitespace-nowrap">
                  <span data-word-heading={w}>{w}</span>
                  {i < words.length - 1 && <span className="text-accent-soft"> →</span>}
                </span>{" "}
              </Fragment>
            ))}
          </h2>
          <p className="lede text-night-text">
            Shipping is part of the job. This is the path code takes after a merge — and the path a request takes
            back through the stack.
          </p>
        </div>

        <div data-flow className="mt-16 md:mt-24">
          <p className="mb-4 text-sm text-night-text">Deploy path</p>
          <ol className="grid gap-6 md:grid-cols-4 md:gap-10">
            {pipeline.deploy.map((s, i) => (
              <Node key={s.label} step={s}>
                {i < pipeline.deploy.length - 1 ? <Connector /> : <Connector down desktopOnly />}
              </Node>
            ))}
          </ol>

          <p className="mt-14 mb-4 text-sm text-night-text md:hidden">Request path</p>
          <div className="grid gap-6 md:mt-16 md:grid-cols-4 md:gap-10">
            <ol>
              <Node step={pipeline.edge}>
                <Connector />
              </Node>
            </ol>
            <div
              data-step="frame"
              className="rounded-xl border border-dashed p-3 md:col-span-3 md:p-4"
              style={{ borderColor: LIVE.border }}
            >
              <ol className="grid gap-6 md:grid-cols-3 md:gap-10">
                {pipeline.server.nodes.map((s, i) => (
                  <Node key={s.label} step={s}>
                    {i < pipeline.server.nodes.length - 1 && <Connector />}
                  </Node>
                ))}
              </ol>
              <p className="mt-3 font-mono text-xs text-night-text">{pipeline.server.label}</p>
            </div>
          </div>
          <p className="mt-4 hidden text-sm text-night-text md:block">Request path</p>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-night-line pt-8 md:mt-24 md:flex-row md:items-baseline md:gap-10">
          <p className="shrink-0 font-medium">Kept healthy with</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-night-text">
            {pipeline.operations.map((op) => (
              <li key={op}>{op}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
