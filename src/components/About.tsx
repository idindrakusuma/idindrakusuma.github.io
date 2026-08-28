import { STATS } from '@/lib/site-data';
import Reveal from './Reveal';
import Section from './Section';

export default function About() {
  return (
    <Section id="about" eyebrow="About" className="pt-10 pb-[30px]" eyebrowClassName="mb-[30px]">
      <div className="ik-about grid grid-cols-[1.5fr_1fr] items-start gap-11">
        <Reveal
          as="p"
          className="font-display text-ink text-[clamp(22px,3vw,30px)] leading-[1.4] font-normal tracking-[-.01em]"
        >
          I build <span className="text-primary">robust, high-performance products end-to-end</span> — from
          top-traffic commerce frontends to Go services and AI-native developer tooling — with a strong bias
          toward speed, quality, and clean DX.
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
