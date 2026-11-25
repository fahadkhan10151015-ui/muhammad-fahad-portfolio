"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { personal, GITHUB_URL, LINKEDIN_URL } from "@/data/portfolio";
import { useSceneView } from "@/lib/engine-context";
import { loading } from "@/lib/loading";
import { scrollToId } from "@/lib/scroll";
import { useMotion } from "@/lib/use-motion";
import { prefersReducedMotion } from "@/lib/env";
import { requestAudit } from "@/lib/contact-events";
import type { SceneInstance } from "@/three/types";
import Magnetic from "@/components/Magnetic";
import Icon from "@/components/Icon";
import { MobileHeroVisual } from "@/components/MobileScenes";

export default function Hero({ entering, ready, no3d, compact }: { entering: boolean; ready: boolean; no3d: boolean; compact: boolean }) {
  const root = useRef<HTMLElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const inst = useRef<SceneInstance | null>(null);
  const enteringRef = useRef(entering);
  enteringRef.current = entering;
  const [live3d, setLive3d] = useState(false);
  const m = useMotion();

  useSceneView(view, "hero", (i) => {
    inst.current = i;
    loading.done("scene");
    if (!i) {
      loading.forceComplete();
      return;
    }
    // two rendered frames = shaders compiled and on screen
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        loading.done("frame");
        setLive3d(true);
      }),
    );
    if (enteringRef.current) i.start?.();
  });

  useEffect(() => {
    if (entering) inst.current?.start?.();
  }, [entering]);

  // typography reveal, synced with the loader exit
  useLayoutEffect(() => {
    if (!m || !entering || compact || prefersReducedMotion() || !root.current) return undefined;
    const { gsap, SplitText } = m;
    let split: InstanceType<typeof SplitText> | undefined;
    const ctx = gsap.context(() => {
      split = SplitText.create("[data-hero-name]", { type: "chars,lines", mask: "lines" });
      gsap
        .timeline({ delay: 0.55 })
        .from("[data-hero-eyebrow]", { opacity: 0.01, x: -20, duration: 0.8, ease: "expo.out" })
        .from(split.chars, { yPercent: 115, duration: 1, ease: "expo.out", stagger: 0.014 }, "-=0.5")
        .from("[data-hero-line]", { scaleX: 0, transformOrigin: "left", duration: 1, ease: "expo.inOut" }, "-=0.8")
        // opacity starts just above 0 so the text counts as painted immediately (fast LCP) while still fading in
        .from("[data-hero-fade]", { opacity: 0.01, y: 16, duration: 0.8, stagger: 0.07, ease: "expo.out" }, "-=0.7");
    }, root);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [entering, compact, m]);

  // content drifts up as the keyboard recedes
  useLayoutEffect(() => {
    if (!m || !ready || compact || prefersReducedMotion() || !root.current) return undefined;
    const { gsap, ScrollTrigger } = m;
    const ctx = gsap.context(() => {
      gsap.to(content.current, {
        yPercent: -14,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [ready, compact, m]);

  return (
    <section
      id="home"
      ref={root}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden lg:h-[100svh] lg:min-h-[640px] lg:flex-row lg:items-center lg:justify-start"
    >
      <div ref={view} className="absolute inset-0" aria-hidden />
      {/* static render of the 3D scene: shown until WebGL is live, and permanently on devices without a GPU */}
      <picture
        aria-hidden
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${live3d && !no3d ? "opacity-0" : "opacity-100"}`}
      >
        <source media="(max-width: 1023px)" srcSet="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
        <img src="/fallback/hero-desktop.webp" alt="" fetchPriority="high" decoding="async" className="h-full w-full object-cover object-right" />
      </picture>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,6,8,0.96)_0%,rgba(6,6,8,0.82)_34%,rgba(6,6,8,0.25)_58%,transparent_75%)] max-lg:bg-[linear-gradient(180deg,rgba(6,6,8,0.35)_0%,rgba(6,6,8,0.72)_30%,rgba(6,6,8,0.6)_58%,transparent_74%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent max-lg:hidden" />
      <MobileHeroVisual />

      <div ref={content} className="relative mx-auto w-full max-w-[1440px] px-5 pt-[calc(var(--nav-h)+1.5rem)] min-[400px]:pt-[calc(var(--nav-h)+2.5rem)] sm:px-8 lg:px-12 lg:pt-[var(--nav-h)] xl:pl-24">
        <div className="max-w-[720px]">
          <p data-hero-eyebrow className="eyebrow flex items-center gap-3">
            <span className="h-px w-10 bg-gold" /> Hello, I&apos;m
          </p>
          <h1 data-hero-name className="mt-5 font-display text-[clamp(2.7rem,7.4vw,6.1rem)] font-semibold uppercase leading-[0.92] tracking-[-0.035em]">
            <span className="block text-bone">{personal.firstName}</span>
            <span className="block text-gold-grad">{personal.lastName}</span>
          </h1>
          <div data-hero-line className="mt-7 h-px w-full max-w-[420px] bg-gradient-to-r from-gold/70 to-transparent" />
          <p data-hero-fade className="mt-6 font-display text-lg font-medium text-bone sm:text-xl">
            {personal.title}
            <span className="mt-1 block font-mono text-[0.72rem] font-normal uppercase tracking-[0.22em] text-mute">{personal.focus}</span>
          </p>
          <p data-hero-fade className="mt-5 max-w-[540px] text-[0.98rem] leading-relaxed text-mute sm:text-base">
            {personal.tagline}
          </p>
          <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("projects");
                }}
                className="btn btn-gold"
              >
                View My Work <Icon name="ArrowRight" size={17} />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  requestAudit();
                }}
                className="btn btn-ghost"
              >
                <Icon name="SearchCheck" size={17} /> Get a Free SEO Audit
              </a>
            </Magnetic>
          </div>
          <div data-hero-fade className="mt-6 flex items-center gap-5 text-sm">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="link-underline inline-flex items-center gap-2 text-bone/85 hover:text-gold-2">
              <Icon name="Github" size={15} /> GitHub
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="link-underline inline-flex items-center gap-2 text-bone/85 hover:text-gold-2">
              <Icon name="Linkedin" size={14} /> LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* phones & tablets: room for the keyboard under the text */}
      <div aria-hidden className="h-[42vw] min-h-[150px] max-h-[340px] lg:hidden" />

      <div className="pointer-events-none absolute inset-x-0 bottom-7 mx-auto flex max-w-[1440px] items-end justify-between px-5 font-mono max-lg:hidden text-[0.66rem] uppercase tracking-[0.25em] text-dim sm:px-8 lg:px-12 xl:pl-24">
        <span data-hero-fade className="hidden sm:inline">
          5+ yrs · 20+ websites · 25+ SEO clients
        </span>
        <span data-hero-fade className="flex flex-col items-center gap-2 max-sm:mx-auto">
          <span className="relative h-9 w-px overflow-hidden bg-white/10">
            <span className="scrollcue absolute inset-x-0 top-0 h-1/2 bg-gold" />
          </span>
          Scroll
        </span>
        <span data-hero-fade className="hidden lg:inline">
          Move over the keyboard
        </span>
      </div>
    </section>
  );
}
