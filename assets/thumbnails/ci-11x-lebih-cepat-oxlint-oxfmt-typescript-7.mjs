// One CI step, before and after: a ghosted stopwatch at 254 s, then a solid
// card with a lightning bolt at 22,7 s.
const A1 = '#c0203f';
const LINE = 'rgba(255,255,255,0.75)';

const watch = (dx, dy, stroke, w, fill) => `
  <g transform="translate(${dx} ${dy})">
    <rect x="114" y="22" width="32" height="14" rx="5" fill="none" stroke="${stroke}" stroke-width="${w}"/>
    <circle cx="130" cy="120" r="78" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>
  </g>`;

const before = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="244" viewBox="0 -12 260 244">
  ${watch(16, -8, 'rgba(255,255,255,0.3)', 4, 'rgba(255,255,255,0.04)')}
  ${watch(0, 0, LINE, 5, 'rgba(255,255,255,0.1)')}
  <path d="M130 120 V66 M130 120 L170 142" stroke="${LINE}" stroke-width="6" stroke-linecap="round"/>
  <circle cx="130" cy="120" r="7" fill="${LINE}"/>
</svg>`;

const after = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="244" viewBox="0 -12 260 244">
  <circle cx="130" cy="110" r="96" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round"/>
  <rect x="75" y="55" width="110" height="110" rx="24" fill="#ffffff"/>
  <path d="M138 72 L104 116 H128 L120 148 L156 102 H132 Z" fill="${A1}" stroke="${A1}" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="130" cy="14" r="14" fill="#1a0d12" stroke="#ffffff" stroke-width="4"/>
</svg>`;

const arrow = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="48" viewBox="0 0 240 48">
  <path d="M8 24 H212" stroke="rgba(255,255,255,0.75)" stroke-width="5" stroke-dasharray="1 13" stroke-linecap="round"/>
  <path d="M202 8 L226 24 L202 40" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export default {
  panels: [
    { svg: before, label: 'ESLint · Prettier · TS 5.9', sub: '254 s' },
    { svg: after, label: 'oxlint · oxfmt · TS 7', sub: '22,7 s · 11×' },
  ],
  connector: arrow,
};
