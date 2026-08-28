import { AWARDS } from '@/lib/site-data';
import AwardsMarquee from './AwardsMarquee';
import Reveal from './Reveal';
import Section from './Section';
import SectionHeading from './SectionHeading';

/** Newest first. The source array is ordered for reading, not for display. */
const SORTED_AWARDS = [...AWARDS].sort((a, b) => b.year - a.year);

export default function Awards() {
  return (
    <Section id="awards" eyebrow="Honors">
      <SectionHeading>Awards &amp; recognition</SectionHeading>

      <Reveal as="p" className="text-muted mb-10 max-w-[620px] text-[clamp(15px,2vw,17px)]">
        A few moments where the work was recognized — from enterprise-scale impact awards at ByteDance and
        Tokopedia to student innovation and startup competitions.
      </Reveal>

      {/* The reveal sits here rather than on the cards: it animates `transform`,
          which the marquee track needs for itself. */}
      <Reveal>
        <AwardsMarquee awards={SORTED_AWARDS} />
      </Reveal>
    </Section>
  );
}
