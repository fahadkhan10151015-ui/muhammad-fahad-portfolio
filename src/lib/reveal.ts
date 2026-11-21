"use client";
import { useLayoutEffect, type RefObject } from "react";
import { gsap, ScrollTrigger, SplitText } from "./motion";
import { prefersReducedMotion } from "./env";

/**
 * Scroll reveals. Elements opt in with data-reveal = words | mask | line | up | stagger.
 * Nothing is hidden until the animation is set up, so content is always visible
 * without JS or with reduced motion.
 */
export function useReveal(scopeRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!enabled || !scope || prefersReducedMotion()) return undefined;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      const st = (el: Element, start = "top 85%") => ({ trigger: el, start, once: true });
      scope.querySelectorAll<HTMLElement>('[data-reveal="words"]').forEach((el) => {
        const split = SplitText.create(el, { type: "words", mask: "words" });
        splits.push(split);
        gsap.from(split.words, { yPercent: 110, duration: 1.05, ease: "expo.out", stagger: 0.06, scrollTrigger: st(el) });
      });
      scope.querySelectorAll<HTMLElement>('[data-reveal="mask"]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)", y: 20 },
          { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1, ease: "expo.out", scrollTrigger: st(el), clearProps: "clipPath,transform" },
        );
      });
      scope.querySelectorAll<HTMLElement>('[data-reveal="line"]').forEach((el) => {
        gsap.from(el, { scaleX: 0, transformOrigin: "left center", duration: 1.2, ease: "expo.inOut", scrollTrigger: st(el, "top 92%") });
      });
      scope.querySelectorAll<HTMLElement>('[data-reveal="up"]').forEach((el) => {
        gsap.from(el, { y: 30, autoAlpha: 0, duration: 0.9, scrollTrigger: st(el) });
      });
      scope.querySelectorAll<HTMLElement>('[data-reveal="stagger"]').forEach((el) => {
        gsap.from(el.children, { y: 34, autoAlpha: 0, duration: 0.8, stagger: 0.07, scrollTrigger: st(el, "top 88%"), clearProps: "transform" });
      });
    }, scope);
    ScrollTrigger.refresh();
    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, [enabled, scopeRef]);
}
