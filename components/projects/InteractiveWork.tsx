import { experiences } from "@/data/projects";
import { Reveal } from "@/components/animations/Reveal";

export function InteractiveWork() {
  return (
    <Reveal className="mt-24 grid gap-10 md:mt-32 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-10">
      <div data-reveal>
        <h3 className="text-[length:var(--text-h3)] font-semibold tracking-tight">Interactive & client-facing work</h3>
        <p className="mt-3 max-w-sm text-pretty text-slate">{experiences.intro}</p>
        <p className="mt-6 max-w-sm text-sm text-slate">{experiences.focus.join(", ")}.</p>
      </div>
      <ul className="grid grid-cols-2 border-t border-line">
        {experiences.items.map((item) => (
          <li key={item.name} data-reveal className="border-b border-line py-5 odd:pr-4 even:border-l even:pl-4 sm:odd:pr-6 sm:even:pl-6">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-slate">{item.kind}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
