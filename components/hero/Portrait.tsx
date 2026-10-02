import Image from "next/image";
import { profile } from "@/data/profile";
import { Monogram } from "@/components/identity/Monogram";

// Real stack items wired into the portrait frame like services into a host.
const ports = [
  { label: "Laravel", side: "left", top: "26%" },
  { label: "Next.js", side: "left", top: "60%" },
  { label: "Docker", side: "right", top: "38%" },
  { label: "MySQL", side: "right", top: "72%" },
] as const;

function Crosshair({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className={`absolute size-3 text-accent/50 ${className}`}>
      <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function Portrait() {
  const { src, alt } = profile.avatar;

  return (
    <div className="relative mx-auto w-44 sm:w-56 lg:mr-0 lg:ml-auto lg:w-full lg:max-w-[22rem]">
      {/* MA ↓ portrait */}
      <div className="flex flex-col items-center text-ink" aria-hidden="true">
        <span data-portrait-mark>
          <Monogram size={26} />
        </span>
        <span data-portrait-stem className="block h-6 w-px origin-top bg-accent/40 lg:h-9" />
      </div>

      <div className="relative">
        <Crosshair className="-top-1.5 -left-1.5" />
        <Crosshair className="-top-1.5 -right-1.5" />
        <Crosshair className="-bottom-1.5 -left-1.5" />
        <Crosshair className="-right-1.5 -bottom-1.5" />

        <div
          data-portrait-frame
          className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] border border-line bg-surface"
        >
          <div aria-hidden="true" className="blueprint-fine absolute inset-0" />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "radial-gradient(70% 55% at 50% 42%, rgb(255 255 255 / 0.95), rgb(255 255 255 / 0) 70%)" }}
          />
          {src ? (
            <Image
              data-portrait-img
              src={src}
              alt={alt}
              fill
              priority
              sizes="(min-width: 1024px) 22rem, (min-width: 640px) 14rem, 11rem"
              className="object-cover object-top"
            />
          ) : (
            <div data-portrait-img className="absolute inset-0 flex items-center justify-center text-ink" role="img" aria-label="MA monogram">
              <Monogram size={72} weight={2.2} className="lg:h-[104px] lg:w-auto" />
            </div>
          )}
          <span
            aria-hidden="true"
            className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-line bg-surface/90 px-2.5 py-1 font-mono text-[10px] text-slate"
          >
            <span className="size-1.5 rounded-full bg-accent" />
            Orevan
          </span>
        </div>

        {ports.map((p) => (
          <div
            key={p.label}
            data-portrait-port
            aria-hidden="true"
            className={`absolute hidden -translate-y-1/2 items-center lg:flex ${
              p.side === "left" ? "right-[calc(100%-4px)] flex-row" : "left-[calc(100%-4px)] flex-row-reverse"
            }`}
            style={{ top: p.top }}
          >
            <span className="rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[11px] text-slate">
              {p.label}
            </span>
            <span
              data-port-line
              className={`block h-px w-8 bg-accent/40 xl:w-12 ${p.side === "left" ? "origin-right" : "origin-left"}`}
            />
            <span className="block size-2 rounded-full border-2 border-accent bg-paper" />
          </div>
        ))}
      </div>
    </div>
  );
}
