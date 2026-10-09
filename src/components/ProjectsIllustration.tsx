/**
 * The projects index's header art: a browser window with a game on it, a phone
 * pinned over its corner playing the same thing, and a spark joined to both by
 * a dotted path — "built on the side, live to try", in the line-drawn language
 * of BlogIllustration, whose structure it follows.
 *
 * Inline SVG coloured from the theme's own tokens, so it follows the light and
 * dark palettes with no second image. Purely decorative.
 */

const surface = { fill: 'var(--surface)', stroke: 'var(--border-2)' };
const fill = (color: string, opacity = 1) => ({ fill: `var(${color})`, opacity });

/** `className` sets its width; the art keeps its own aspect ratio. */
export default function ProjectsIllustration({ className = 'w-[340px]' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      <svg viewBox="0 0 380 320" width="100%" fill="none" className="overflow-visible">
        {/* Orbit behind everything, as on the homepage portrait. */}
        <g transform="rotate(-14 190 175)">
          <ellipse cx="190" cy="175" rx="178" ry="74" strokeWidth="1.2" strokeDasharray="3 7" style={{ stroke: 'var(--primary)', opacity: 0.35 }} />
          <circle cx="12" cy="175" r="4" style={fill('--primary-2')} />
          <circle cx="330" cy="222" r="3" style={fill('--primary', 0.7)} />
        </g>

        {/* Browser window: an address bar over a board of shapes to match. */}
        <g className="ik-art-float" style={{ filter: 'drop-shadow(var(--art-shadow))' }}>
          <rect x="98" y="34" width="250" height="172" rx="16" strokeWidth="1.2" style={surface} />
          <circle cx="118" cy="54" r="4" style={fill('--primary')} />
          <circle cx="132" cy="54" r="4" style={fill('--primary-2')} />
          <circle cx="146" cy="54" r="4" style={fill('--faint', 0.6)} />
          <rect x="166" y="47" width="120" height="14" rx="7" style={fill('--faint', 0.18)} />
          <rect x="176" y="52" width="60" height="4" rx="2" style={fill('--faint', 0.5)} />
          <line x1="98" x2="348" y1="70" y2="70" strokeWidth="1.2" style={{ stroke: 'var(--border-2)' }} />

          <rect x="118" y="88" width="60" height="52" rx="12" style={fill('--primary', 0.1)} />
          <circle cx="148" cy="114" r="15" style={fill('--primary')} />
          <rect x="190" y="88" width="60" height="52" rx="12" style={fill('--primary-2', 0.12)} />
          <path d="M220 99l15 26h-30z" strokeLinejoin="round" strokeWidth="4" style={{ ...fill('--primary-2'), stroke: 'var(--primary-2)' }} />
          <rect x="262" y="88" width="66" height="52" rx="12" strokeWidth="1.4" strokeDasharray="4 5" style={{ stroke: 'var(--faint)', opacity: 0.6 }} />
          <rect x="283" y="102" width="24" height="24" rx="5" style={fill('--faint', 0.35)} />

          <rect x="118" y="158" width="86" height="8" rx="4" style={fill('--faint', 0.4)} />
          <rect x="118" y="176" width="54" height="8" rx="4" style={fill('--faint', 0.4)} />
          <rect x="268" y="152" width="60" height="34" rx="10" style={fill('--primary')} />
          <path d="M292 160v18l14-9z" strokeLinejoin="round" strokeWidth="2" style={{ fill: 'var(--primary-ink)', stroke: 'var(--primary-ink)' }} />
        </g>

        {/* A phone pinned over the window's corner, running the same game. */}
        <g className="ik-art-float ik-art-float-late">
          <g transform="rotate(-7 80 232)">
            <rect x="34" y="150" width="92" height="150" rx="18" strokeWidth="1.2" style={{ ...surface, filter: 'drop-shadow(var(--art-shadow))' }} />
            <rect x="66" y="160" width="28" height="6" rx="3" style={fill('--faint', 0.35)} />
            <rect x="46" y="176" width="68" height="16" rx="8" style={fill('--primary', 0.12)} />
            <text x="80" y="187.5" textAnchor="middle" fontSize="9" fontFamily="var(--font-jetbrains), monospace" style={fill('--primary')}>
              play
            </text>
            <circle cx="64" cy="220" r="12" style={fill('--primary')} />
            <path d="M96 208l12 21h-24z" strokeLinejoin="round" strokeWidth="3" style={{ ...fill('--primary-2'), stroke: 'var(--primary-2)' }} />
            <rect x="52" y="244" width="24" height="24" rx="6" style={fill('--faint', 0.35)} />
            <rect x="84" y="244" width="24" height="24" rx="6" strokeWidth="1.4" strokeDasharray="3 4" style={{ stroke: 'var(--faint)', opacity: 0.6 }} />
            <rect x="62" y="282" width="36" height="5" rx="2.5" style={fill('--faint', 0.45)} />
          </g>
        </g>

        {/* Spark, joined to the phone by a dotted path. */}
        <path
          d="M130 278C230 300 318 262 336 214"
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
