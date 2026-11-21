"use client";
import { useLayoutEffect, type RefObject } from "react";
import { gsap, SplitText } from "./motion";
import { prefersReducedMotion } from "./env";

/**
 * Viewport reveals. Elements opt in with data-reveal = words | mask | line | up | stagger.
 *
 * Driven by IntersectionObserver (not ScrollTrigger) on purpose: an element is
 * hidden only after JS has prepared it, animates once when it enters the
 * viewport, and can never be reset to hidden later by a ScrollTrigger refresh
 * (mobile address-bar resizes, late layout changes). A timed safety net shows
 * anything that is still hidden while on screen.
 */
type Reveal = { el: Element; play: () => void; done: boolean };

export function useReveal(scopeRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!enabled || !scope || prefersReducedMotion()) return undefined;
    const splits: SplitText[] = [];
    const reveals: Reveal[] = [];

    const ctx = gsap.context(() => {
      const add = (el: Element, prepare: () => void, play: () => void) => {
        prepare();
        reveals.push({ el, play, done: false });
      };

      scope.querySelectorAll<HTMLElement>('[data-reveal="words"]').forEach((el) => {
        const split = SplitText.create(el, { type: "words", mask: "words" });
        splits.push(split);
        add(
          el,
          () => gsap.set(split.words, { yPercent: 110 }),
          () => gsap.to(split.words, { yPercent: 0, duration: 1.05, ease: "expo.out", stagger: 0.06 }),
        );
      });
      scope.querySelectorAll<HTMLElement>('[data-reveal="mask"]').forEach((el) => {
        add(
          el,
          () => gsap.set(el, { clipPath: "inset(0 0 100% 0)", y: 20 }),
          () => gsap.to(el, { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1, ease: "expo.out", clearProps: "clipPath,transform" }),
        );
      });
      scope.querySelectorAll<HTMLElement>('[data-reveal="line"]').forEach((el) => {
        add(
          el,
          () => gsap.set(el, { scaleX: 0, transformOrigin: "left center" }),
          () => gsap.to(el, { scaleX: 1, duration: 1.2, ease: "expo.inOut" }),
        );
      });
      scope.querySelectorAll<HTMLElement>('[data-reveal="up"]').forEach((el) => {
        add(
          el,
          () => gsap.set(el, { y: 30, autoAlpha: 0 }),
          () => gsap.to(el, { y: 0, autoAlpha: 1, duration: 0.9, clearProps: "transform" }),
        );
      });
      scope.querySelectorAll<HTMLElement>('[data-reveal="stagger"]').forEach((el) => {
        add(
          el,
          () => gsap.set(el.children, { y: 34, autoAlpha: 0 }),
          () => gsap.to(el.children, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.07, clearProps: "transform" }),
        );
      });
    }, scope);

    const run = (r: Reveal) => {
      if (r.done) return;
      r.done = true;
      ctx.add(r.play);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const r = reveals.find((x) => x.el === en.target);
          if (r) run(r);
          io.unobserve(en.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    reveals.forEach((r) => io.observe(r.el));

    // Safety net: anything on screen but still not revealed gets shown.
    const safety = window.setInterval(() => {
      const h = window.innerHeight;
      for (const r of reveals) {
        if (r.done) continue;
        const b = r.el.getBoundingClientRect();
        if (b.top < h && b.bottom > 0) run(r);
      }
      if (reveals.every((r) => r.done)) window.clearInterval(safety);
    }, 1500);

    return () => {
      window.clearInterval(safety);
      io.disconnect();
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, [enabled, scopeRef]);
}
