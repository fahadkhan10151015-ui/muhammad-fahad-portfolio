import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Container from "./Container.jsx";
import Icon from "./Icon.jsx";
import Button from "./Button.jsx";
import Reveal from "./Reveal.jsx";
import { WhatsAppIcon } from "./BrandIcons.jsx";
import {
  emailLink,
  experience,
  experiencePath,
  personalInfo,
  projects,
  skillPages,
  skillPath,
  whatsappLink,
} from "../data/portfolio.js";

const ease = [0.22, 1, 0.36, 1];
const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

/** A grid of items (plain text or { title, text, to }) that fade in one after another. */
function ItemGrid({ items }) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: 0.045 } } }}
      className="grid gap-3 min-[520px]:grid-cols-2"
    >
      {items.map((item) => {
        const isText = typeof item === "string";
        const label = isText ? item : item.title;
        const body = (
          <>
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/[0.08] text-signal">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.95rem] font-medium leading-snug text-bone">{label}</span>
              {!isText && item.text && <span className="mt-1 block text-sm leading-relaxed text-ash">{item.text}</span>}
            </span>
          </>
        );
        const cls =
          "group flex items-start gap-3 rounded-2xl border border-white/[0.09] bg-graphite/50 p-4 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-graphite";
        return (
          <motion.li key={label} variants={cardVariants}>
            {!isText && item.to ? (
              <Link to={item.to} className={cls}>
                {body}
              </Link>
            ) : (
              <div className={cls}>{body}</div>
            )}
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

function SectionBlock({ section, index }) {
  return (
    <Reveal>
      <section
        id={section.id}
        aria-labelledby={`${section.id}-title`}
        className="panel scroll-mt-28 rounded-3xl p-6 sm:p-8 lg:grid lg:grid-cols-[0.85fr_1.4fr] lg:gap-10"
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-linear-to-br from-steel to-graphite text-bone ring-1 ring-white/10">
              <Icon name={section.icon} className="h-5 w-5" />
            </span>
            <p className="font-mono text-xs text-ash">{String(index + 1).padStart(2, "0")}</p>
          </div>
          <h2
            id={`${section.id}-title`}
            className="mt-4 text-2xl font-semibold tracking-tight text-bone text-balance sm:text-[1.75rem]"
          >
            {section.title}
          </h2>
          {section.text && <p className="mt-3 leading-relaxed text-ash text-pretty">{section.text}</p>}
        </div>
        <div className="mt-6 lg:mt-0">
          <ItemGrid items={section.items} />
        </div>
      </section>
    </Reveal>
  );
}

function Workflow({ workflow }) {
  return (
    <Reveal>
      <section aria-labelledby="workflow-title" className="scroll-mt-28">
        <h2 id="workflow-title" className="text-2xl font-semibold tracking-tight text-bone sm:text-3xl">
          {workflow.title}
        </h2>
        {workflow.text && <p className="mt-2 max-w-xl text-ash">{workflow.text}</p>}

        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="relative mt-8 grid gap-6 lg:grid-cols-5 lg:gap-4"
        >
          {/* connector line: vertical on phones, horizontal on large screens */}
          <span aria-hidden="true" className="absolute bottom-6 left-6 top-6 w-px bg-linear-to-b from-white/30 via-white/10 to-white/0 lg:hidden" />
          <span aria-hidden="true" className="absolute left-8 right-8 top-6 hidden h-px bg-linear-to-r from-white/30 via-white/15 to-white/30 lg:block" />
          {workflow.steps.map((step, i) => (
            <motion.li
              key={step.title}
              variants={cardVariants}
              className="relative flex gap-4 lg:flex-col lg:gap-0"
            >
              <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 bg-charcoal text-bone shadow-[0_0_24px_-6px_rgb(255_255_255/0.35)]">
                <Icon name={step.icon} className="h-5 w-5" />
              </span>
              <div className="lg:mt-5">
                <p className="font-mono text-xs text-ash">Step {i + 1}</p>
                <h3 className="mt-1 text-lg font-semibold text-bone">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ash">{step.text}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </section>
    </Reveal>
  );
}

function RelatedCard({ to, href, icon, title, meta }) {
  const cls =
    "group flex h-full items-start gap-4 rounded-2xl border border-white/[0.09] bg-charcoal/70 p-5 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_20px_50px_-28px_rgb(255_255_255/0.25)]";
  const body = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-steel to-graphite text-bone ring-1 ring-white/10 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium leading-snug text-bone">{title}</span>
        {meta && <span className="mt-0.5 block text-sm text-ash">{meta}</span>}
      </span>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-ash transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
        aria-hidden="true"
      />
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <Link to={to} className={cls}>
      {body}
    </Link>
  );
}

function RelatedBlock({ page }) {
  const relatedProjects = (page.projectIds || []).map((id) => projects.find((p) => p.id === id)).filter(Boolean);
  const relatedJobs = (page.experienceSlugs || []).map((s) => experience.find((e) => e.slug === s)).filter(Boolean);
  const relatedSkills = (page.skillSlugs || []).map((s) => skillPages.find((k) => k.slug === s)).filter(Boolean);
  if (relatedProjects.length + relatedJobs.length + relatedSkills.length === 0) return null;

  const group = (title, cards) =>
    cards.length > 0 && (
      <div>
        <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-ash">{title}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards}</div>
      </div>
    );

  return (
    <Reveal>
      <section aria-labelledby="related-title" className="space-y-10">
        <h2 id="related-title" className="text-2xl font-semibold tracking-tight text-bone sm:text-3xl">
          Related work
        </h2>
        {group(
          "Projects",
          relatedProjects.map((p) => (
            <RelatedCard
              key={p.id}
              icon={p.icon}
              title={p.title}
              meta={p.liveUrl ? p.linkLabel || p.liveUrl : p.tech.length > 0 ? p.tech.join(" + ") : p.category}
              {...(p.liveUrl ? { href: p.liveUrl } : { to: "/#projects" })}
            />
          ))
        )}
        {group(
          "Experience",
          relatedJobs.map((e) => (
            <RelatedCard key={e.slug} icon={e.icon} title={e.role} meta={e.company} to={experiencePath(e.slug)} />
          ))
        )}
        {group(
          "Related skills",
          relatedSkills.map((s) => (
            <RelatedCard key={s.slug} icon={s.icon} title={s.title} meta={s.tags.join(" · ")} to={skillPath(s.slug)} />
          ))
        )}
      </section>
    </Reveal>
  );
}

/**
 * Shared layout for /skills/:slug and /experience/:slug pages.
 * kind: "skill" | "experience"
 */
export default function DetailPage({ kind, entry }) {
  const isSkill = kind === "skill";
  const title = isSkill ? entry.title : entry.role;
  const page = entry.page;
  const list = isSkill ? skillPages : experience;
  const index = list.findIndex((e) => e.slug === entry.slug);
  const next = list[(index + 1) % list.length];
  const toPath = (e) => (isSkill ? skillPath(e.slug) : experiencePath(e.slug));
  const nextTitle = isSkill ? next.title : `${next.role} — ${next.company}`;

  useEffect(() => {
    document.title = `${title}${entry.company ? ` — ${entry.company}` : ""} | ${personalInfo.name}`;
    return () => {
      document.title = `${personalInfo.name} | Full-Stack & Mobile Developer`;
    };
  }, [title, entry.company]);

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
  const rise = { hidden: { opacity: 0, y: 16, filter: "blur(6px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } } };

  return (
    <article>
      {/* ---------- header ---------- */}
      <header className="relative overflow-hidden pb-14 pt-28 sm:pb-20 sm:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-white/[0.06] blur-[110px]"
        />
        <Container>
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={rise}>
              <Link
                to={isSkill ? "/#skills" : "/#experience"}
                className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 text-sm text-bone transition-colors hover:border-white/30 hover:bg-white/[0.09]"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
                Back to {isSkill ? "Skills" : "Experience"}
              </Link>
            </motion.div>

            <motion.div variants={rise} className="mt-10 flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-steel to-graphite text-bone ring-1 ring-white/15 shadow-[0_0_40px_-10px_rgb(255_255_255/0.35)]">
                <Icon name={entry.icon} className="h-6 w-6" />
              </span>
              <p className="font-mono text-sm text-ash">{page.eyebrow}</p>
            </motion.div>

            <motion.h1
              variants={rise}
              className="mt-5 max-w-4xl text-[clamp(2.4rem,6.5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.04em] text-bone text-balance"
            >
              {title}
            </motion.h1>
            {entry.company && (
              <motion.p variants={rise} className="mt-3 text-xl font-medium text-signal sm:text-2xl">
                {entry.company}
              </motion.p>
            )}
            <motion.p variants={rise} className="mt-7 max-w-3xl text-lg leading-relaxed text-bone/85 text-pretty sm:text-xl">
              {page.intro}
            </motion.p>

            {page.sections.length >= 3 && (
              <motion.nav variants={rise} aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
                {page.sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(s.id)?.scrollIntoView({ block: "start" });
                    }}
                    className="inline-flex min-h-10 items-center rounded-full border border-white/12 px-3.5 text-sm text-ash transition-colors hover:border-white/30 hover:text-bone"
                  >
                    {s.title}
                  </a>
                ))}
                {page.workflow && (
                  <a
                    href="#workflow-title"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("workflow-title")?.scrollIntoView({ block: "center" });
                    }}
                    className="inline-flex min-h-10 items-center rounded-full border border-white/12 px-3.5 text-sm text-ash transition-colors hover:border-white/30 hover:text-bone"
                  >
                    Workflow
                  </a>
                )}
              </motion.nav>
            )}
          </motion.div>
        </Container>
      </header>

      {/* ---------- body ---------- */}
      <div className="section-band py-16 sm:py-24">
        <Container>
          <div className="space-y-16 sm:space-y-24">
            {page.overview?.length > 0 && (
              <Reveal>
                <div className="max-w-3xl space-y-5 border-l border-white/15 pl-6 sm:pl-8">
                  {page.overview.map((p) => (
                    <p key={p} className="text-[1.05rem] leading-relaxed text-ash text-pretty sm:text-lg">
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
            )}

            <div className="space-y-6">
              {page.sections.map((s, i) => (
                <SectionBlock key={s.id} section={s} index={i} />
              ))}
            </div>

            {page.workflow && <Workflow workflow={page.workflow} />}

            <RelatedBlock page={page} />
          </div>
        </Container>
      </div>

      {/* ---------- footer CTA + next ---------- */}
      <Container>
        <div className="grid gap-6 py-16 sm:py-24 lg:grid-cols-2">
          <Reveal>
            <div className="panel h-full rounded-3xl p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-bone">Let's talk</h2>
              <p className="mt-2 text-ash">Questions about this work? Get in touch by email or WhatsApp.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href={emailLink}>Email Fahad</Button>
                <Button href={whatsappLink} external variant="secondary" icon={WhatsAppIcon}>
                  WhatsApp
                </Button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Link
              to={toPath(next)}
              className="group panel flex h-full flex-col justify-between rounded-3xl p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-white/25 sm:p-8"
            >
              <p className="text-sm text-ash">Next {isSkill ? "skill" : "role"}</p>
              <div className="mt-6 flex items-end justify-between gap-4">
                <p className="text-2xl font-semibold tracking-tight text-bone text-balance">{nextTitle}</p>
                <ArrowRight
                  className="h-6 w-6 shrink-0 text-ash transition-transform duration-300 group-hover:translate-x-1 group-hover:text-bone"
                  aria-hidden="true"
                />
              </div>
            </Link>
          </Reveal>
        </div>
      </Container>
    </article>
  );
}
