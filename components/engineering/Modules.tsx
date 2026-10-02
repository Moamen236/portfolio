"use client";

import { useRef } from "react";
import { ownership } from "@/data/engineering";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const ICONS: Record<(typeof ownership)[number]["icon"], React.ReactNode> = {
  layers: (
    <>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 12.5 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </>
  ),
  branch: (
    <>
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="7" r="2" />
      <path d="M6 7v10M18 9c0 5-5 4.5-10.6 8.6" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <path d="M7 7.5h.01M7 16.5h.01M11 7.5h6M11 16.5h6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

export function Modules() {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", once: true } });
        gsap.utils.toArray<HTMLElement>("[data-module]", root.current).forEach((m, i) => {
          tl.from(m, { autoAlpha: 0, y: 20, duration: 0.5, ease: "power3.out" }, i * 0.15);
          const conn = m.querySelector("[data-module-conn] > span");
          if (conn) tl.fromTo(conn, { scale: 0 }, { scale: 1, duration: 0.3, ease: "none" }, i * 0.15 + 0.35);
        });
      });
    },
    { scope: root }
  );

  return (
    <ol ref={root} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {ownership.map((o, i) => (
        <li
          key={o.title}
          data-module
          className="group relative rounded-xl border border-line bg-surface/80 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink/30"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-7 fill-none stroke-ink stroke-[1.5] transition-colors duration-300 group-hover:stroke-accent"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ICONS[o.icon]}
          </svg>
          <h3 className="mt-6 text-lg font-semibold">{o.title}</h3>
          <p className="mt-2 text-pretty text-slate">{o.body}</p>

          {i < ownership.length - 1 && (
            <span
              data-module-conn
              aria-hidden="true"
              className={`absolute top-full left-9 h-6 w-px bg-line sm:top-1/2 sm:left-full sm:h-px sm:w-6 lg:w-8 ${
                i % 2 === 1 ? "sm:hidden lg:block" : ""
              }`}
            >
              <span className="block h-full w-full origin-top-left bg-accent/60 transition-colors duration-300 group-hover:bg-accent" />
              <span className="absolute -top-[3px] -left-[3px] size-[7px] rounded-full border border-accent bg-paper sm:-top-[3px]" />
              <span className="absolute -right-[3px] -bottom-[3px] size-[7px] rounded-full border border-accent bg-paper" />
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
