"use client";

import { useRef, type ElementType, type ComponentPropsWithoutRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Props<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

/** Staggers in descendants marked `data-reveal` once the block scrolls into view. */
export function Reveal<T extends ElementType = "div">({ as, children, ...rest }: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from("[data-reveal]", {
          autoAlpha: 0,
          y: 24,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <Tag ref={root} {...rest}>
      {children}
    </Tag>
  );
}
