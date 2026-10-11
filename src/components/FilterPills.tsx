/**
 * A row of pills, one of them pressed — the blog's category filter and the
 * /projects section filter share it.
 *
 * The row scrolls sideways rather than wrapping once the screen is narrow; two
 * ragged rows of pills cost more height than the first card (`.ik-cat-row`).
 */
export default function FilterPills({
  options,
  active,
  onSelect,
  className = '',
}: {
  options: { value: string; label: string }[];
  active: string;
  onSelect: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={`ik-cat-row flex flex-wrap gap-[9px] ${className}`}>
      {options.map(({ value, label }) => {
        const on = value === active;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            aria-pressed={on}
            className={`font-mono flex-none cursor-pointer rounded-full border px-4 py-[9px] text-[12.5px] font-medium whitespace-nowrap ${
              on
                ? 'border-primary bg-primary text-primary-ink'
                : 'border-line bg-surface text-muted hover:border-primary hover:text-primary transition-[color,border-color] duration-250'
            }`}
            style={on ? { boxShadow: '0 8px 20px -8px var(--glow)' } : undefined}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
