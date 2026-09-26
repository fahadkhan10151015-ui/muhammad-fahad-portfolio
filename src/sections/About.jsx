import { motion } from "framer-motion";
import Section from "../components/Section.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import Reveal from "../components/Reveal.jsx";
import Icon from "../components/Icon.jsx";
import { aboutHighlights, personalInfo } from "../data/portfolio.js";

const ease = [0.22, 1, 0.36, 1];

export default function About() {
  const facts = [
    personalInfo.location && { label: "Based in", value: personalInfo.location },
    personalInfo.status && { label: "Status", value: personalInfo.status },
  ].filter(Boolean);

  return (
    <Section id="about">
      <SectionHeading id="about" title="About me" description="A quick overview of what I do and the areas I work in." />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
        <Reveal delay={0.05}>
          <div className="panel flex h-full flex-col rounded-3xl p-6 sm:p-8">
            <p className="text-[1.05rem] leading-relaxed mb-8 text-bone/90 text-pretty sm:text-lg">{personalInfo.summary}</p>

            {facts.length > 0 && (
              <dl className="divide-y divide-white/[0.07] border-t border-white/[0.07] lg:mt-auto">
                {facts.map((f) => (
                  <div key={f.label} className="grid gap-1 py-4 sm:grid-cols-[6rem_1fr] sm:gap-6">
                    <dt className="text-sm text-ash">{f.label}</dt>
                    <dd className="text-[0.95rem] text-bone">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </Reveal>

        <motion.ul
          className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
        >
          {aboutHighlights.map((h) => (
            <motion.li
              key={h.label}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
              whileHover={{ y: -3 }}
              className="group flex items-center gap-3.5 rounded-2xl border border-white/[0.09] bg-charcoal/80 p-4 transition-colors duration-300 hover:border-white/25 hover:bg-graphite"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-graphite text-bone ring-1 ring-white/10 transition-colors group-hover:bg-steel">
                <Icon name={h.icon} className="h-5 w-5" />
              </span>
              <span className="text-[0.95rem] font-medium leading-snug text-bone">{h.label}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Section>
  );
}
