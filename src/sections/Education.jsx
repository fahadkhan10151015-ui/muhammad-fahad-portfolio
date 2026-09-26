import { GraduationCap } from "lucide-react";
import Section from "../components/Section.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { Timeline, TimelineItem } from "../components/Timeline.jsx";
import { education } from "../data/portfolio.js";

export default function Education() {
  return (
    <Section id="education" className="section-band">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading id="education" title="Education" description="From school to my Computer Science degree." />
        </div>

        <Timeline label="Education history">
          {education.map((item, i) => (
            <TimelineItem key={item.institution} index={i} current={item.current}>
              <article
                className={`rounded-2xl p-5 transition-colors duration-300 sm:p-6 ${
                  item.current ? "panel border-white/20" : "panel opacity-95 hover:border-white/20"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-linear-to-br from-steel to-graphite text-bone ring-1 ring-white/10">
                      <GraduationCap className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-bone">{item.institution}</h3>
                      <p className="mt-0.5 text-[0.95rem] text-ash">{item.degree}</p>
                    </div>
                  </div>

                  {item.status && (
                    <p
                      className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full px-3 py-1 text-sm ${
                        item.current ? "bg-white/10 text-bone" : "bg-graphite text-bone/85"
                      }`}
                    >
                      {item.current && <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />}
                      {item.status}
                    </p>
                  )}
                </div>
              </article>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </Section>
  );
}
