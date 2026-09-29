/**
 * The blog index's header art: a code window, a note pinned over it, and a
 * spark joined to both by a dotted path — "notes on building for the web", in
 * the same line-drawn language as the post thumbnails.
 *
 * Inline SVG coloured from the theme's own tokens, so it follows the light and
 * dark palettes with no second image. Purely decorative.
 */

const surface = { fill: 'var(--surface)', stroke: 'var(--border-2)' };
const fill = (color: string, opacity = 1) => ({ fill: `var(${color})`, opacity });

/** Code lines in the window: [x, y, width, colour, opacity]. */
const CODE: [number, number, number, string, number][] = [
  [118, 92, 34, '--primary', 1],
  [158, 92, 74, '--primary-2', 0.55],
  [134, 110, 50, '--faint', 0.5],
  [190, 110, 62, '--primary', 0.35],
  [134, 128, 96, '--faint', 0.4],
  [150, 146, 42, '--primary-2', 0.7],
  [198, 146, 54, '--faint', 0.4],
  [118, 164, 30, '--primary', 1],
];

export default function BlogIllustration() {
  return (
    <div aria-hidden="true" className="pointer-events-none w-[340px] select-none">
      <svg viewBox="0 0 380 320" width="100%" fill="none" className="overflow-visible">
        {/* Orbit behind everything, as on the homepage portrait. */}
        <g transform="rotate(-14 190 175)">
          <ellipse cx="190" cy="175" rx="178" ry="74" strokeWidth="1.2" strokeDasharray="3 7" style={{ stroke: 'var(--primary)', opacity: 0.35 }} />
          <circle cx="12" cy="175" r="4" style={fill('--primary-2')} />
          <circle cx="330" cy="222" r="3" style={fill('--primary', 0.7)} />
        </g>

        {/* Code window. */}
        <g className="ik-art-float" style={{ filter: 'drop-shadow(var(--art-shadow))' }}>
          <rect x="98" y="34" width="250" height="172" rx="16" strokeWidth="1.2" style={surface} />
          <circle cx="118" cy="54" r="4" style={fill('--primary')} />
          <circle cx="132" cy="54" r="4" style={fill('--primary-2')} />
          <circle cx="146" cy="54" r="4" style={fill('--faint', 0.6)} />
          <line x1="98" x2="348" y1="70" y2="70" strokeWidth="1.2" style={{ stroke: 'var(--border-2)' }} />
          {CODE.map(([x, y, width, color, opacity]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={width} height="8" rx="4" style={fill(color, opacity)} />
          ))}
          <rect x="286" y="150" width="46" height="34" rx="10" style={fill('--primary')} />
          <path
            d="M302 160l-6 7 6 7M316 160l6 7-6 7M311 158l-4 18"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ stroke: 'var(--primary-ink)' }}
          />
        </g>

        {/* A note pinned over the window's corner. */}
        <g className="ik-art-float ik-art-float-late">
          <g transform="rotate(-7 95 232)">
            <rect x="22" y="176" width="150" height="112" rx="14" strokeWidth="1.2" style={{ ...surface, filter: 'drop-shadow(var(--art-shadow))' }} />
            <rect x="38" y="192" width="48" height="16" rx="8" style={fill('--primary', 0.12)} />
            <text x="62" y="203.5" textAnchor="middle" fontSize="9" fontFamily="var(--font-jetbrains), monospace" style={fill('--primary')}>
              notes
            </text>
            <rect x="38" y="222" width="112" height="7" rx="3.5" style={fill('--faint', 0.45)} />
            <rect x="38" y="238" width="96" height="7" rx="3.5" style={fill('--faint', 0.45)} />
            <rect x="38" y="254" width="68" height="7" rx="3.5" style={fill('--faint', 0.45)} />
            <circle cx="148" cy="264" r="9" style={fill('--primary-2', 0.9)} />
            <path d="M144 264l3 3 5-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--primary-ink)' }} />
          </g>
        </g>

        {/* Spark, joined to the note by a dotted path. */}
        <path
          d="M176 268C250 292 318 262 336 214"
          strokeWidth="1.6"
          strokeDasharray="2 6"
          strokeLinecap="round"
          style={{ stroke: 'var(--primary)', opacity: 0.6 }}
        />
        <g className="ik-art-float ik-art-float-late">
          <rect x="318" y="0" width="48" height="48" rx="14" strokeWidth="1.2" style={{ ...surface, filter: 'drop-shadow(var(--art-shadow))' }} />
          <path d="M342 10c1.6 7.2 6.8 12.4 14 14-7.2 1.6-12.4 6.8-14 14-1.6-7.2-6.8-12.4-14-14 7.2-1.6 12.4-6.8 14-14z" style={fill('--primary')} />
        </g>
      </svg>
    </div>
  );
}
