import { useEffect, useRef } from "react";
import { about, experience, education, personal } from "../data/portfolio";
import { useSceneView } from "../lib/engine";
import { useReveal } from "../lib/reveal";
import { gsap, ScrollTrigger } from "../lib/motion";
import { prefersReducedMotion } from "../lib/env";
import { SectionMarker } from "../components/Chrome";
import Icon from "../components/Icon";

function Stat({ value, suffix, label, icon, ready }) {
  const num = useRef(null);
  useEffect(() => {
    if (!ready || !num.current) return undefined;
    if (prefersReducedMotion()) return undefined;
    const obj = { v: 0 };
    num.current.textContent = "0";
    const tween = gsap.to(obj, {
      v: value,
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => num.current && (num.current.textContent = String(Math.round(obj.v))),
      scrollTrigger: { trigger: num.current, start: "top 90%", once: true },
    });
    return () => {
      tween.scrollTrigger && tween.scrollTrigger.kill();
      tween.kill();
      if (num.current) num.current.textContent = String(value);
    };
  }, [ready, value]);
  return (
    <div className="group relative flex items-center gap-4 px-5 py-6 sm:px-7 lg:py-8">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/[0.06] text-gold transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-[-4deg]">
        <Icon name={icon} size={20} />
      </span>
      <div>
        <div className="font-display text-3xl font-semibold tracking-tight text-bone sm:text-4xl">
          <span ref={num} className="tabular">
            {value}
          </span>
          <span className="text-gold">{suffix}</span>
        </div>
        <div className="mt-1 text-[0.8rem] text-mute">{label}</div>
      </div>
    </div>
  );
}

export default function About({ ready }) {
  const root = useRef(null);
  const view = useRef(null);
  useSceneView(view, "about");
  useReveal(root, ready);

  // keep ScrollTrigger positions correct when fonts/images settle
  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  return (
    <section id="about" ref={root} aria-labelledby="about-title" className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:pl-24">
        <SectionMarker num="02" label="About" />
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-6">
          <div>
            <p className="eyebrow">Get to know me</p>
            <h2 id="about-title" data-reveal="words" className="mt-4 font-display text-[clamp(2.6rem,6.5vw,5.2rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
              About <span className="text-gold-grad">Me</span>
            </h2>
            <div data-reveal="line" className="mt-8 h-px w-24 bg-gold" />
            <div className="mt-8 space-y-5 text-[1.02rem] leading-relaxed text-mute">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 20)} data-reveal="mask">
                  {p}
                </p>
              ))}
            </div>
            <dl data-reveal="stagger" className="mt-9 grid gap-3 sm:grid-cols-2">
              {[
                { icon: "MapPin", k: "Based in", v: personal.location },
                { icon: "GraduationCap", k: "Studying", v: "BSCS · 7th Semester" },
                { icon: "Briefcase", k: "Currently", v: "Full-Stack Dev & SEO" },
                { icon: "Mail", k: "Email", v: personal.email },
              ].map((r) => (
                <div key={r.k} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.015] px-4 py-3">
                  <Icon name={r.icon} size={16} className="shrink-0 text-gold" />
                  <div className="min-w-0">
                    <dt className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-dim">{r.k}</dt>
                    <dd className="truncate text-sm text-bone">{r.v}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <a href={personal.cvUrl} download className="btn btn-ghost mt-9">
              <Icon name="Download" size={17} /> Download CV
            </a>
          </div>

          {/* Mechanical Orbital Code System */}
          <div className="relative">
            <div ref={view} className="h-[400px] w-full sm:h-[520px] lg:h-[640px]" aria-hidden />
            <p className="pointer-events-none absolute bottom-4 right-2 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-dim">
              Identity · Knowledge · Experience
            </p>
          </div>
        </div>

        {/* statistics */}
        <div data-reveal="mask" className="panel gold-edge mt-14 grid grid-cols-2 divide-white/[0.07] lg:grid-cols-4 lg:divide-x [&>*:nth-child(-n+2)]:border-b [&>*:nth-child(-n+2)]:border-white/[0.07] lg:[&>*]:!border-b-0">
          {about.stats.map((s) => (
            <Stat key={s.label} {...s} ready={ready} />
          ))}
        </div>

        {/* experience + education */}
        <div className="mt-20 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="panel p-6 sm:p-9">
            <h3 className="flex items-center gap-3 font-display text-xl font-semibold">
              <Icon name="Briefcase" size={20} className="text-gold" /> Experience
            </h3>
            <ol data-reveal="stagger" className="relative mt-8 space-y-8 border-l border-white/10 pl-7">
              {experience.map((e) => (
                <li key={e.role} className="relative">
                  <span className="absolute -left-[33px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_12px_rgba(230,176,74,0.8)]" />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h4 className="font-display text-lg font-semibold text-bone">{e.role}</h4>
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-gold">{e.period}</span>
                  </div>
                  <p className="text-sm text-mute">{e.company}</p>
                  <ul className="mt-3 space-y-1.5 text-[0.92rem] leading-relaxed text-bone/75">
                    {e.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-2.5 h-px w-3 shrink-0 bg-gold/60" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
          <div className="panel p-6 sm:p-9">
            <h3 className="flex items-center gap-3 font-display text-xl font-semibold">
              <Icon name="GraduationCap" size={20} className="text-gold" /> Education
            </h3>
            <ol data-reveal="stagger" className="mt-8 space-y-4">
              {education.map((ed, i) => (
                <li key={ed.degree} className={`rounded-2xl border p-5 ${i === 0 ? "border-gold/35 bg-gold/[0.04]" : "border-white/[0.07]"}`}>
                  <div className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-gold">{ed.period}</div>
                  <h4 className="mt-2 font-display text-base font-semibold text-bone">{ed.degree}</h4>
                  <p className="mt-1 text-sm text-mute">{ed.school}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
