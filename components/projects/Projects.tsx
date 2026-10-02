"use client";

import { useRef, useState } from "react";
import { projects, type Project } from "@/data/projects";
import { Schematic } from "@/components/animations/Schematic";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";
import { InteractiveWork } from "./InteractiveWork";

export function Projects() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const motion = useRef(false);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        motion.current = true;
        gsap.from("[data-row]", {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-rows]", start: "top 80%", once: true },
        });
        return () => (motion.current = false);
      });

      // Cursor-following preview, only where hover exists.
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const x = gsap.quickTo(preview.current, "x", { duration: 0.6, ease: "power3" });
        const y = gsap.quickTo(preview.current, "y", { duration: 0.6, ease: "power3" });
        const move = (e: PointerEvent) => {
          x(e.clientX + 28);
          y(e.clientY - 120);
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });
    },
    { scope: root }
  );

  // Detail panels expand to their natural height.
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-panel]", root.current).forEach((panel) => {
        const isOpen = panel.dataset.panel === open;
        gsap.to(panel, {
          height: isOpen ? "auto" : 0,
          duration: motion.current ? 0.7 : 0,
          ease: "power3.inOut",
        });
      });
    },
    { dependencies: [open], scope: root }
  );

  const hover = contextSafe((row: HTMLElement, project: Project | null) => {
    const on = project !== null;
    const d = motion.current ? 0.45 : 0;
    gsap.to(row.querySelector("[data-tint]"), { scaleY: on ? 1 : 0, duration: d, ease: "power3.out" });
    gsap.to(row.querySelectorAll("[data-num]"), { yPercent: on ? -100 : 0, duration: d, ease: "power3.out" });
    gsap.to(row.querySelector("[data-arrow]"), { x: on ? 6 : 0, duration: d, ease: "power3.out" });
    gsap.to(row.querySelector("[data-title]"), { x: on ? 8 : 0, duration: d, ease: "power3.out" });
    gsap.to(row.querySelector("[data-meta]"), { autoAlpha: on ? 1 : 0, y: on ? 0 : 6, duration: d, ease: "power3.out" });

    const canPreview = window.matchMedia(FINE_POINTER).matches && motion.current;
    const show = on && canPreview && open !== project?.slug;
    if (show) setHovered(project);
    gsap.to(preview.current, { autoAlpha: show ? 1 : 0, scale: show ? 1 : 0.94, duration: 0.35, ease: "power3.out" });
  });

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="border-t border-line py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-10">
          <h2 id="work-title" className="h2">
            Selected work
          </h2>
          <p className="lede self-end">
            Enterprise APIs, real-time platforms and SaaS architecture — each carried from first requirement to
            production.
          </p>
        </div>

        <ol data-rows className="mt-16 border-b border-line md:mt-24">
          {projects.map((p, i) => {
            const isOpen = open === p.slug;
            const num = String(i + 1).padStart(2, "0");
            return (
              <li key={p.slug} data-row className="border-t border-line">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`panel-${p.slug}`}
                  data-cursor={isOpen ? "Close" : "Open"}
                  onClick={() => {
                    setOpen(isOpen ? null : p.slug);
                    gsap.to(preview.current, { autoAlpha: 0, duration: 0.2 });
                  }}
                  onMouseEnter={(e) => hover(e.currentTarget, p)}
                  onMouseLeave={(e) => hover(e.currentTarget, null)}
                  className="group relative isolate grid w-full grid-cols-[3rem_minmax(0,1fr)_auto] items-start gap-x-4 py-7 text-left md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,16rem)_7rem] md:items-center md:gap-x-6 md:py-9"
                >
                  <span data-tint aria-hidden="true" className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-surface" />
                  <span aria-hidden="true" className="relative block h-[1.3em] overflow-hidden font-mono text-sm leading-[1.3em] md:pl-2">
                    <span data-num className="block text-slate">{num}</span>
                    <span data-num className="block text-accent">{num}</span>
                  </span>
                  <span className="block">
                    <span data-title className="block text-[length:var(--text-h3)] font-semibold leading-tight tracking-tight md:text-[2.1rem]">
                      {p.name}
                    </span>
                    <span className="mt-1.5 block max-w-xl text-pretty text-slate">{p.summary}</span>
                    <span className="mt-3 block text-sm text-slate md:hidden">{p.tags.join(" · ")}</span>
                  </span>
                  <span className="relative hidden text-sm text-slate md:block">
                    <span data-meta className="invisible absolute bottom-full left-0 mb-1.5 block font-mono text-[11px] text-accent">
                      {p.role}
                    </span>
                    {p.tags.join(" · ")}
                  </span>
                  <span className="flex items-center justify-end gap-2 pt-1 text-[0.95rem] font-medium md:pr-2">
                    <span className="hidden sm:inline">{isOpen ? "Close" : "Explore"}</span>
                    <span data-arrow aria-hidden="true" className="inline-block">
                      <svg width="18" height="18" viewBox="0 0 18 18" className={`transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}>
                        <path d="M3 9h11M10 4.5 14.5 9 10 13.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                  </span>
                </button>

                <div
                  id={`panel-${p.slug}`}
                  data-panel={p.slug}
                  role="region"
                  aria-label={p.name}
                  inert={!isOpen}
                  className="h-0 overflow-hidden"
                >
                  <ProjectDetail project={p} open={isOpen} />
                </div>
              </li>
            );
          })}
        </ol>

        <InteractiveWork />
      </div>

      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none invisible fixed top-0 left-0 z-40 hidden w-[24rem] rounded-xl border border-line bg-surface p-5 text-ink shadow-[0_30px_60px_-30px_rgba(18,23,34,0.35)] md:block"
      >
        {hovered?.diagram ? (
          <Schematic key={hovered.slug} diagram={hovered.diagram} title="" pulses={false} />
        ) : hovered ? (
          <div className="flex aspect-[2/1] flex-col justify-end">
            <p className="text-2xl font-semibold tracking-tight">{hovered.name}</p>
            <p className="mt-1 text-sm text-slate">{hovered.context}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProjectDetail({ project: p, open }: { project: Project; open: boolean }) {
  return (
    <div className="grid gap-10 pt-2 pb-12 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.15fr)] md:gap-x-6 md:pb-16">
      <div className="hidden md:block" />
      <div className="space-y-8">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate">Role</dt>
            <dd className="mt-1 font-medium">{p.role}</dd>
          </div>
          <div>
            <dt className="text-slate">Context</dt>
            <dd className="mt-1 font-medium">{p.context}</dd>
          </div>
        </dl>
        {p.problem && (
          <div>
            <h3 className="font-semibold">Problem</h3>
            <p className="mt-2 max-w-prose text-pretty text-slate">{p.problem}</p>
          </div>
        )}
        {p.challenges && (
          <div>
            <h3 className="font-semibold">Engineering challenges</h3>
            <List items={p.challenges} />
          </div>
        )}
        <div>
          <h3 className="font-semibold">Contribution</h3>
          <List items={p.contribution} />
        </div>
        {p.link && (
          <a href={p.link} target="_blank" rel="noopener noreferrer" className="link-underline font-medium">
            Visit {p.name}
          </a>
        )}
      </div>
      {p.diagram && (
        <div className="self-start md:sticky md:top-24 md:pt-2">
          <h3 className="mb-3 font-semibold">Architecture</h3>
          <div className="rounded-xl border border-line bg-surface p-4 md:p-6">
            <Schematic diagram={p.diagram} active={open} interactive title={`${p.name} architecture`} />
          </div>
        </div>
      )}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 max-w-prose space-y-2 text-slate">
      {items.map((item) => (
        <li key={item} className="relative pl-5 text-pretty">
          <span aria-hidden="true" className="absolute top-[0.7em] left-0 h-px w-2.5 bg-current" />
          {item}
        </li>
      ))}
    </ul>
  );
}
