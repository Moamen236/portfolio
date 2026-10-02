import { ownership, security } from "@/data/engineering";
import { Reveal } from "@/components/animations/Reveal";
import { Pipeline } from "./Pipeline";

export function Engineering() {
  return (
    <section id="engineering" aria-labelledby="engineering-title" className="border-t border-line">
      <Reveal className="container-x py-24 md:py-36">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-10">
          <h2 id="engineering-title" data-reveal className="h2">
            Beyond writing code
          </h2>
          <p data-reveal className="lede self-end">
            Tickets are the smallest part of the work. The rest is structure, delivery, the servers it runs on and
            what happens when something breaks.
          </p>
        </div>
        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
          {ownership.map((o) => (
            <div key={o.title} data-reveal>
              <h3 className="border-t-2 border-accent pt-4 text-lg font-semibold">{o.title}</h3>
              <p className="mt-2 text-pretty text-slate">{o.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Pipeline />

      <Reveal className="container-x grid gap-12 py-24 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-10 md:py-36">
        <div data-reveal>
          <h2 className="text-[length:var(--text-h3)] font-semibold tracking-tight">Built with security in mind</h2>
          <p className="mt-3 max-w-sm text-pretty text-slate">
            Part of responsible full-stack work, not a separate specialty. OWASP guidance shapes how input, access
            and servers are handled by default.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {security.map((s) => (
            <div key={s.area} data-reveal>
              <h3 className="font-medium">{s.area}</h3>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate sm:block sm:space-y-1.5">
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
