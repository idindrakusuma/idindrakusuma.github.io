import { AWARDS } from '@/lib/site-data';
import AwardCard from './AwardCard';
import Reveal from './Reveal';
import SectionEyebrow from './SectionEyebrow';

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

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {AWARDS.map((award) => (
          <AwardCard key={award.title} award={award} />
        ))}
      </div>
    </section>
  );
}
