"use client";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { navLinks, GITHUB_URL, LINKEDIN_URL, personal, AUDIT_SUBJECT, type SectionId } from "@/data/portfolio";
import { scrollToId, gsap } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/env";
import { requestAudit } from "@/lib/contact-events";
import Icon from "./Icon";

export default function Navbar({ active, ready }: { active: SectionId; ready: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const list = useRef<HTMLUListElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const links = useRef<Partial<Record<SectionId, HTMLAnchorElement | null>>>({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // sliding active indicator (positioned relative to the link list)
  useEffect(() => {
    const el = links.current[active];
    if (!el || !indicator.current || !list.current) return;
    const parent = list.current.getBoundingClientRect();
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
    gsap.from("[data-nav-item]", { y: -14, autoAlpha: 0, stagger: 0.05, duration: 0.8, ease: "expo.out", delay: 0.15 });
  }, [ready]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: SectionId) => (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };
  const audit = (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    requestAudit();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ${
        scrolled || open ? "border-white/[0.07] bg-ink/90" : "border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-[var(--nav-h)] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#home" onClick={go("home")} className="group relative flex items-center gap-3" aria-label={`${personal.fullName} — back to top`}>
          <img
            id="nav-logo"
            src="/logo.svg"
            alt=""
            width={44}
            height={44}
            className="h-10 w-10 transition-[transform,filter] duration-500 group-hover:scale-105 group-hover:brightness-110 sm:h-11 sm:w-11"
            style={{ opacity: ready ? 1 : 0 }}
          />
        </a>

        <ul ref={list} className="relative hidden items-center gap-1 rounded-full border border-white/[0.07] bg-ink/60 px-2 py-1.5 md:flex">
          <span
            ref={indicator}
            aria-hidden
            className="pointer-events-none absolute bottom-1 left-0 h-[3px] w-[6px] rounded-full bg-gold opacity-0 shadow-[0_0_10px_rgba(230,176,74,0.9)]"
          />
          {navLinks.map((l) => (
            <li key={l.id} data-nav-item>
              <a
                ref={(el) => {
                  links.current[l.id] = el;
                }}
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

        <div className="flex items-center gap-2">
          <a
            data-nav-item
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 text-bone transition-colors hover:border-gold/60 hover:text-gold-2 sm:inline-flex"
          >
            <Icon name="Github" size={17} />
          </a>
          <a
            data-nav-item
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 text-bone transition-colors hover:border-gold/60 hover:text-gold-2 sm:inline-flex"
          >
            <Icon name="Linkedin" size={16} />
          </a>
          <a data-nav-item href="#contact" onClick={audit} className="btn btn-gold !hidden !h-11 !px-5 !text-[0.82rem] lg:!inline-flex" title={AUDIT_SUBJECT}>
            <Icon name="SearchCheck" size={16} /> Free SEO Audit
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

      <div id="mobile-menu" hidden={!open} className="fixed inset-x-0 bottom-0 top-[var(--nav-h)] z-40 overflow-y-auto bg-ink md:hidden">
        <ul className="flex flex-col gap-1 px-6 pt-6">
          {navLinks.map((l, i) => (
            <li key={l.id} className="border-b border-white/[0.06]">
              <a href={`#${l.id}`} onClick={go(l.id)} className="flex items-baseline justify-between py-5 font-display text-3xl font-semibold text-bone">
                {l.label}
                <span className="font-mono text-xs text-gold">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3 px-6 pb-10">
          <a href="#contact" onClick={audit} className="btn btn-gold">
            <Icon name="SearchCheck" /> Get a Free SEO Audit
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn btn-ghost">
            <Icon name="Github" /> GitHub
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="btn btn-ghost">
            <Icon name="Linkedin" /> LinkedIn
          </a>
        </div>
      </div>
    </header>
  );
}
