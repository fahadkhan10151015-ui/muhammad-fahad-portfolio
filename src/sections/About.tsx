"use client";
import { useEffect, useRef } from "react";
import { about, services, currentSeo, personal, LINKEDIN_URL, whatsappLink, type Stat as StatData } from "@/data/portfolio";
import { useSceneView } from "@/lib/engine-context";
import { useReveal } from "@/lib/reveal";
import { gsap } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/env";
import { requestAudit } from "@/lib/contact-events";
import { SectionMarker } from "@/components/Chrome";
import Icon, { type IconName } from "@/components/Icon";

function Stat({ value, suffix, label, icon, ready, className = "" }: StatData & { ready: boolean; className?: string }) {
  const num = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = num.current;
    if (!ready || !el || prefersReducedMotion()) return undefined;
    const obj = { v: 0 };
    el.textContent = "0";
    const tween = gsap.to(obj, {
      v: value,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = String(Math.round(obj.v));
      },
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      el.textContent = String(value);
    };
  }, [ready, value]);
  return (
    <div className={`group flex items-center gap-4 px-5 py-6 sm:px-7 lg:py-8 ${className}`}>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/[0.06] text-gold transition-transform duration-500 group-hover:-translate-y-0.5">
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

const quick: { icon: IconName; k: string; v: string; href: string; external?: boolean }[] = [
  { icon: "Mail", k: "Email", v: personal.email, href: `mailto:${personal.email}` },
  { icon: "MessageCircle", k: "WhatsApp", v: personal.phone.display, href: whatsappLink, external: true },
  { icon: "Linkedin", k: "LinkedIn", v: "muhammad-fahad-khan-dev", href: LINKEDIN_URL, external: true },
  { icon: "Briefcase", k: "Work with me", v: "Freelance · Remote", href: "#contact" },
];

export default function About({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const view = useRef<HTMLDivElement>(null);
  useSceneView(view, "about");
  useReveal(root, ready);

  // border layout for the 2×2 (mobile) / 4×1 (desktop) stats grid
  const statBorders = ["border-b border-r lg:border-b-0", "border-b lg:border-b-0 lg:border-r", "border-r", ""];

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
                <p key={p.slice(0, 24)} data-reveal="mask">
                  {p}
                </p>
              ))}
            </div>
            <ul data-reveal="stagger" className="mt-9 grid gap-3 sm:grid-cols-2">
              {quick.map((r) => (
                <li key={r.k}>
                  <a
                    href={r.href}
                    target={r.external ? "_blank" : undefined}
                    rel={r.external ? "noreferrer" : undefined}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.015] px-4 py-3 transition-colors hover:border-gold/40"
                  >
                    <Icon name={r.icon} size={16} className="shrink-0 text-gold" />
                    <span className="min-w-0">
                      <span className="block font-mono text-[0.62rem] uppercase tracking-[0.2em] text-dim">{r.k}</span>
                      <span className="block truncate text-sm text-bone">{r.v}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div ref={view} className="h-[400px] w-full sm:h-[520px] lg:h-[640px]" aria-hidden />
            <p className="pointer-events-none absolute bottom-4 right-2 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-dim">
              Identity · Knowledge · Experience
            </p>
          </div>
        </div>

        {/* statistics */}
        <div data-reveal="mask" className="panel gold-edge mt-14 grid grid-cols-2 lg:grid-cols-4">
          {about.stats.map((s, i) => (
            <Stat key={s.label} {...s} ready={ready} className={`border-white/[0.07] ${statBorders[i]}`} />
          ))}
        </div>

        {/* services + current SEO work */}
        <div className="mt-20 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h3 className="font-display text-2xl font-semibold">What I do</h3>
            <ul data-reveal="stagger" className="mt-6 grid gap-4 md:grid-cols-3">
              {services.map((s) => (
                <li key={s.title} className="panel p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/[0.06] text-gold">
                    <Icon name={s.icon} size={19} />
                  </span>
                  <h4 className="mt-5 font-display text-lg font-semibold text-bone">{s.title}</h4>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-mute">{s.text}</p>
                  <ul className="mt-4 space-y-1.5 text-[0.85rem] text-bone/80">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-2.5 h-px w-3 shrink-0 bg-gold/60" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel gold-edge flex flex-col p-6 sm:p-8">
            <p className="eyebrow flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
                <span className="relative h-2 w-2 rounded-full bg-gold" />
              </span>
              Currently optimising
            </p>
            <ul className="mt-6 space-y-4">
              {currentSeo.map((c) => (
                <li key={c.client} className="border-b border-white/[0.06] pb-4 last:border-0">
                  <p className="font-display text-base font-semibold text-bone">{c.client}</p>
                  <p className="mt-0.5 text-sm text-mute">{c.detail}</p>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-mute">25+ SEO clients served so far — the work is private, details on request.</p>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                requestAudit();
              }}
              className="btn btn-gold mt-6 w-full"
            >
              <Icon name="SearchCheck" size={17} /> Get a Free SEO Audit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
