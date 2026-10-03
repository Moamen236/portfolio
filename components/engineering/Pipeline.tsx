import { Fragment } from "react";
import { shipFlow, requestFlow } from "@/data/engineering";
import { SystemFlow } from "./SystemFlow";

const words = ["Code", "Container", "Server", "Production"];

export function Pipeline() {
  return (
    <div className="on-night blueprint-night py-24 text-night-fg md:py-36">
      <div className="container-x">
        <div className="grid gap-6 md:gap-8">
          <h2 className="h2" aria-label="Code, container, server, production">
            {words.map((w, i) => (
              <Fragment key={w}>
                <span aria-hidden="true" className="whitespace-nowrap">
                  <span data-word-heading={w}>{w}</span>
                  {i < words.length - 1 && <span className="text-accent-soft"> →</span>}
                </span>{" "}
              </Fragment>
            ))}
          </h2>
          <p className="lede text-night-text">Shipping is part of the job. This is the path code takes after a merge.</p>
        </div>

        <SystemFlow steps={shipFlow} tone="night" lightWords label="Deploy path from code to production" className="mt-16 md:mt-24" />

        <div className="mt-16 flex flex-col gap-5 border-t border-night-line pt-8 md:mt-24 lg:flex-row lg:items-center lg:gap-10">
          <p className="shrink-0 text-sm text-night-text">And back, per request</p>
          <div className="-mx-5 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0 lg:flex-1">
            <SystemFlow
              steps={requestFlow}
              variant="compact"
              tone="night"
              label="Request path"
              className="min-w-[34rem] lg:min-w-0 lg:flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
