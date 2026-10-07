// The monthly bill becomes a gift: a card charged ±Rp4jt for two seats, then
// five seats for nothing.
const A1 = '#c0203f';
const LINE = 'rgba(255,255,255,0.75)';

const card = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="244" viewBox="0 -12 260 244">
  <rect x="52" y="40" width="190" height="124" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.35)" stroke-width="4" transform="rotate(-8 147 102)"/>
  <rect x="30" y="64" width="190" height="124" rx="16" fill="rgba(255,255,255,0.1)" stroke="${LINE}" stroke-width="5"/>
  <path d="M30 96 H220" stroke="${LINE}" stroke-width="12"/>
  <rect x="52" y="122" width="36" height="26" rx="5" fill="none" stroke="${LINE}" stroke-width="4"/>
  <path d="M110 160 H196" stroke="rgba(255,255,255,0.5)" stroke-width="5" stroke-linecap="round"/>
</svg>`;

const sparkle = (x, y, s) =>
  `<path d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z" fill="#ffffff"/>`;

const gift = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="244" viewBox="0 -12 260 244">
  <rect x="60" y="100" width="140" height="100" rx="14" fill="#ffffff"/>
  <rect x="48" y="72" width="164" height="38" rx="12" fill="#ffffff" stroke="#f3d6dd" stroke-width="3"/>
  <rect x="119" y="72" width="22" height="128" fill="${A1}"/>
  <path d="M130 72 C112 40 82 44 90 62 C96 74 118 74 130 72 Z" fill="none" stroke="${A1}" stroke-width="9" stroke-linejoin="round"/>
  <path d="M130 72 C148 40 178 44 170 62 C164 74 142 74 130 72 Z" fill="none" stroke="${A1}" stroke-width="9" stroke-linejoin="round"/>
  ${sparkle(222, 40, 16)}
  ${sparkle(36, 150, 10)}
</svg>`;

const arrow = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="48" viewBox="0 0 240 48">
  <path d="M8 24 H212" stroke="rgba(255,255,255,0.75)" stroke-width="5" stroke-dasharray="1 13" stroke-linecap="round"/>
  <path d="M202 8 L226 24 L202 40" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export default {
  panels: [
    { svg: card, label: '±Rp4jt / bulan', sub: '2 akun' },
    { svg: gift, label: 'Rp0', sub: '5 akun' },
  ],
  connector: arrow,
};
