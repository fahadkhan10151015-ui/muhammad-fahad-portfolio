import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Section from "../components/Section.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import Icon from "../components/Icon.jsx";
import { Timeline, TimelineItem } from "../components/Timeline.jsx";
import { experience, experiencePath } from "../data/portfolio.js";

export default function Experience() {
  return (
    <Section id="experience">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="experience"
            title="Experience"
            description="Professional roles across SEO, photography, development and digital marketing. Select a role to open its page."
          />
        </div>

        <Timeline label="Work experience">
          {experience.map((job, i) => (
            <TimelineItem key={job.slug} index={i} current={i === 0}>
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link
                  to={experiencePath(job.slug)}
                  aria-label={`${job.role}, ${job.company} — view details`}
                  className="panel group block rounded-2xl p-5 transition-[border-color,box-shadow] duration-300 hover:border-white/25 hover:shadow-[0_20px_50px_-25px_rgb(255_255_255/0.2)] sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-steel to-graphite text-bone ring-1 ring-white/10 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                        <Icon name={job.icon || "Briefcase"} className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold tracking-tight text-bone">{job.role}</h3>
                        <p className="mt-0.5 text-[0.95rem] text-ash">{job.company}</p>
                      </div>
                    </div>
                    {job.date && <p className="shrink-0 pt-1 text-sm text-ash">{job.date}</p>}
                  </div>

                  {job.summary && <p className="mt-4 max-w-[62ch] leading-relaxed text-ash">{job.summary}</p>}

                  <span className="mt-4 inline-flex items-center gap-1 text-sm text-bone/80 transition-colors group-hover:text-bone">
                    View details
                    <ChevronRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </motion.div>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </Section>
  );
}
