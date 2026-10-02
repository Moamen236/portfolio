"use client";

import { useMemo, useRef, useState } from "react";
import type { Diagram, DiagramNode } from "@/data/projects";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

const W = 104;
const H = 32;

function edgePath(a: DiagramNode, b: DiagramNode) {
  if (Math.abs(a.x - b.x) < 1) {
    const dir = b.y > a.y ? 1 : -1;
    return `M ${a.x} ${a.y + (dir * H) / 2} L ${b.x} ${b.y - (dir * H) / 2}`;
  }
  const dir = b.x > a.x ? 1 : -1;
  const x1 = a.x + (dir * W) / 2;
  const x2 = b.x - (dir * W) / 2;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${x2} ${b.y}`;
}

type Props = {
  diagram: Diagram;
  width?: number;
  height?: number;
  /** Draws in and runs pulses only while true. */
  active?: boolean;
  /** Nodes become focusable and show their note on hover/focus. */
  interactive?: boolean;
  pulses?: boolean;
  title: string;
  className?: string;
};

export function Schematic({
  diagram,
  width = 520,
  height = 260,
  active = true,
  interactive = false,
  pulses = true,
  title,
  className = "",
}: Props) {
  const root = useRef<SVGSVGElement>(null);
  const frameRef = useRef<SVGGElement>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const byId = useMemo(() => Object.fromEntries(diagram.nodes.map((n) => [n.id, n])), [diagram]);
  const focused = focus ? byId[focus] : null;

  useGSAP(
    () => {
      if (!active) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline();
        tl.from("[data-edge]", { strokeDashoffset: 1, duration: 0.9, ease: "power2.inOut", stagger: 0.06 })
          .from("[data-node]", { autoAlpha: 0, y: 6, duration: 0.5, ease: "power2.out", stagger: 0.05 }, 0.1);
        if (frameRef.current) tl.from(frameRef.current, { autoAlpha: 0, duration: 0.6 }, 0);

        if (pulses) {
          const loops = gsap.utils.toArray<SVGCircleElement>("[data-pulse]", root.current).map((dot, i) => {
            const path = root.current!.querySelector<SVGPathElement>(`[data-edge="${dot.dataset.pulse}"]`)!;
            return gsap
              .timeline({ repeat: -1, repeatDelay: 1.4, delay: 1 + i * 0.45 })
              .set(dot, { autoAlpha: 1 })
              .to(dot, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: 2.4, ease: "none" })
              .set(dot, { autoAlpha: 0 });
          });
          // No animation loops while off-screen.
          ScrollTrigger.create({
            trigger: root.current,
            onToggle: (self) => loops.forEach((t) => (self.isActive ? t.resume() : t.pause())),
          });
        }
      });
    },
    { scope: root, dependencies: [active], revertOnUpdate: true }
  );

  const linked = (e: [string, string]) => focus !== null && (e[0] === focus || e[1] === focus);

  return (
    <figure className={className}>
      <svg
        ref={root}
        viewBox={diagram.columns ? `0 -28 ${width} ${height + 28}` : `0 0 ${width} ${height}`}
        role={title ? "img" : undefined}
        aria-label={title || undefined}
        aria-hidden={title ? undefined : true}
        className="block h-auto w-full overflow-visible"
      >
        {diagram.columns?.map((label, i) => {
          const x = 66 + i * 130;
          return (
            <g key={label} aria-hidden="true">
              <line x1={x} x2={x} y1={-4} y2={height} stroke="currentColor" strokeOpacity={0.1} strokeDasharray="2 4" />
              <text x={x} y={-12} textAnchor="middle" fontSize={10} className="fill-current font-mono" opacity={0.55}>
                {label}
              </text>
            </g>
          );
        })}

        {diagram.frame && (
          <g ref={frameRef}>
            <rect
              x={diagram.frame.x}
              y={diagram.frame.y}
              width={diagram.frame.w}
              height={diagram.frame.h}
              rx={10}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeDasharray="4 5"
            />
            <text
              x={diagram.frame.x + 12}
              y={diagram.frame.y + diagram.frame.h - 10}
              className="fill-current font-mono"
              fontSize={10}
              opacity={0.6}
            >
              {diagram.frame.label}
            </text>
          </g>
        )}

        {diagram.edges.map((e) => {
          const key = `${e[0]}-${e[1]}`;
          return (
            <path
              key={key}
              data-edge={key}
              d={edgePath(byId[e[0]], byId[e[1]])}
              pathLength={1}
              strokeDasharray={1}
              fill="none"
              stroke={linked(e) ? "var(--color-accent)" : "currentColor"}
              strokeOpacity={linked(e) ? 1 : 0.4}
              strokeWidth={linked(e) ? 1.6 : 1}
              style={{ transition: "stroke 0.2s, stroke-opacity 0.2s" }}
            />
          );
        })}

        {pulses &&
          diagram.edges.map((e) => (
            <circle
              key={`p-${e[0]}-${e[1]}`}
              data-pulse={`${e[0]}-${e[1]}`}
              r={2.6}
              fill="var(--color-accent)"
              style={{ visibility: "hidden" }}
            />
          ))}

        {diagram.nodes.map((n) => {
          const on = focus === n.id;
          return (
            <g
              key={n.id}
              transform={`translate(${n.x - W / 2} ${n.y - H / 2})`}
              tabIndex={interactive ? 0 : undefined}
              role={interactive ? "button" : undefined}
              aria-label={interactive ? `${n.label}${n.note ? `: ${n.note}` : ""}` : undefined}
              onMouseEnter={interactive ? () => setFocus(n.id) : undefined}
              onMouseLeave={interactive ? () => setFocus(null) : undefined}
              onFocus={interactive ? () => setFocus(n.id) : undefined}
              onBlur={interactive ? () => setFocus(null) : undefined}
              className={interactive ? "cursor-default outline-none" : undefined}
            >
              {/* Animated inner group, so GSAP never touches the positioning transform. */}
              <g data-node>
                <rect
                  width={W}
                  height={H}
                  rx={6}
                  fill={on ? "var(--color-accent)" : "var(--color-surface)"}
                  stroke={on ? "var(--color-accent)" : "currentColor"}
                  strokeOpacity={on ? 1 : 0.45}
                  style={{ transition: "fill 0.2s, stroke 0.2s" }}
                />
                <circle cx={12} cy={H / 2} r={2.5} fill={on ? "#fff" : "var(--color-accent)"} />
                <text
                  x={22}
                  y={H / 2 + 3.6}
                  fontSize={11}
                  className="font-mono"
                  fill={on ? "#fff" : "currentColor"}
                >
                  {n.label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      {interactive && (
        <figcaption className="mt-3 min-h-[1.6em] text-sm text-slate" aria-live="polite">
          {focused ? (
            <>
              <span className="font-medium text-ink">{focused.label}</span>
              {focused.note ? <span>: {focused.note}</span> : null}
            </>
          ) : (
            "Hover or focus a component to see its role."
          )}
        </figcaption>
      )}
    </figure>
  );
}
