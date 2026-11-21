/* Global UI chrome: custom cursor, scroll progress, section indicator. */
import { useEffect, useRef } from "react";
import { navLinks } from "../data/portfolio";
import { hasFinePointer, prefersReducedMotion } from "../lib/env";
import { scrollToId } from "../lib/motion";

export function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return undefined;
    document.documentElement.classList.add("has-cursor");
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...pos };
    let hover = 0;
    let hoverTarget = 0;
    let visible = false;
    let raf = 0;

    const move = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = pos.x;
        ringPos.y = pos.y;
        dot.current.style.opacity = ring.current.style.opacity = "1";
      }
    };
    const over = (e) => {
      hoverTarget = e.target.closest("a,button,[role='tab'],[data-cursor]") ? 1 : 0;
    };
    const leave = () => {
      visible = false;
      dot.current.style.opacity = ring.current.style.opacity = "0";
    };
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      hover += (hoverTarget - hover) * 0.15;
      dot.current.style.transform = `translate3d(${pos.x}px,${pos.y}px,0) translate(-50%,-50%)`;
      const s = 1 + hover * 0.9;
      ring.current.style.transform = `translate3d(${ringPos.x}px,${ringPos.y}px,0) translate(-50%,-50%) scale(${s})`;
      ring.current.style.borderColor = `rgba(230,176,74,${0.45 + hover * 0.4})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[95] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div ref={ring} className="absolute left-0 top-0 h-9 w-9 rounded-full border opacity-0 transition-opacity duration-300" />
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-gold-2 opacity-0 shadow-[0_0_10px_rgba(248,215,132,0.9)]" />
    </div>
  );
}

export function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? scrollY / max : 0;
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
    };
  }, []);
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-gold-3 via-gold to-gold-2 shadow-[0_0_12px_rgba(230,176,74,0.8)]" />
    </div>
  );
}

/** Left-edge section indicator, like "03 / Skills" in the reference. */
export function SideIndicator({ active }) {
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

export function SectionMarker({ num, label }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.25em]" aria-hidden>
      <span className="text-gold">{num}</span>
      <span className="h-px w-8 bg-gold/50" />
      <span className="text-mute">{label}</span>
    </div>
  );
}
