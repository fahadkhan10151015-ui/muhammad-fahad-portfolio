"use client";
/* Global UI chrome: scroll progress, section indicator, section markers. */
import { useEffect, useRef } from "react";
import { navLinks, type SectionId } from "@/data/portfolio";
import { scrollToId } from "@/lib/motion";

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-gold-3 via-gold to-gold-2" />
    </div>
  );
}

/** Left-edge section indicator ("03 / Skills"). */
export function SideIndicator({ active }: { active: SectionId }) {
  const idx = Math.max(0, navLinks.findIndex((l) => l.id === active));
  return (
    <aside aria-label="Section navigation" className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block 2xl:left-10">
      <div className="mb-6 font-mono text-[0.7rem] leading-relaxed">
        <span className="text-gold">0{idx + 1}</span>
        <span className="block text-dim">/</span>
        <span className="block text-bone/80">{navLinks[idx]?.label}</span>
      </div>
      <ul className="flex flex-col gap-3">
        {navLinks.map((l, i) => (
          <li key={l.id}>
            <button
              type="button"
              onClick={() => scrollToId(l.id)}
              aria-label={`Go to ${l.label}`}
              aria-current={i === idx ? "true" : undefined}
              className="group flex h-4 w-4 items-center justify-center"
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  i === idx ? "h-2 w-2 bg-gold shadow-[0_0_10px_rgba(230,176,74,0.9)]" : "h-1.5 w-1.5 bg-white/25 group-hover:bg-white/60"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function SectionMarker({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.25em]" aria-hidden>
      <span className="text-gold">{num}</span>
      <span className="h-px w-8 bg-gold/50" />
      <span className="text-mute">{label}</span>
    </div>
  );
}
