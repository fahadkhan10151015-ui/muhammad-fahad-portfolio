import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger, SplitText } from "./motion";
import { prefersReducedMotion } from "./env";

/**
 * Scroll reveals for a section. Elements opt in with data-reveal:
 *   data-reveal="words"  heading words rise out of a mask
 *   data-reveal="mask"   block wipes in with clip-path
 *   data-reveal="line"   rule draws from the left
 *   data-reveal="up"     soft rise (used sparingly)
 *   data-reveal="stagger" children cascade in depth
 * Nothing is hidden until the animation is actually set up, so content is
 * always visible without JS / with reduced motion.
 */
export function useReveal(scopeRef, enabled) {
  useLayoutEffect(() => {
    if (!enabled || !scopeRef.current || prefersReducedMotion()) return undefined;
    const splits = [];
    const ctx = gsap.context(() => {
      const st = (el, start = "top 85%") => ({ trigger: el, start, once: true });

      scopeRef.current.querySelectorAll('[data-reveal="words"]').forEach((el) => {
        const split = SplitText.create(el, { type: "words", mask: "words" });
        splits.push(split);
        gsap.from(split.words, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.06, scrollTrigger: st(el) });
      });
      scopeRef.current.querySelectorAll('[data-reveal="mask"]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)", y: 24 },
          { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.1, ease: "expo.out", scrollTrigger: st(el), clearProps: "clipPath" },
        );
      });
      scopeRef.current.querySelectorAll('[data-reveal="line"]').forEach((el) => {
        gsap.from(el, { scaleX: 0, transformOrigin: "left center", duration: 1.3, ease: "expo.inOut", scrollTrigger: st(el, "top 92%") });
      });
      scopeRef.current.querySelectorAll('[data-reveal="up"]').forEach((el) => {
        gsap.from(el, { y: 36, autoAlpha: 0, duration: 1, scrollTrigger: st(el) });
      });
      scopeRef.current.querySelectorAll('[data-reveal="stagger"]').forEach((el) => {
        gsap.from(el.children, {
          y: 40,
          rotateX: -18,
          transformPerspective: 800,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.08,
          scrollTrigger: st(el, "top 88%"),
        });
      });
    }, scopeRef);
    ScrollTrigger.refresh();
    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, [enabled, scopeRef]);
}
