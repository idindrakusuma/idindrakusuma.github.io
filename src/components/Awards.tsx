import { AWARDS } from '@/lib/site-data';
import AwardsMarquee from './AwardsMarquee';
import Reveal from './Reveal';
import SectionEyebrow from './SectionEyebrow';

/** Newest first. The source array is ordered for reading, not for display. */
const SORTED_AWARDS = [...AWARDS].sort((a, b) => b.year - a.year);

export default function Awards() {
  return (
    <section id="awards" className="mx-auto max-w-[1160px] px-6 pt-[60px] pb-[30px]">
      <SectionEyebrow label="04 — Honors" />

      <Reveal
        as="h2"
        className="font-display mb-3.5 text-[clamp(28px,4vw,40px)] font-bold tracking-[-.02em]"
      >
        Awards &amp; recognition
      </Reveal>

      <Reveal as="p" className="text-muted mb-10 max-w-[620px] text-[clamp(15px,2vw,17px)]">
        A few moments where the work was recognized — from enterprise-scale impact awards at ByteDance and
        Tokopedia to student innovation and startup competitions.
      </Reveal>

      {/* The reveal sits here rather than on the cards: it animates `transform`,
          which the marquee track needs for itself. */}
      <Reveal>
        <AwardsMarquee awards={SORTED_AWARDS} />
      </Reveal>
    </section>
  );
}
