// Max plan for two people, then the Startup Program for five — the five dots
// orbiting Claude are the five seats.
const A1 = '#c0203f';
const LINE = 'rgba(255,255,255,0.75)';

const user = (cx) => `
  <circle cx="${cx}" cy="92" r="17" fill="none" stroke="${LINE}" stroke-width="6"/>
  <path d="M${cx - 30} 150 a30 28 0 0 1 60 0" fill="none" stroke="${LINE}" stroke-width="6" stroke-linecap="round"/>`;

const maxPlan = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="244" viewBox="0 -12 260 244">
  <rect x="58" y="22" width="190" height="150" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" stroke-width="4"/>
  <rect x="44" y="36" width="190" height="150" rx="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.45)" stroke-width="4"/>
  <rect x="30" y="50" width="190" height="150" rx="18" fill="rgba(255,255,255,0.1)" stroke="${LINE}" stroke-width="5"/>
  <g transform="translate(-5 16)">${user(95)}${user(160)}</g>
</svg>`;

const rays = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  const p = (r) => `${130 + r * Math.cos(a)} ${110 + r * Math.sin(a)}`;
  return `<path d="M${p(4)} L${p(34)}" stroke="${A1}" stroke-width="10" stroke-linecap="round"/>`;
}).join('');

const seats = Array.from({ length: 5 }, (_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return `<circle cx="${130 + 96 * Math.cos(a)}" cy="${110 + 96 * Math.sin(a)}" r="14" fill="#1a0d12" stroke="#ffffff" stroke-width="4"/>`;
}).join('');

const startup = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="244" viewBox="0 -12 260 244">
  <circle cx="130" cy="110" r="96" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round"/>
  <rect x="75" y="55" width="110" height="110" rx="24" fill="#ffffff"/>
  ${rays}
  ${seats}
</svg>`;

const arrow = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="48" viewBox="0 0 240 48">
  <path d="M8 24 H212" stroke="rgba(255,255,255,0.75)" stroke-width="5" stroke-dasharray="1 13" stroke-linecap="round"/>
  <path d="M202 8 L226 24 L202 40" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export default {
  panels: [
    { svg: maxPlan, label: 'Max Plan', sub: '2 akun · ±Rp4jt' },
    { svg: startup, label: 'Startup Program', sub: '5 akun · Rp0' },
  ],
  connector: arrow,
};
