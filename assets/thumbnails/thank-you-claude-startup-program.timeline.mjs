// The afternoon in three steps: a post on Threads, the form, the approval.
const A1 = '#c0203f';
const LINE = 'rgba(255,255,255,0.75)';
const box = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">${inner}</svg>`;

const thread = box(`
  <path d="M40 46 H180 a16 16 0 0 1 16 16 V128 a16 16 0 0 1 -16 16 H96 L64 172 V144 H40 a16 16 0 0 1 -16 -16 V62 a16 16 0 0 1 16 -16 Z"
    fill="rgba(255,255,255,0.1)" stroke="${LINE}" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="56" cy="78" r="11" fill="none" stroke="${LINE}" stroke-width="4"/>
  <path d="M78 74 H130 M50 104 H170 M50 122 H140" stroke="rgba(255,255,255,0.55)" stroke-width="6" stroke-linecap="round"/>`);

const form = box(`
  <rect x="50" y="26" width="120" height="164" rx="14" fill="rgba(255,255,255,0.1)" stroke="${LINE}" stroke-width="5"/>
  ${[64, 104, 144]
    .map(
      (y) => `<rect x="70" y="${y}" width="20" height="20" rx="5" fill="none" stroke="${LINE}" stroke-width="4"/>
  <path d="M74 ${y + 10} l5 5 l9 -11" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M102 ${y + 10} H150" stroke="rgba(255,255,255,0.55)" stroke-width="6" stroke-linecap="round"/>`,
    )
    .join('')}`);

const approved = box(`
  <rect x="30" y="56" width="160" height="114" rx="18" fill="#ffffff"/>
  <path d="M42 70 L110 120 L178 70" fill="none" stroke="#f0c9d2" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="176" cy="60" r="30" fill="${A1}" stroke="#ffffff" stroke-width="5"/>
  <path d="M162 60 l10 10 l18 -20" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`);

const arrow = `<svg xmlns="http://www.w3.org/2000/svg" width="110" height="48" viewBox="0 0 110 48">
  <path d="M6 24 H84" stroke="rgba(255,255,255,0.75)" stroke-width="5" stroke-dasharray="1 13" stroke-linecap="round"/>
  <path d="M78 10 L98 24 L78 38" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export default {
  panels: [
    { svg: thread, label: 'Threads', sub: 'siang ini' },
    { svg: form, label: 'Submit form', sub: 'Invitato.id' },
    { svg: approved, label: 'Approved!', sub: "you're in" },
  ],
  connector: arrow,
};
