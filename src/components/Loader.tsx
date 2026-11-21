"use client";
import { useEffect, useRef, useState } from "react";
import { loading } from "@/lib/loading";
import { gsap } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/env";

/**
 * Full-screen 0 → 100 loader driven by real loading progress.
 * The counter eases toward the real value (never ahead of it) so it rises
 * smoothly without flickering, then a cinematic split reveals the hero while
 * the logo flies into the navbar.
 */
export default function Loader({ onExitStart, onDone }: { onExitStart?: () => void; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLImageElement>(null);
  const counter = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("Initializing experience");
  const target = useRef(0);
  const shown = useRef(0);
  const finished = useRef(false);

  useEffect(() => {
    const unsub = loading.subscribe((p, l) => {
      target.current = p;
      setLabel(l);
    });
    const reduced = prefersReducedMotion();

    // intro
    const intro = gsap.timeline();
    if (!reduced) {
      intro
        .from(logo.current, { scale: 0.7, autoAlpha: 0, filter: "blur(8px)", duration: 1, ease: "expo.out" })
        .from("[data-l-fade]", { autoAlpha: 0, y: 12, stagger: 0.08, duration: 0.8 }, "-=0.6")
        .from("[data-l-grid]", { scaleX: 0, stagger: 0.05, duration: 1.2, ease: "expo.inOut" }, 0);
    }

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const goal = target.current * 100;
      // ease toward the real value; speed limited so numbers never flicker
      const step = Math.max(goal - shown.current, 0) * (1 - Math.exp(-dt * 4));
      shown.current = Math.min(goal, shown.current + Math.min(Math.max(step, dt * 60), dt * 220));
      const v = Math.floor(shown.current + 0.0001);
      if (counter.current) counter.current.textContent = String(v).padStart(3, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${shown.current / 100})`;
      if (v >= 100 && !finished.current) {
        finished.current = true;
        exit();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    function exit() {
      onExitStart?.();
      const navLogo = document.getElementById("nav-logo");
      const tl = gsap.timeline({
        onComplete: () => {
          if (navLogo) navLogo.style.opacity = "1";
          onDone();
        },
      });
      if (reduced) {
        tl.to(root.current, { autoAlpha: 0, duration: 0.4 });
        return;
      }
      tl.to("[data-l-fade]", { autoAlpha: 0, y: -10, duration: 0.26, stagger: 0.03, ease: "power2.in" }, 0.05)
        .to(counter.current, { yPercent: -100, autoAlpha: 0, duration: 0.34, ease: "expo.in" }, 0.05)
        .to(bar.current, { scaleY: 40, autoAlpha: 0, duration: 0.34, ease: "expo.in" }, 0.07);

      if (navLogo && logo.current) {
        const from = logo.current.getBoundingClientRect();
        const to = navLogo.getBoundingClientRect();
        tl.to(
          logo.current,
          {
            x: to.left + to.width / 2 - (from.left + from.width / 2),
            y: to.top + to.height / 2 - (from.top + from.height / 2),
            scale: to.width / from.width,
            duration: 0.64,
            ease: "expo.inOut",
          },
          0.16,
        );
      }
      tl.to("[data-l-top]", { yPercent: -100, duration: 0.62, ease: "expo.inOut" }, 0.25)
        .to("[data-l-bottom]", { yPercent: 100, duration: 0.62, ease: "expo.inOut" }, 0.25)
        .to("[data-l-grid]", { autoAlpha: 0, duration: 0.28 }, 0.25)
        .to(logo.current, { autoAlpha: 0, duration: 0.11 }, 0.56);
    }

    return () => {
      unsub();
      cancelAnimationFrame(raf);
      intro.kill();
    };
  }, []);


  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] overflow-hidden"
      role="progressbar"
      aria-label="Loading portfolio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={label}
    >
      {/* split panels (wipe away on exit) */}
      <div data-l-top className="absolute inset-x-0 top-0 h-1/2 bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(70%_120%_at_50%_100%,rgba(230,176,74,0.10),transparent_70%)]" />
      </div>
      <div data-l-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(230,176,74,0.10),transparent_70%)]" />
      </div>

      {/* architectural grid lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {[18, 50, 82].map((top) => (
          <div key={top} data-l-grid className="absolute inset-x-0 h-px bg-white/[0.06]" style={{ top: `${top}%` }} />
        ))}
        {[12, 88].map((left) => (
          <div key={left} data-l-grid className="absolute inset-y-0 w-px origin-top bg-white/[0.05]" style={{ left: `${left}%` }} />
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <img
          ref={logo}
          src="/logo.svg"
          alt="Muhammad Fahad Khan"
          width="96"
          height="96"
          className="relative z-10 h-20 w-20 will-change-transform sm:h-24 sm:w-24"
        />
        <div className="mt-8 overflow-hidden" data-l-fade>
          <div
            ref={counter}
            className="font-display tabular text-[clamp(7rem,36vw,11rem)] font-semibold leading-none tracking-[-0.04em] text-bone"
          >
            000
          </div>
        </div>
        <div className="relative mt-6 h-px w-[min(340px,70vw)] bg-white/10" data-l-fade>
          <div ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-gold-3 via-gold to-gold-2" />
        </div>
        <p className="eyebrow mt-5 text-center !text-[0.66rem]" data-l-fade aria-live="polite">
          {label}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-6 flex justify-between px-6 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-dim sm:px-10">
        <span data-l-fade>Muhammad Fahad Khan</span>
        <span data-l-fade className="hidden sm:inline">Full-Stack Developer &amp; SEO Specialist</span>
        <span data-l-fade>Portfolio</span>
      </div>
    </div>
  );
}
