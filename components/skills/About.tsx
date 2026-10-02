import { stack } from "@/data/career";
import { Reveal } from "@/components/animations/Reveal";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line py-24 md:py-36">
      <Reveal className="container-x">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-10">
          <h2 id="about-title" data-reveal className="h2 max-w-[12ch]">
            From schema to server.
          </h2>
          <div data-reveal className="space-y-5 text-lg md:text-xl">
            <p className="text-pretty">
              Since 2020 I&apos;ve built software for clients and internal teams: Laravel back ends, React and
              Next.js front ends, and the Linux, Docker and CI/CD layer underneath them.
            </p>
            <p className="text-pretty text-slate">
              At Orevan I own features end to end. I plan the work in Jira, review pull requests, deploy, and keep
              production stable — working directly with clients to turn requirements into systems.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {stack.map((g) => (
            <div key={g.group} data-reveal>
              <h3 className="border-b border-ink pb-3 font-semibold">{g.group}</h3>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-slate sm:block sm:space-y-1.5">
                {g.items.map((item) => (
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
