import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Download, MapPin } from "lucide-react";
import Container from "../components/Container.jsx";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import { coreSkills, personalInfo, projects, skillPath } from "../data/portfolio.js";

const ease = [0.22, 1, 0.36, 1];
const group = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const rise = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease } },
};
const word = { hidden: { opacity: 0, y: "0.5em" }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } };
const chipGroup = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.7 } } };
const chip = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } };

/** Right-hand card: core skills (each links to its page) + a short preview of selected projects. */
function HeroPanel() {
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8, ease }}
      className="panel relative overflow-hidden rounded-3xl p-6 sm:p-8"
      aria-label="Core skills and selected projects"
    >
      <div
        aria-hidden="true"
        className="glow pointer-events-none absolute -right-[9rem] -top-[9rem] h-[22rem] w-[22rem] [--glow-color:rgb(255_255_255/0.06)]"
      />

      <div className="relative">
        <h2 className="font-mono text-xs text-ash">// core skills</h2>
        <motion.ul variants={chipGroup} initial="hidden" animate="show" className="mt-4 flex flex-wrap gap-2">
          {coreSkills.map((s) => (
            <motion.li key={s.slug} variants={chip}>
              <Link
                to={skillPath(s.slug)}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-graphite/70 px-3.5 text-sm text-bone/90 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-steel"
              >
                <Icon name={s.icon} className="h-3.5 w-3.5 text-ash" />
                {s.title}
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        {featured.length > 0 && (
          <>
            <div className="my-6 h-px bg-white/[0.08]" />
            <h2 className="font-mono text-xs text-ash">// selected work</h2>
            <ul className="mt-3 divide-y divide-white/[0.06]">
              {featured.map((p) => (
                <li key={p.title}>
                  <a
                    href="#projects"
                    className="group flex min-h-12 items-center gap-3 py-2.5 text-bone transition-colors hover:text-white"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-graphite text-bone/85 transition-colors group-hover:bg-steel">
                      <Icon name={p.icon} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.95rem] font-medium">{p.title}</span>
                      <span className="block text-xs text-ash">{p.category}</span>
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-ash transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </motion.aside>
  );
}

export default function Hero() {
  const nameWords = personalInfo.name.split(" ");

  return (
    <section id="home" aria-labelledby="home-title" className="relative flex min-h-[100svh] items-center pb-20 pt-28 sm:pt-32">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <motion.div variants={group} initial="hidden" animate="show">
            <motion.p variants={rise} className="font-mono text-sm text-ash">
              <span className="text-signal">&gt;</span> Full-Stack · Mobile · SEO · Digital Marketing
            </motion.p>

            {personalInfo.status && (
              <motion.p
                variants={rise}
                className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-3 pr-4 text-sm text-bone"
              >
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-status absolute inset-0 rounded-full bg-signal" />
                  <span className="relative h-2 w-2 rounded-full bg-signal" />
                </span>
                {personalInfo.status}
              </motion.p>
            )}

            <h1
              id="home-title"
              className="mt-5 text-[clamp(1.9rem,4.2vw,3rem)] font-bold leading-[1.05] tracking-[-0.035em] text-bone"
            >
              {nameWords.map((w, i) => (
                <span key={w + i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <motion.span variants={word} className="inline-block">
                    {w}
                  </motion.span>
                  {i < nameWords.length - 1 && <span>&nbsp;</span>}
                </span>
              ))}
            </h1>

            <motion.p variants={rise} className="mt-4 max-w-xl text-lg font-medium tracking-tight text-signal sm:text-xl">
              {personalInfo.title}
            </motion.p>

            <motion.p variants={rise} className="mt-5 max-w-[58ch] text-base leading-relaxed text-ash text-pretty sm:text-[1.05rem]">
              {personalInfo.summary}
            </motion.p>

            <motion.div variants={rise} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="#projects">View Projects</Button>
              <Button href="#contact" variant="secondary">
                Contact Me
              </Button>
              <Button href={personalInfo.cvUrl} download={personalInfo.cvDownloadName} variant="ghost" icon={Download}>
                Download CV
              </Button>
            </motion.div>

            {personalInfo.location && (
              <motion.p variants={rise} className="mt-8 flex items-center gap-2 text-sm text-ash">
                <MapPin className="h-4 w-4 text-bone/70" aria-hidden="true" />
                {personalInfo.location}
              </motion.p>
            )}
          </motion.div>

          <div className="animate-float">
            <HeroPanel />
          </div>
        </div>
      </Container>

      {/* Scroll indicator (only shown where there is room for it) */}
      <a
        href="#about"
        aria-label="Scroll to About"
        className="scroll-cue absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-xs text-ash transition-colors hover:text-bone"
      >
        <span className="font-mono">scroll</span>
        <ChevronDown className="animate-bounce-soft h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  );
}
