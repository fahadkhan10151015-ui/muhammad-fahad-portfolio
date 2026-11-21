import { useEffect, useRef, useState } from "react";
import { navLinks, GITHUB_URL, personal } from "../data/portfolio";
import { scrollToId, gsap } from "../lib/motion";
import { prefersReducedMotion } from "../lib/env";
import Icon from "./Icon";

export default function Navbar({ active, ready }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const indicator = useRef(null);
  const links = useRef({});
  const bar = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // sliding active indicator
  useEffect(() => {
    const el = links.current[active];
    if (!el || !indicator.current) return;
    const parent = el.parentElement.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    gsap.to(indicator.current, {
      x: r.left - parent.left + r.width / 2 - 3,
      autoAlpha: 1,
      duration: prefersReducedMotion() ? 0 : 0.6,
      ease: "expo.out",
    });
  }, [active, ready]);

  useEffect(() => {
    if (!ready || prefersReducedMotion()) return;
    gsap.from("[data-nav-item]", { y: -16, autoAlpha: 0, stagger: 0.06, duration: 0.9, ease: "expo.out", delay: 0.15 });
  }, [ready]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      ref={bar}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? "border-b border-white/[0.07] bg-ink/65 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-[var(--nav-h)] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a
          href="#home"
          onClick={go("home")}
          className="group relative flex items-center gap-3"
          aria-label={`${personal.fullName} — back to top`}
        >
          <img
            id="nav-logo"
            src="/logo.svg"
            alt=""
            width="44"
            height="44"
            className="h-10 w-10 transition-[transform,filter] duration-500 group-hover:scale-105 group-hover:brightness-110 sm:h-11 sm:w-11"
            style={{ opacity: ready ? 1 : 0 }}
          />
        </a>

        <ul className="relative hidden items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.02] px-2 py-1.5 md:flex">
          <span
            ref={indicator}
            aria-hidden
            className="pointer-events-none absolute bottom-1 left-0 h-[3px] w-[6px] rounded-full bg-gold opacity-0 shadow-[0_0_10px_rgba(230,176,74,0.9)]"
          />
          {navLinks.map((l) => (
            <li key={l.id} data-nav-item>
              <a
                ref={(el) => (links.current[l.id] = el)}
                href={`#${l.id}`}
                onClick={go(l.id)}
                aria-current={active === l.id ? "true" : undefined}
                className={`block rounded-full px-4 py-2 text-[0.86rem] font-medium transition-colors duration-300 ${
                  active === l.id ? "text-gold-2" : "text-mute hover:text-bone"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2" data-nav-item>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="group hidden h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-bone transition-colors hover:border-gold/60 hover:text-gold-2 sm:inline-flex"
          >
            <Icon name="Github" size={17} className="transition-transform duration-500 group-hover:rotate-[-8deg]" />
            <span>GitHub</span>
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-bone md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--nav-h)] z-40 bg-ink/95 backdrop-blur-xl md:hidden"
      >
        <ul className="flex flex-col gap-1 px-6 pt-8">
          {navLinks.map((l, i) => (
            <li key={l.id} className="border-b border-white/[0.06]">
              <a
                href={`#${l.id}`}
                onClick={go(l.id)}
                className="flex items-baseline justify-between py-5 font-display text-3xl font-semibold text-bone"
              >
                {l.label}
                <span className="font-mono text-xs text-gold">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3 px-6">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn btn-ghost">
            <Icon name="Github" /> GitHub
          </a>
          <a href={personal.cvUrl} download className="btn btn-gold">
            <Icon name="Download" /> Download CV
          </a>
        </div>
      </div>
    </header>
  );
}
