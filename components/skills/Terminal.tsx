"use client";

import { useRef } from "react";
import { profile } from "@/data/profile";
import { Monogram } from "@/components/identity/Monogram";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const session: { cmd: string; out: string[] }[] = [
  { cmd: "whoami", out: [profile.name, profile.role] },
  { cmd: "stack --core", out: ["Laravel · React · Next.js", "Docker · Linux · MySQL · Redis"] },
  { cmd: "status", out: ["Building production systems"] },
];

/** A visual accent. All text is real DOM text; typing is a clip reveal so screen readers get it whole. */
export function Terminal() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", once: true } });
        gsap.utils.toArray<HTMLElement>("[data-term-block]", root.current).forEach((block) => {
          const cmd = block.querySelector<HTMLElement>("[data-term-cmd]")!;
          tl.fromTo(
            cmd,
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: cmd.textContent!.length * 0.045, ease: `steps(${cmd.textContent!.length})` }
          ).from(block.querySelectorAll("[data-term-out]"), { autoAlpha: 0, duration: 0.2, stagger: 0.08 }, "+=0.12");
        });
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="on-night overflow-hidden rounded-xl border border-night-line bg-night text-[13px] text-night-text shadow-[0_30px_60px_-35px_rgba(16,24,39,0.6)]"
      aria-label="Terminal summary"
      role="group"
    >
      <div className="flex items-center justify-between border-b border-night-line px-4 py-2.5">
        <span className="text-paper">
          <Monogram size={13} nodes={false} />
        </span>
        <span className="font-mono text-[11px]">~/moamen</span>
      </div>
      <div className="space-y-4 px-5 py-5 font-mono leading-relaxed [font-variant-ligatures:none]">
        {session.map((s, i) => (
          <div key={s.cmd} data-term-block>
            <p>
              <span aria-hidden="true" className="text-accent-soft">$ </span>
              <span data-term-cmd className="inline-block text-paper">
                {s.cmd}
              </span>
            </p>
            {s.out.map((line, j) => (
              <p
                key={line}
                data-term-out
                className={i === session.length - 1 && j === s.out.length - 1 ? "caret text-paper" : ""}
              >
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
