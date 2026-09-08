import { CAPABILITIES } from '@/lib/site-data';
import CapabilityCard from './CapabilityCard';
import Reveal from './Reveal';
import Section from './Section';
import SectionHeading from './SectionHeading';

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Skills">
      <SectionHeading>Fullstack &amp; AI-native toolkit</SectionHeading>

      <Reveal as="p" className="text-muted mb-9 max-w-[620px] text-[clamp(15px,2vw,17px)]">
        The stack I reach for day to day — each one I&apos;ve used to ship and maintain{' '}
        <strong className="text-ink font-semibold">production-grade applications</strong> serving real users at
        scale, from frontend to backend to deployment.
      </Reveal>

      {/* One Reveal on the grid rather than one per card: the reveal animates
          `transform` with `fill: both`, so a card that carried its own would be
          pinned to `transform: none` afterwards and never lift on hover. */}
      <Reveal className="grid grid-cols-1 gap-4 pb-6 min-[700px]:grid-cols-2">
        {CAPABILITIES.map((capability) => (
          <CapabilityCard key={capability.name} capability={capability} />
        ))}
      </Reveal>
    </Section>
  );
}
