"use client";

import { useEffect, useRef, useState } from "react";
import { navItems, profile } from "@/data/profile";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export function Nav() {
  const root = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("main section[id]").forEach((s) => observer.observe(s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  // Active-section indicator slides between links.
  useGSAP(
    () => {
      const link = root.current?.querySelector<HTMLElement>(`[data-nav="${active}"]`);
      const reduce = !window.matchMedia(MOTION_OK).matches;
      gsap.to(indicator.current, {
        x: link?.offsetLeft ?? 0,
        width: link?.offsetWidth ?? 0,
        autoAlpha: link ? 1 : 0,
        duration: reduce ? 0 : 0.45,
        ease: "power3.out",
      });
    },
    { dependencies: [active], scope: root }
  );

  // Mobile menu.
  useGSAP(
    () => {
      const reduce = !window.matchMedia(MOTION_OK).matches;
      if (open) {
        gsap.set(panel.current, { display: "flex" });
        gsap.fromTo(panel.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: reduce ? 0 : 0.5, ease: "power3.inOut" });
        gsap.fromTo("[data-menu-link]", { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: reduce ? 0 : 0.5, stagger: reduce ? 0 : 0.05, delay: reduce ? 0 : 0.2, ease: "power3.out" });
      } else if (panel.current?.style.display === "flex") {
        gsap.to(panel.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: reduce ? 0 : 0.4,
          ease: "power3.inOut",
          onComplete: () => void gsap.set(panel.current, { display: "none" }),
        });
      }
    },
    { dependencies: [open], scope: root }
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root}>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || open ? "border-b border-line bg-paper/85 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <nav aria-label="Main" className="container-x flex h-16 items-center justify-between">
          <a href="#top" className="font-semibold tracking-tight" onClick={() => setOpen(false)}>
            {profile.name}
          </a>
  
          <ul className="relative hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  data-nav={item.id}
                  aria-current={active === item.id ? "true" : undefined}
                  className={`block px-3 py-2 text-[0.95rem] transition-colors ${active === item.id ? "text-ink" : "text-slate hover:text-ink"}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <span ref={indicator} aria-hidden="true" className="invisible absolute bottom-0 left-0 h-[2px] w-0 bg-accent" />
          </ul>
  
          <button
            ref={menuButton}
            type="button"
            className="-mr-2 px-2 py-2 text-[0.95rem] font-medium md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      <div
        ref={panel}
        id="mobile-menu"
        className="fixed inset-x-0 top-16 bottom-0 z-40 hidden flex-col justify-between bg-paper px-5 pt-8 pb-10 md:hidden"
      >
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id} className="overflow-hidden">
              <a
                href={`#${item.id}`}
                data-menu-link
                onClick={() => setOpen(false)}
                className={`block py-1 text-[2.6rem] font-semibold tracking-tight ${active === item.id ? "text-accent" : ""}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={`mailto:${profile.links.email}`} className="text-slate">
          {profile.links.email}
        </a>
      </div>
    </div>
  );
}
