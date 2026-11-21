"use client";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { projects, projectFilters, GITHUB_URL, type Project } from "@/data/portfolio";
import { useReveal } from "@/lib/reveal";
import { gsap } from "@/lib/motion";
import { prefillContact } from "@/lib/contact-events";
import { prefersReducedMotion } from "@/lib/env";
import { SectionMarker } from "@/components/Chrome";
import ProjectPreview from "@/components/ProjectPreview";
import Icon from "@/components/Icon";

const INTERVAL = 4200;

type FilterId = (typeof projectFilters)[number]["id"];
interface Layout {
  cardW: number;
  R: number;
  zK: number;
  rot: number;
  visible: number;
}

function getLayout(w: number): Layout {
  if (w >= 1280) return { cardW: 390, R: 760, zK: 230, rot: 24, visible: 2 };
  if (w >= 1024) return { cardW: 360, R: 640, zK: 220, rot: 24, visible: 2 };
  if (w >= 640) return { cardW: 330, R: 470, zK: 200, rot: 22, visible: 1 };
  return { cardW: Math.min(310, w * 0.8), R: Math.min(330, w * 0.86), zK: 220, rot: 20, visible: 1 };
}

/** Position on the curved exhibition path for signed offset `o`. */
function pose(o: number, L: Layout) {
  const a = Math.abs(o);
  const s = Math.sign(o);
  const hidden = a > L.visible;
  return {
    x: s * L.R * Math.sin(Math.min(a, L.visible + 1) * 0.52),
    z: -Math.pow(Math.min(a, L.visible + 1), 1.45) * L.zK,
    rotationY: -s * Math.min(a, L.visible + 1) * L.rot,
    scale: 1 - Math.min(a, 3) * 0.09,
    autoAlpha: hidden ? 0 : 1,
    zIndex: 10 - a,
  };
}

function offsetOf(i: number, active: number, n: number): number {
  let o = (((i - active) % n) + n) % n;
  if (o > n / 2) o -= n;
  return o;
}

interface CardProps {
  p: Project;
  index: number;
  total: number;
  offset: number;
  layout: Layout;
  onSelect: (i: number) => void;
}

function ProjectCard({ p, index, total, offset, layout, onSelect }: CardProps) {
  const center = offset === 0;
  const hidden = Math.abs(offset) > layout.visible;
  const ask = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    prefillContact({ subject: p.category.includes("SEO") && !p.category.includes("WEB") ? `SEO enquiry (re: ${p.title})` : `Project enquiry (re: ${p.title})` });
  };
  return (
    <div
      data-card
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${p.title}`}
      aria-hidden={hidden || undefined}
      inert={hidden}
      onClick={() => !center && onSelect(index)}
      className={`card-3d group absolute left-1/2 top-0 flex h-full flex-col overflow-hidden rounded-[22px] border bg-gradient-to-b from-[#141418] to-[#09090b] ${
        center
          ? "border-gold/55 shadow-[0_30px_80px_-30px_rgba(230,176,74,0.45),0_0_0_1px_rgba(248,215,132,0.12)_inset]"
          : "cursor-pointer border-white/10"
      }`}
      style={{ width: layout.cardW, marginLeft: -layout.cardW / 2 }}
    >
      <div className="relative h-[42%] shrink-0 overflow-hidden border-b border-white/[0.07]">
        <div className="h-full transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]">
          <ProjectPreview project={p} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="w-fit rounded-md border border-gold/45 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-gold">
          {p.badge}
        </span>
        <h3 className="mt-3 font-display text-[1.45rem] font-semibold leading-tight tracking-tight text-bone sm:text-[1.6rem]">{p.title}</h3>
        <p className="mt-2 line-clamp-3 text-[0.86rem] leading-relaxed text-mute">{p.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <ul className="flex flex-wrap gap-1.5">
            {p.tags.slice(0, 3).map((t) => (
              <li key={t} className="chip !h-7 !text-[0.7rem]">
                {t}
              </li>
            ))}
          </ul>
          {p.url ? (
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              tabIndex={center ? 0 : -1}
              aria-label={`Open ${p.title} live site`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/60 text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              <Icon name="ArrowUpRight" size={20} />
            </a>
          ) : (
            <a
              href="#contact"
              onClick={ask}
              tabIndex={center ? 0 : -1}
              aria-label={`Enquire about a project like ${p.title}`}
              className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-gold/50 px-3 text-xs font-semibold text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              Enquire <Icon name="ArrowUpRight" size={16} />
            </a>
          )}
        </div>
      </div>
      {/* depth shade for side cards */}
      <div
        data-shade
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[22px] bg-ink transition-opacity duration-700"
        style={{ opacity: Math.min(0.6, Math.abs(offset) * 0.28) }}
      />
    </div>
  );
}

export default function Projects({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const filterBar = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const [filter, setFilter] = useState<FilterId>("ALL");
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [busy, setBusy] = useState(false);
  const [layout, setLayout] = useState<Layout>(() => getLayout(1280));
  const entering = useRef(false);
  const firstRun = useRef(true);
  useReveal(root, ready);

  const list = useMemo(() => projects.filter((p) => filter === "ALL" || p.category.includes(filter)), [filter]);
  const n = list.length;

  useEffect(() => {
    const onResize = () => setLayout(getLayout(window.innerWidth));
    onResize();
    if (prefersReducedMotion()) setAuto(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { threshold: 0.25 });
    if (stage.current) io.observe(stage.current);
    return () => io.disconnect();
  }, []);

  // place cards on the curved path
  useLayoutEffect(() => {
    const cards = stage.current?.querySelectorAll<HTMLElement>("[data-card]") ?? [];
    const reduced = prefersReducedMotion();
    cards.forEach((el, i) => {
      const target = pose(offsetOf(i, active, n), layout);
      if (entering.current) {
        gsap.fromTo(
          el,
          { x: target.x * 0.4, z: -1600, rotationY: target.rotationY * 2, scale: 0.7, autoAlpha: 0 },
          { ...target, duration: reduced ? 0 : 1.15, ease: "expo.out", delay: reduced ? 0 : 0.06 * i },
        );
      } else {
        gsap.to(el, { ...target, duration: reduced || firstRun.current ? 0 : 1.05, ease: "power3.inOut", overwrite: "auto" });
      }
    });
    entering.current = false;
    firstRun.current = false;
  }, [active, n, layout, list]);

  // auto rotation
  const running = auto && !paused && inView && !busy && n > 1;
  useEffect(() => {
    if (!running) return undefined;
    const id = setTimeout(() => setActive((a) => (a + 1) % n), INTERVAL);
    return () => clearTimeout(id);
  }, [running, active, n]);

  // filter pill indicator
  useLayoutEffect(() => {
    const btn = filterBar.current?.querySelector<HTMLElement>(`[data-filter="${filter}"]`);
    if (!btn || !pill.current) return;
    gsap.to(pill.current, {
      x: btn.offsetLeft,
      width: btn.offsetWidth,
      duration: prefersReducedMotion() ? 0 : 0.6,
      ease: "expo.out",
    });
  }, [filter, layout]);

  const go = useCallback((dir: number) => setActive((a) => (((a + dir) % n) + n) % n), [n]);

  const changeFilter = (id: FilterId) => {
    if (id === filter || busy) return;
    const cards = stage.current?.querySelectorAll<HTMLElement>("[data-card]") ?? [];
    if (prefersReducedMotion()) {
      setFilter(id);
      setActive(0);
      return;
    }
    setBusy(true);
    gsap.to(cards, {
      z: -1500,
      rotationY: (i: number) => (i % 2 ? 40 : -40),
      x: (_i: number, el: HTMLElement) => Number(gsap.getProperty(el, "x")) * 0.5,
      autoAlpha: 0,
      duration: 0.55,
      ease: "power3.in",
      stagger: 0.03,
      onComplete: () => {
        entering.current = true;
        setFilter(id);
        setActive(0);
        setBusy(false);
      },
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const current = list[active] || list[0];

  return (
    <section id="projects" ref={root} aria-labelledby="projects-title" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:pl-24">
        <div className="relative flex flex-col items-center text-center">
          <div className="self-start">
            <SectionMarker num="04" label="Projects" />
          </div>
          <p className="eyebrow mt-8 flex items-center gap-2">
            <span className="h-px w-5 bg-gold" /> Featured Work <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </p>
          <h2 id="projects-title" data-reveal="words" className="mt-4 font-display text-[clamp(2.6rem,6.4vw,5rem)] font-semibold leading-none tracking-[-0.03em]">
            My <span className="text-gold-grad">Projects</span>
          </h2>
          <p data-reveal="mask" className="mt-5 max-w-[560px] leading-relaxed text-mute">
            Commercial software, websites and SEO work — from offline billing systems for pharmacies and shops to e-commerce
            stores ranking on Google.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost mt-7 !h-11 lg:absolute lg:right-0 lg:top-0 lg:mt-0"
          >
            View All on GitHub <Icon name="Github" size={17} />
          </a>

          {/* filters */}
          <div
            ref={filterBar}
            role="group"
            aria-label="Filter projects by category"
            className="relative mt-10 flex max-w-full gap-2 overflow-x-auto rounded-full p-1 [scrollbar-width:none]"
          >
            <span ref={pill} aria-hidden className="absolute bottom-1 left-0 top-1 rounded-full bg-gradient-to-b from-gold-2 to-gold shadow-[0_8px_24px_-8px_rgba(230,176,74,0.8)]" />
            {projectFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                data-filter={f.id}
                aria-pressed={filter === f.id}
                onClick={() => changeFilter(f.id)}
                className={`relative z-10 h-10 shrink-0 rounded-full border px-5 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors duration-300 sm:px-6 ${
                  filter === f.id ? "border-transparent font-semibold text-ink" : "border-white/12 text-bone/80 hover:border-gold/50 hover:text-gold-2"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* exhibition stage */}
      <div
        className="relative mt-12 sm:mt-16"
        role="region"
        aria-roledescription="carousel"
        aria-label="Project exhibition"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
        onKeyDown={onKeyDown}
      >
        {/* platform */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[-40px] h-[300px]">
          <div className="platform-ring bottom-[40px] h-[230px] w-[min(1240px,140vw)] border border-white/[0.05]" />
          <div className="platform-ring bottom-[70px] h-[170px] w-[min(1020px,120vw)] border-[1.5px] border-gold/45 shadow-[0_0_40px_rgba(230,176,74,0.25),inset_0_0_40px_rgba(230,176,74,0.12)]" />
          <div className="platform-ring bottom-[95px] h-[120px] w-[min(760px,96vw)] border border-gold/20" />
          <div className="platform-ring bottom-[60px] h-[200px] w-[min(900px,110vw)] bg-[radial-gradient(closest-side,rgba(230,176,74,0.16),transparent)]" />
          <div className="absolute bottom-[150px] left-[6%] h-[3px] w-24 rounded-full bg-gold/70 blur-[1px] shadow-[0_0_14px_rgba(230,176,74,0.9)]" />
          <div className="absolute bottom-[150px] right-[6%] h-[3px] w-24 rounded-full bg-gold/70 blur-[1px] shadow-[0_0_14px_rgba(230,176,74,0.9)]" />
        </div>

        <div ref={stage} className="stage-3d relative mx-auto h-[500px] max-w-[1600px] sm:h-[540px]" style={{ transformStyle: "preserve-3d" }}>
          {list.map((p, i) => (
            <ProjectCard key={`${filter}-${p.id}`} p={p} index={i} total={n} offset={offsetOf(i, active, n)} layout={layout} onSelect={setActive} />
          ))}
        </div>

        <p className="sr-only" aria-live={auto ? "off" : "polite"}>
          {current ? `Showing ${current.title}, project ${active + 1} of ${n}` : ""}
        </p>

        {/* controls */}
        <div className="relative mx-auto mt-10 grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-8 lg:px-12 xl:pl-24">
          <div>
            <button
              type="button"
              onClick={() => setAuto((v) => !v)}
              aria-pressed={auto}
              className="inline-flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-sm text-bone transition-colors hover:border-gold/50"
            >
              <Icon name="RefreshCw" size={16} className={auto && running ? "animate-[spin_4s_linear_infinite]" : ""} />
              <span className="hidden sm:inline">Auto Rotate</span>
              <span className={`font-mono text-xs font-semibold ${auto ? "text-gold" : "text-dim"}`}>{auto ? "ON" : "OFF"}</span>
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-7">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={n < 2}
              aria-label="Previous project"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/45 text-gold transition-[background-color,transform] hover:-translate-x-0.5 hover:bg-gold/10 disabled:opacity-30 sm:h-14 sm:w-14"
            >
              <Icon name="ArrowLeft" size={20} />
            </button>
            <div className="text-center">
              <div className="font-display text-3xl font-semibold tabular sm:text-4xl">
                <span className="text-gold-grad">{String(active + 1).padStart(2, "0")}</span>
                <span className="mx-2 text-bone/50">/</span>
                <span className="text-bone">{String(n).padStart(2, "0")}</span>
              </div>
              <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.4em] text-mute">Projects</div>
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={n < 2}
              aria-label="Next project"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/45 text-gold transition-[background-color,transform] hover:translate-x-0.5 hover:bg-gold/10 disabled:opacity-30 sm:h-14 sm:w-14"
            >
              <Icon name="ArrowRight" size={20} />
            </button>
          </div>

          <div className="hidden justify-self-end font-mono text-[0.66rem] uppercase tracking-[0.2em] text-dim sm:block">
            {current?.status === "ONGOING" ? "Ongoing · Client work" : current?.status === "COMPLETED" ? "Completed · Client work" : "Shipped product"}
          </div>
        </div>

        {/* progress indicators */}
        <div className="mx-auto mt-6 flex max-w-[600px] justify-center gap-1.5 px-5" role="group" aria-label="Choose project">
          {list.map((p, i) => (
            <button
              key={`${filter}-${p.id}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${p.title}`}
              aria-current={i === active ? "true" : undefined}
              className="group relative h-6 w-10 sm:w-12"
            >
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/15 group-hover:bg-white/30">
                {i === active && (
                  <span
                    key={`${active}-${running}`}
                    className={`absolute inset-0 rounded-full bg-gold ${running ? "indicator-fill" : ""}`}
                    style={{ ["--dur" as string]: `${INTERVAL}ms` }}
                  />
                )}
                {i < active && <span className="absolute inset-0 rounded-full bg-gold/40" />}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
