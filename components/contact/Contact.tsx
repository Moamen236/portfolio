"use client";

import { useState } from "react";
import { profile, socialLinks } from "@/data/profile";
import { Reveal } from "@/components/animations/Reveal";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const email = profile.links.email;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line py-24 md:py-40">
      <Reveal className="container-x">
        <h2 id="contact-title" data-reveal className="max-w-[14ch] text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
          Have a project in mind?
        </h2>
        <p data-reveal className="lede mt-6 md:text-xl">
          Let&apos;s build something reliable, scalable, and production-ready.
        </p>

        <div data-reveal className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center md:mt-16">
          <a
            href={`mailto:${email}`}
            className="link-underline w-fit text-[clamp(1.25rem,3vw,2rem)] font-medium tracking-tight break-all"
          >
            {email}
          </a>
          <button
            type="button"
            onClick={copy}
            className="w-fit rounded-full border border-ink/25 px-4 py-1.5 text-sm transition-colors hover:border-ink"
          >
            <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
          </button>
        </div>

        {socialLinks.length > 1 && (
          <ul data-reveal className="mt-10 flex gap-8">
            {socialLinks
              .filter((l) => l.label !== "Email")
              .map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="link-underline font-medium">
                    {l.label}
                  </a>
                </li>
              ))}
          </ul>
        )}
      </Reveal>
    </section>
  );
}
