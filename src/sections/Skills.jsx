import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Section from "../components/Section.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import Icon from "../components/Icon.jsx";
import Reveal from "../components/Reveal.jsx";
import { coreSkills, skillPages, skillPath, technologies } from "../data/portfolio.js";

const ease = [0.22, 1, 0.36, 1];
const programming = skillPages.find((s) => s.slug === "programming");

function SkillCard({ skill, index }) {
  // Soft light that follows the pointer across the card border.
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <motion.li
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } }}
      className="flex"
    >
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.25, ease }} className="flex w-full">
        <Link
          to={skillPath(skill.slug)}
          onMouseMove={onMove}
          aria-label={`${skill.title} — view details`}
          className="spotlight panel group flex w-full flex-col rounded-3xl p-6 transition-[border-color,box-shadow] duration-300 hover:border-white/25 hover:shadow-[0_24px_60px_-28px_rgb(255_255_255/0.22)] sm:p-7"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-13 w-13 place-items-center rounded-2xl bg-linear-to-br from-steel to-graphite text-bone ring-1 ring-white/10 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
              <Icon name={skill.icon} className="h-6 w-6" />
            </span>
            <span className="font-mono text-sm text-white/25 transition-colors duration-300 group-hover:text-white/50">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <h3 className="mt-6 text-xl font-semibold leading-snug tracking-tight text-bone text-balance">{skill.title}</h3>
          <p className="mt-2 leading-relaxed text-ash text-pretty">{skill.summary}</p>

          {skill.tags?.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-hidden="true">
              {skill.tags.map((t) => (
                <li key={t} className="rounded-full bg-graphite px-2.5 py-1 text-xs text-bone/80 ring-1 ring-white/[0.07]">
                  {t}
                </li>
              ))}
            </ul>
          )}

          <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-bone/80 transition-colors group-hover:text-bone">
            View Details
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </Link>
      </motion.div>
    </motion.li>
  );
}

export default function Skills() {
  return (
    <Section id="skills" className="section-band">
      <SectionHeading
        id="skills"
        title="Core Skills"
        description="The areas I work in every day. Select a skill to open its full page."
      />

      <motion.ul
        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      >
        {coreSkills.map((skill, i) => (
          <SkillCard key={skill.slug} skill={skill} index={i} />
        ))}
      </motion.ul>

      {/* Programming and the technologies live one level down. */}
      <Reveal className="mt-10">
        <div className="panel rounded-3xl p-6 sm:p-8 lg:grid lg:grid-cols-[1fr_1.3fr] lg:gap-10">
          <div>
            <p className="font-mono text-xs text-ash">Programming & technologies</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-bone">{programming.title}</h3>
            <p className="mt-3 leading-relaxed text-ash text-pretty">{programming.page.intro}</p>
            <Link
              to={skillPath(programming.slug)}
              className="group mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 text-sm font-medium text-bone transition-colors hover:border-white/30 hover:bg-white/[0.1]"
            >
              View Programming Details
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 lg:mt-0">
            <p className="text-sm text-ash">Technologies — select one to see where I use it</p>
            <motion.ul
              className="mt-4 flex flex-wrap gap-2.5"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={{ show: { transition: { staggerChildren: 0.04 } } }}
            >
              {technologies.map((t) => (
                <motion.li
                  key={t.label}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } } }}
                >
                  <Link
                    to={t.to}
                    className="group inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/12 bg-graphite/60 px-4 text-sm text-bone/90 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-steel"
                  >
                    {t.label}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 text-ash transition-colors group-hover:text-bone"
                      aria-hidden="true"
                    />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
