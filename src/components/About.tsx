import { STATS } from '@/lib/site-data';
import Reveal from './Reveal';
import Section from './Section';

export default function About() {
  return (
    <Section id="about" eyebrow="About" className="pt-10 pb-[30px]" eyebrowClassName="mb-[30px]">
      {/* Centred, not top-anchored: the stat block runs ~50px taller than the paragraph,
          and balancing the two columns reads better here than aligning their top edges. */}
      <div className="ik-about grid grid-cols-[1.5fr_1fr] items-center gap-11">
        <Reveal
          as="p"
          className="font-display text-ink text-[clamp(22px,3vw,30px)] leading-[1.4] font-normal tracking-[-.01em]"
        >
          {/* The module list that used to live here (Homepage, Flash Sale, Cart, Checkout) is
              the 6+ stat card's job — side by side in this grid, the eye read it twice. The
              prose states the shape of the work instead, in three clauses that answer the
              Frontend, Performance and AI-native delivery cards in Section 03.

              "the performance budget", not "its": the 3× card cites Manage Product and TikTok
              Seller Center, which are seller tooling — pinning the claim to core commerce with
              a pronoun would put the sentence at odds with the card beside it.

              The AI clause is about how the work gets shipped, not about building AI tooling
              for other teams. Those are different claims and only the first one is ours. */}
          I build and maintain{' '}
          <span className="text-primary">core commerce at Tokopedia and TikTok Shop</span>, own the
          performance budget, and use AI agents to ship faster without loosening the bar on tests or
          scale.
        </Reveal>

        <Reveal delay={100} className="grid grid-cols-2 gap-3.5">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface border-line hover:border-primary rounded-2xl border px-4 py-[18px] transition-[translate,border-color] duration-400 hover:-translate-y-[4px]"
            >
              <div className="ik-gradient-text font-display mb-1.5 text-3xl leading-none font-bold">
                {stat.value}
              </div>
              <div className="text-ink text-[12.5px] leading-[1.35] font-semibold">{stat.label}</div>
              {/* Attribution, set back so the card still reads value-first at a glance. */}
              <div className="text-faint mt-1 text-[11px] leading-[1.3]">{stat.context}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
