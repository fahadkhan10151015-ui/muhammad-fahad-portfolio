import { useEffect, useLayoutEffect, useRef } from "react";
import { personal, GITHUB_URL } from "../data/portfolio";
import { useSceneView } from "../lib/engine";
import { loading } from "../lib/loading";
import { gsap, ScrollTrigger, SplitText, scrollToId } from "../lib/motion";
import { prefersReducedMotion } from "../lib/env";
import Magnetic from "../components/Magnetic";
import Icon from "../components/Icon";

export default function Hero({ entering, ready, no3d }) {
  const root = useRef(null);
  const view = useRef(null);
  const content = useRef(null);
  const inst = useRef(null);
  const enteringRef = useRef(entering);
  enteringRef.current = entering;

  useSceneView(view, "hero", (i) => {
    inst.current = i;
    loading.done("scene");
    if (!i) {
      loading.forceComplete();
      return;
    }
    // two rendered frames = shaders compiled & on screen
    requestAnimationFrame(() => requestAnimationFrame(() => loading.done("frame")));
    if (enteringRef.current) i.start();
  });

  useEffect(() => {
    if (entering && inst.current) inst.current.start();
  }, [entering]);

  // Hero typography reveal, synced with the loader exit
  useLayoutEffect(() => {
    if (!entering || prefersReducedMotion()) return undefined;
    let split;
    const ctx = gsap.context(() => {
      split = SplitText.create("[data-hero-name]", { type: "chars,lines", mask: "lines" });
      const tl = gsap.timeline({ delay: 0.95 });
      tl.from("[data-hero-eyebrow]", { autoAlpha: 0, x: -20, duration: 0.8, ease: "expo.out" })
        .from(split.chars, { yPercent: 115, rotate: 6, duration: 1.1, ease: "expo.out", stagger: 0.025 }, "-=0.5")
        .from("[data-hero-line]", { scaleX: 0, transformOrigin: "left", duration: 1, ease: "expo.inOut" }, "-=0.8")
        .from("[data-hero-fade]", { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.08, ease: "expo.out" }, "-=0.7");
    }, root);
    return () => {
      ctx.revert();
      split && split.revert();
    };
  }, [entering]);

  // scroll: content drifts up and fades as the keyboard recedes
  useLayoutEffect(() => {
    if (!ready || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.to(content.current, {
        yPercent: -18,
        autoAlpha: 0.1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="home"
      ref={root}
      aria-label="Introduction"
      className="relative flex h-[100svh] min-h-[640px] items-center overflow-hidden"
    >
      {/* 3D keyboard + digital core render into this area */}
      <div ref={view} className="absolute inset-0" aria-hidden />
      {no3d && (
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(40%_45%_at_72%_42%,rgba(230,176,74,0.22),transparent_70%)]" />
      )}
      {/* legibility scrims */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,6,8,0.96)_0%,rgba(6,6,8,0.82)_34%,rgba(6,6,8,0.25)_58%,transparent_75%)] max-md:bg-gradient-to-b max-md:from-ink/30 max-md:via-ink/70 max-md:to-ink/30" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div ref={content} className="relative mx-auto w-full max-w-[1440px] px-5 pt-[var(--nav-h)] sm:px-8 lg:px-12 xl:pl-24">
        <div className="max-w-[720px]">
          <p data-hero-eyebrow className="eyebrow flex items-center gap-3">
            <span className="h-px w-10 bg-gold" /> Hello, I'm
          </p>
          <h1
            data-hero-name
            className="mt-5 font-display text-[clamp(2.7rem,7.4vw,6.1rem)] font-semibold uppercase leading-[0.92] tracking-[-0.035em]"
          >
            <span className="block text-bone">{personal.firstName}</span>
            <span className="block text-gold-grad">{personal.lastName}</span>
          </h1>
          <div data-hero-line className="mt-7 h-px w-full max-w-[420px] bg-gradient-to-r from-gold/70 to-transparent" />
          <p data-hero-fade className="mt-6 font-display text-lg font-medium text-bone sm:text-xl">
            {personal.title}
            <span className="mt-1 block font-body text-sm font-normal text-mute">
              {personal.role} · PMAS Arid Agriculture University
            </span>
          </p>
          <p data-hero-fade className="mt-5 max-w-[540px] text-[0.98rem] leading-relaxed text-mute sm:text-base">
            {personal.tagline}
          </p>
          <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href="#projects" onClick={(e) => (e.preventDefault(), scrollToId("projects"))} className="btn btn-gold">
                View My Work <Icon name="ArrowRight" size={17} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" onClick={(e) => (e.preventDefault(), scrollToId("contact"))} className="btn btn-ghost">
                Get In Touch
              </a>
            </Magnetic>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="link-underline ml-2 inline-flex items-center gap-2 text-sm font-medium text-bone/90 hover:text-gold-2"
            >
              <Icon name="Github" size={16} /> GitHub <Icon name="ArrowUpRight" size={15} />
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-7 mx-auto flex max-w-[1440px] items-end justify-between px-5 font-mono text-[0.66rem] uppercase tracking-[0.25em] text-dim sm:px-8 lg:px-12 xl:pl-24">
        <span data-hero-fade className="flex items-center gap-2">
          <Icon name="MapPin" size={13} /> {personal.location}
        </span>
        <span data-hero-fade className="hidden flex-col items-center gap-2 sm:flex">
          <span className="relative h-9 w-[1px] overflow-hidden bg-white/10">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-gold" />
          </span>
          Scroll
        </span>
        <span data-hero-fade className="hidden lg:inline">Move over the keyboard</span>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
