"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { skillGroups, marquee } from "@/data/portfolio";
import { useSceneView } from "@/lib/engine-context";
import { useReveal } from "@/lib/reveal";
import { gsap, ScrollTrigger } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/env";
import { SectionMarker } from "@/components/Chrome";
import Icon from "@/components/Icon";

export default function Skills({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const [focus, setFocus] = useState(-1);
  const engine = useSceneView(view, "skills");
  useReveal(root, ready);

  // Pin + scrub on desktop: scrolling assembles the technology network.
  useLayoutEffect(() => {
    if (!ready || prefersReducedMotion()) return undefined;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (min-height: 700px)", () => {
      const st = ScrollTrigger.create({
        trigger: pin.current,
        start: "top top",
        end: "+=110%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          engine?.setExternal("skills", { progress: self.progress });
          if (readout.current) readout.current.textContent = String(Math.round(self.progress * 100)).padStart(3, "0");
          setFocus(Math.min(skillGroups.length - 1, Math.floor(self.progress * skillGroups.length * 0.999)));
        },
        onLeave: () => setFocus(-1),
        onLeaveBack: () => setFocus(-1),
      });
      return () => {
        st.kill();
        engine?.setExternal("skills", { progress: undefined });
      };
    });
    return () => mm.revert();
  }, [ready, engine]);

  return (
    <section id="skills" ref={root} aria-labelledby="skills-title" className="relative">
      <div ref={pin} className="relative flex min-h-[100svh] items-center py-24 lg:py-0">
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:px-12 xl:pl-24">
          <div className="lg:py-24">
            <SectionMarker num="03" label="Skills" />
            <p className="eyebrow mt-10">What I work with</p>
            <h2 id="skills-title" data-reveal="words" className="mt-4 font-display text-[clamp(2.5rem,6vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
              Technology <span className="text-gold-grad">Network</span>
            </h2>
            <p data-reveal="mask" className="mt-6 max-w-[520px] leading-relaxed text-mute">
              Languages, frameworks, databases and search optimisation — the stack I use to take a product from idea to a fast,
              discoverable release.
            </p>

            <ul data-reveal="stagger" className="mt-9 grid gap-3 sm:grid-cols-2">
              {skillGroups.map((g, i) => (
                <li
                  key={g.title}
                  className={`rounded-2xl border p-4 transition-[border-color,background-color,transform] duration-500 ${
                    focus === i ? "-translate-y-0.5 border-gold/50 bg-gold/[0.05]" : "border-white/[0.07] bg-white/[0.015]"
                  }`}
                >
                  <h3 className="flex items-center gap-2.5 font-display text-[0.95rem] font-semibold text-bone">
                    <Icon name={g.icon} size={16} className="text-gold" />
                    {g.title}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {g.items.map((s) => (
                      <li key={s} className="chip !h-6 !px-2 !text-[0.7rem]">
                        {s}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div ref={view} data-fallback="skills" className="h-[440px] w-full sm:h-[540px] lg:h-[min(86vh,760px)]" aria-hidden />
            <div className="pointer-events-none absolute right-2 top-2 hidden text-right font-mono text-[0.62rem] uppercase tracking-[0.25em] text-dim lg:block">
              Network assembly
              <span ref={readout} className="tabular mt-1 block font-display text-2xl tracking-normal text-gold">
                000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* technology marquee */}
      <div className="marquee relative border-y border-white/[0.06] py-6" aria-label="Technologies">
        <ul className="marquee-track">
          {[...marquee, ...marquee].map((t, i) => (
            <li
              key={`${t}-${i}`}
              aria-hidden={i >= marquee.length}
              className="flex items-center gap-6 px-6 font-display text-xl font-medium text-bone/55 transition-colors hover:text-gold-2 sm:text-2xl"
            >
              {t}
              <span className="h-1.5 w-1.5 rotate-45 bg-gold/60" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
