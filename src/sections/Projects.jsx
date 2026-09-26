import { forwardRef, useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Section from "../components/Section.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import Icon from "../components/Icon.jsx";
import { GitHubIcon } from "../components/BrandIcons.jsx";
import { projectFilters, projects } from "../data/portfolio.js";

const ease = [0.22, 1, 0.36, 1];

// Visual treatment per project type. Same structure, slightly different tone.
const typeStyles = {
  web: {
    badge: "border-white/15 bg-white/[0.06] text-bone/90",
    well: "from-steel to-graphite",
    glow: "rgb(255 255 255 / 0.07)",
    bar: "from-white/50 via-white/15",
  },
  ios: {
    badge: "border-slate-300/25 bg-slate-300/[0.09] text-slate-200",
    well: "from-slate-500/40 to-graphite",
    glow: "rgb(203 213 225 / 0.10)",
    bar: "from-slate-300/60 via-slate-300/15",
  },
  programming: {
    badge: "border-zinc-300/20 bg-zinc-300/[0.07] text-zinc-200",
    well: "from-zinc-600/40 to-graphite",
    glow: "rgb(212 212 216 / 0.08)",
    bar: "from-zinc-300/50 via-zinc-300/15",
  },
  seo: {
    badge: "border-stone-300/25 bg-stone-300/[0.09] text-stone-200",
    well: "from-stone-500/40 to-graphite",
    glow: "rgb(214 211 209 / 0.10)",
    bar: "from-stone-300/60 via-stone-300/15",
  },
};

// forwardRef: AnimatePresence (popLayout) needs a ref to measure the exiting card.
const ProjectCard = forwardRef(function ProjectCard({ project, number, index }, forwardedRef) {
  const ref = useRef(null);
  const setRef = useCallback(
    (node) => {
      ref.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef]
  );
  const style = typeStyles[project.type] ?? typeStyles.web;
  const tech = (project.tech || []).filter(Boolean);
  const hasLinks = project.liveUrl || project.repoUrl;

  // Soft light that follows the pointer across the card and its border.
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <motion.article
      ref={setRef}
      layout
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease, layout: { duration: 0.4, ease } }}
      whileHover={{ y: -4 }}
      className="spotlight group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.09] bg-linear-to-b from-graphite/70 to-charcoal transition-colors duration-300 hover:border-white/20"
    >
      {/* accent bar */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-px bg-linear-to-r ${style.bar} to-transparent`}
      />
      {/* soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(380px circle at var(--x, 50%) var(--y, 50%), ${style.glow}, transparent 55%)` }}
      />

      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <span
            className={`grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br ${style.well} text-bone ring-1 ring-white/10 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110`}
          >
            <Icon name={project.icon} className="h-5 w-5" />
          </span>
          <p
            className="text-4xl font-bold leading-none tracking-[-0.05em] text-white/20 transition-colors duration-300 group-hover:text-white/45"
            aria-label={`Project ${number}`}
          >
            {number}
          </p>
        </div>

        <p className={`mt-6 inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${style.badge}`}>
          {project.category}
        </p>
        <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-bone text-balance">{project.title}</h3>
        <p className="mt-3 leading-relaxed text-ash text-pretty">{project.description}</p>

        <div className="mt-auto pt-6">
          {tech.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
              {tech.map((t) => (
                <li key={t} className="rounded-full bg-graphite px-3 py-1 text-sm text-bone/85 ring-1 ring-white/[0.07]">
                  {t}
                </li>
              ))}
            </ul>
          )}

          {hasLinks && (
            <div className={`flex flex-wrap gap-2 ${tech.length > 0 ? "mt-4" : ""}`}>
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} source code (opens in a new tab)`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm text-bone transition-colors hover:border-white/30 hover:bg-white/[0.06]"
                >
                  <GitHubIcon className="h-4 w-4" />
                  Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.linkLabel || "View live"}: ${project.title} (opens in a new tab)`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-bone px-4 text-sm font-medium text-ink transition-colors hover:bg-white"
                >
                  {project.linkLabel || "View live"}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
});

export default function Projects() {
  const [filter, setFilter] = useState("all");

  // Numbers come from the full list so they stay the same while filtering.
  const numbered = projects.map((p, i) => ({ project: p, number: String(i + 1).padStart(2, "0") }));
  const visible = filter === "all" ? numbered : numbered.filter(({ project }) => project.type === filter);

  // Only show tabs that have at least one project.
  const filters = projectFilters.filter((f) => f.id === "all" || projects.some((p) => p.type === f.id));

  return (
    <Section id="projects">
      <SectionHeading
        id="projects"
        title="Projects"
        description="Web, iOS, desktop, programming and SEO work — filter by category."
      />

      <div role="group" aria-label="Filter projects by category" className="mt-10 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className={`relative min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                active ? "border-transparent text-ink" : "border-white/12 text-ash hover:border-white/25 hover:text-bone"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="project-filter"
                  className="absolute inset-0 rounded-full bg-bone"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      <motion.div layout className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map(({ project, number }, i) => (
            <ProjectCard key={project.title} project={project} number={number} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
