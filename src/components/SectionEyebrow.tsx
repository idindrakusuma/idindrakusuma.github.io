import Reveal from './Reveal';

/** Numbered section label with the brand-red rule trailing off to the right. */
export default function SectionEyebrow({ label, className = 'mb-3.5' }: { label: string; className?: string }) {
  return (
    <Reveal className={`flex items-center gap-3.5 ${className}`}>
      <span className="font-mono text-primary text-[13px] font-medium">{label}</span>
      <span className="ik-divider" />
    </Reveal>
  );
}
