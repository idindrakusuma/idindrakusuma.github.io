import Image from 'next/image';
import { EXPERIENCES } from '@/lib/site-data';
import Reveal from './Reveal';
import Section from './Section';
import SectionHeading from './SectionHeading';
import TimelineLine from './TimelineLine';

export default function Experience() {
  return (
    <Section id="experience" eyebrow="Experience">
      <SectionHeading className="mb-11">Where I&apos;ve made an impact</SectionHeading>

      <div className="ik-timeline relative pl-1.5">
        <TimelineLine />

        {EXPERIENCES.map((exp) => (
          <Reveal key={exp.company} data-timeline-item="" className="ik-timeline-item relative mb-[26px] pl-16">
            {exp.isCurrent && (
              <span
                aria-hidden="true"
                className="ik-timeline-ping bg-primary absolute top-1 left-1.5 z-1 h-10 w-10 rounded-[11px]"
                style={{ animation: 'ik-ping 2s cubic-bezier(0,0,.2,1) infinite' }}
              />
            )}

            <div
              data-timeline-badge=""
              className="ik-timeline-badge border-line-2 shadow-card-sm absolute top-1 left-1.5 z-2 h-10 w-10 overflow-hidden rounded-[11px] border bg-white"
            >
              <Image
                src={exp.logo}
                alt={`${exp.company} logo`}
                width={40}
                height={40}
                className="h-full w-full rounded-[10px] object-contain"
              />
            </div>

            <div className="bg-surface border-line shadow-card-sm hover:border-line-2 hover:shadow-card rounded-[18px] border px-[26px] py-6 max-sm:px-5 transition-[translate,border-color,box-shadow] duration-400 hover:-translate-y-[4px]">
              <div className="mb-[18px] flex flex-wrap items-center justify-between gap-2.5">
                <h3 className="font-display m-0 text-xl font-semibold">{exp.company}</h3>
                {exp.award && (
                  // One line always: where it doesn't fit beside (or under) the
                  // company name, it scrolls sideways, with no scrollbar drawn.
                  <span className="ik-no-scrollbar text-primary bg-surface-3 border-line max-w-full overflow-x-auto rounded-full border px-[11px] py-[5px] text-xs font-medium whitespace-nowrap">
                    ★ {exp.award}
                  </span>
                )}
              </div>

              {exp.roles.map((role) => (
                <div key={role.title} className="border-line border-t py-3.5">
                  {/* Badges are flex items spaced by `gap`, not by a margin of
                      their own: a badge that wraps under a long title starts
                      flush left instead of indented by a gap with nothing
                      beside it. */}
                  <div className="mb-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                    <span className="text-ink text-[15.5px] font-semibold">{role.title}</span>
                    {role.current && (
                      <span
                        className="inline-flex rounded-full px-[9px] py-[3px] text-[11px] font-semibold"
                        style={{ color: '#34c77b', background: 'rgb(52 199 123 / 0.12)' }}
                      >
                        CURRENT
                      </span>
                    )}
                    {/* Employment type sits with the title, not in the period
                        row below, so that row stays one line on a phone. */}
                    {role.type && (
                      <span className="text-muted bg-surface-3 border-line inline-flex rounded-full border px-[9px] py-[2px] text-[11px] font-semibold whitespace-nowrap">
                        {role.type}
                      </span>
                    )}
                  </div>

                  <div className="ik-no-scrollbar font-mono text-faint mb-3 flex gap-x-4 overflow-x-auto text-xs whitespace-nowrap max-sm:gap-x-2 max-sm:text-[11px]">
                    <span>{role.period}</span>
                    <span aria-hidden="true">·</span>
                    <span>{role.location}</span>
                  </div>

                  <ul className="m-0 flex list-none flex-col gap-[9px] p-0">
                    {role.points.map((point) => (
                      <li
                        key={point}
                        className="text-muted relative pl-5 text-[14.5px] leading-[1.55]"
                      >
                        <span
                          aria-hidden="true"
                          className="bg-primary absolute top-[9px] left-0 h-1.5 w-1.5 rounded-full"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
