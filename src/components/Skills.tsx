import { SKILL_ROWS } from '@/lib/site-data';
import MarqueeRow from './MarqueeRow';
import Reveal from './Reveal';
import Section from './Section';
import SectionHeading from './SectionHeading';

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Skills">
      <SectionHeading>Fullstack &amp; AI-native toolkit</SectionHeading>

      <Reveal as="p" className="text-muted mb-2 max-w-[620px] text-[clamp(15px,2vw,17px)]">
        The stack I reach for day to day — each one I&apos;ve used to ship and maintain{' '}
        <strong className="text-ink font-semibold">production-grade applications</strong> serving real users at
        scale, from frontend to backend to deployment.
      </Reveal>

      <Reveal className="ik-logos flex flex-col gap-[38px] pt-[78px] pb-6">
        {SKILL_ROWS.map((row, index) => (
          <MarqueeRow key={index} row={row} />
        ))}
      </Reveal>
    </Section>
  );
}
