/**
 * Vectorises the iK logo.
 *
 * assets/logo-source.png is the raster master (680x667, transparent background) and
 * is never shipped. There is no tracing tool in the toolchain, so this script does the
 * tracing itself: classify pixels into red / ink, split into connected components,
 * walk each component's boundary edges, simplify, then smooth the curved runs.
 *
 * Two artefacts come out of the same trace so they can never drift:
 *   public/logo.svg          standalone, self-contained (carries its own theme CSS)
 *   src/components/LogoMark.tsx  inline React version, themed by globals.css tokens
 *
 * The ink shapes are near-white and would vanish on a light background, so they are
 * driven by --logo-ink / --logo-ink-shade rather than being hard-coded. The red halves
 * read fine on either background and keep their sampled gradients.
 *
 * Re-run with `node scripts/generate-logo.mjs` after replacing the source.
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Tuned against the source by sweeping both knobs and comparing the re-render to the
// master: this pair keeps the long straight edges genuinely straight (a tighter EPS
// makes the path chase the pixel staircase and visibly ripple) while the curves stay
// smooth, at ~1% silhouette error.
const EPS = 1.5; // Douglas-Peucker tolerance, px
const PUSH = 0.8; // how far the quadratic control point is pushed past its vertex
const SMOOTH_TURN = (50 * Math.PI) / 180; // gentler turns than this get rounded

const { data, info } = await sharp(join(root, 'assets', 'logo-source.png'))
  .raw()
  .ensureAlpha()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const at = (x, y) => {
  const i = (y * W + x) * 4;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
};

// 0 = transparent, 1 = red, 2 = ink.
const cls = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const [r, g, b, a] = at(x, y);
    cls[y * W + x] = a >= 128 ? (r - g > 45 && r - b > 30 ? 1 : 2) : 0;
  }
}

function components(target) {
  const seen = new Uint8Array(W * H);
  const comps = [];
  for (let s = 0; s < W * H; s++) {
    if (cls[s] !== target || seen[s]) continue;
    const stack = [s];
    seen[s] = 1;
    const pix = [];
    while (stack.length) {
      const p = stack.pop();
      const px = p % W;
      const py = (p / W) | 0;
      pix.push(p);
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = px + dx;
          const ny = py + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const q = ny * W + nx;
          if (cls[q] === target && !seen[q]) {
            seen[q] = 1;
            stack.push(q);
          }
        }
      }
    }
    comps.push({ pix, n: pix.length });
  }
  // Anything smaller than this is antialiasing debris, not a shape.
  return comps.filter((c) => c.n > 200).sort((a, b) => b.n - a.n);
}

/**
 * Every pixel edge bordering an empty cell becomes a directed edge, oriented so the
 * filled side is on the left; chaining them start-to-end yields exact closed loops.
 * More robust than neighbour-tracing, which trips over diagonal pinch points.
 */
function trace(mask) {
  const on = (x, y) => x >= 0 && y >= 0 && x < W && y < H && mask[y * W + x];
  const key = (x, y) => y * (W + 1) + x;
  const out = new Map();
  const push = (x0, y0, x1, y1) => {
    const k = key(x0, y0);
    if (!out.has(k)) out.set(k, []);
    out.get(k).push([x1, y1]);
  };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!mask[y * W + x]) continue;
      if (!on(x, y - 1)) push(x, y, x + 1, y);
      if (!on(x + 1, y)) push(x + 1, y, x + 1, y + 1);
      if (!on(x, y + 1)) push(x + 1, y + 1, x, y + 1);
      if (!on(x - 1, y)) push(x, y + 1, x, y);
    }
  }
  const loops = [];
  for (const [k0, list0] of out) {
    while (list0.length) {
      const loop = [[k0 % (W + 1), (k0 / (W + 1)) | 0]];
      let next = list0.shift();
      while (next) {
        loop.push(next);
        const nk = key(next[0], next[1]);
        if (nk === k0) break;
        const list = out.get(nk);
        if (!list || !list.length) break;
        next = list.shift();
      }
      if (loop.length > 8) loops.push(loop);
    }
  }
  return loops.sort((a, b) => b.length - a.length);
}

function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = 1;
  keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    if (b - a < 2) continue;
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    let best = -1;
    let bd = 0;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * (pts[i][0] - ax) - dx * (pts[i][1] - ay)) / len;
      if (d > bd) {
        bd = d;
        best = i;
      }
    }
    if (bd > eps) {
      keep[best] = 1;
      stack.push([a, best], [best, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

/**
 * A closed loop starts and ends on the same vertex, so a single Douglas-Peucker pass
 * would measure every point against a zero-length baseline and discard the lot. Anchor
 * the far side of the loop first and simplify the two halves separately.
 */
function rdpClosed(loop, eps) {
  const last = loop[loop.length - 1];
  const pts = loop.length > 1 && loop[0][0] === last[0] && loop[0][1] === last[1] ? loop.slice(0, -1) : loop;
  if (pts.length < 4) return pts;
  let far = 0;
  let fd = -1;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]);
    if (d > fd) {
      fd = d;
      far = i;
    }
  }
  return rdp(pts.slice(0, far + 1), eps).concat(rdp(pts.slice(far), eps).slice(1, -1));
}

/** Least-squares fit of luminance over the shape, giving the axis its shading runs along. */
function fitGradient(pix) {
  // Boundary pixels are antialiased against the neighbouring shape, so sample the inside.
  const inner = pix.filter((p) => {
    const x = p % W;
    const y = (p / W) | 0;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) return false;
        if (cls[ny * W + nx] !== cls[p]) return false;
      }
    }
    return true;
  });
  const src = inner.length > 500 ? inner : pix;
  let n = 0, sx = 0, sy = 0, sl = 0, sxx = 0, syy = 0, sxy = 0, sxl = 0, syl = 0;
  for (const p of src) {
    const x = p % W;
    const y = (p / W) | 0;
    const [r, g, b] = at(x, y);
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    n++; sx += x; sy += y; sl += l;
    sxx += x * x; syy += y * y; sxy += x * y; sxl += x * l; syl += y * l;
  }
  const mx = sx / n, my = sy / n, ml = sl / n;
  const cxx = sxx / n - mx * mx, cyy = syy / n - my * my, cxy = sxy / n - mx * my;
  const cxl = sxl / n - mx * ml, cyl = syl / n - my * ml;
  const det = cxx * cyy - cxy * cxy || 1e-9;
  let a = (cxl * cyy - cyl * cxy) / det;
  let b = (cyl * cxx - cxl * cxy) / det;
  const mag = Math.hypot(a, b) || 1e-9;
  a /= mag;
  b /= mag;
  const proj = src
    .map((p) => ({ t: (p % W) * a + ((p / W) | 0) * b, x: p % W, y: (p / W) | 0 }))
    .sort((u, v) => u.t - v.t);
  const lo = proj[Math.floor(proj.length * 0.02)];
  const hi = proj[Math.floor(proj.length * 0.98)];
  const span = hi.t - lo.t;
  const sample = (t0, t1) => {
    let r = 0, g = 0, bb = 0, c = 0;
    for (const q of proj) {
      if (q.t < t0 || q.t > t1) continue;
      const [cr, cg, cb] = at(q.x, q.y);
      r += cr; g += cg; bb += cb; c++;
    }
    return c ? [r / c, g / c, bb / c] : [0, 0, 0];
  };
  return {
    from: { x: lo.x, y: lo.y, c: sample(lo.t, lo.t + span * 0.1) },
    to: { x: hi.x, y: hi.y, c: sample(hi.t - span * 0.1, hi.t) },
  };
}

const shapes = [];
for (const target of [1, 2]) {
  for (const comp of components(target)) {
    const mask = new Uint8Array(W * H);
    for (const p of comp.pix) mask[p] = 1;
    const loops = trace(mask)
      .map((l) => rdpClosed(l, EPS))
      .filter((l) => l.length > 3);
    shapes.push({ kind: target === 1 ? 'red' : 'ink', loops, grad: fitGradient(comp.pix) });
  }
}

let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
for (const s of shapes) {
  for (const l of s.loops) {
    for (const [x, y] of l) {
      if (x < minx) minx = x;
      if (x > maxx) maxx = x;
      if (y < miny) miny = y;
      if (y > maxy) maxy = y;
    }
  }
}
const VB_W = Math.ceil(maxx - minx);
const VB_H = Math.ceil(maxy - miny);

const n = (v) => (Math.round(v * 10) / 10).toString();
const pt = ([x, y]) => `${n(x - minx)} ${n(y - miny)}`;

/**
 * Douglas-Peucker leaves the curved runs as short chords. Round every vertex whose turn
 * is gentle into a quadratic, pushing the control point past the vertex so the curve
 * passes through it instead of sagging inside the polyline. Hard corners stay mitred.
 */
function toPath(loop) {
  const N = loop.length;
  const P = (i) => loop[((i % N) + N) % N];
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const gentle = loop.map((_, i) => {
    const [px, py] = P(i - 1);
    const [cx, cy] = P(i);
    const [nx, ny] = P(i + 1);
    let turn = Math.abs(Math.atan2(ny - cy, nx - cx) - Math.atan2(cy - py, cx - px));
    if (turn > Math.PI) turn = 2 * Math.PI - turn;
    return turn < SMOOTH_TURN;
  });
  const ctrl = (i) => {
    const c = P(i);
    const m = mid(mid(P(i - 1), c), mid(c, P(i + 1)));
    return [c[0] + PUSH * (c[0] - m[0]), c[1] + PUSH * (c[1] - m[1])];
  };
  let d = 'M' + pt(gentle[0] ? mid(P(0), P(1)) : P(0));
  for (let k = 1; k <= N; k++) {
    const i = k % N;
    d += gentle[i] ? `Q${pt(ctrl(i))} ${pt(mid(P(i), P(i + 1)))}` : `L${pt(P(i))}`;
  }
  return d + 'Z';
}

const hex = (c) => '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

// The ink shapes only ever use two tones: the flat white and one slightly darker fold.
// Collapse them onto two tokens so the theme swap is a two-line change.
const inks = shapes.filter((s) => s.kind === 'ink');
const inkTones = inks.flatMap((s) => [s.grad.from.c, s.grad.to.c]);
const brightest = Math.max(...inkTones.map(lum));
const token = (c) => (lum(c) >= brightest - 1 ? 'var(--logo-ink)' : 'var(--logo-ink-shade)');

// Light mode has to flip the ink dark. Rebuild each tone on the site's ink navy and add
// back the same absolute luminance step the original carried, so the fold shading
// inverts rather than flattening out.
const NAVY = [10, 18, 36]; // --text in globals.css
const darkTone = inkTones.reduce((a, b) => (lum(a) >= lum(b) ? a : b));
const shadeTone = inkTones.reduce((a, b) => (lum(a) <= lum(b) ? a : b));
const THEME = {
  light: { '--logo-ink': hex(NAVY.map((v) => v + (255 - lum(darkTone)))), '--logo-ink-shade': hex(NAVY.map((v) => v + (255 - lum(shadeTone)))) },
  dark: { '--logo-ink': hex(darkTone), '--logo-ink-shade': hex(shadeTone) },
};

const grads = [];
const paths = [];
shapes.forEach((s, i) => {
  const id = `ik-logo-${s.kind}-${i}`;
  const g = s.grad;
  const stop = (c) => (s.kind === 'red' ? hex(c) : token(c));
  grads.push(
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n(g.from.x - minx)}" y1="${n(g.from.y - miny)}" x2="${n(g.to.x - minx)}" y2="${n(g.to.y - miny)}">` +
      `<stop offset="0" stop-color="${stop(g.from.c)}"/><stop offset="1" stop-color="${stop(g.to.c)}"/></linearGradient>`
  );
  paths.push(`<path fill="url(#${id})" d="${s.loops.map(toPath).join('')}"/>`);
});

const decl = (vars) => Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}" class="ik-logo-mark" role="img" aria-label="Indra Kusuma">
<style>
/* Standalone copy, so it carries its own theming: prefers-color-scheme for when it is
   loaded as a favicon or an <img>, and [data-theme] for when the site's own toggle is
   in charge. The inline React version reads the same tokens from globals.css instead. */
.ik-logo-mark{${decl(THEME.light)}}
@media (prefers-color-scheme:dark){.ik-logo-mark{${decl(THEME.dark)}}}
[data-theme="light"] .ik-logo-mark{${decl(THEME.light)}}
[data-theme="dark"] .ik-logo-mark{${decl(THEME.dark)}}
</style>
<defs>${grads.join('')}</defs>
${paths.join('\n')}
</svg>
`;
writeFileSync(join(root, 'public', 'logo.svg'), svg);

const tsx = `/*
 * Generated by scripts/generate-logo.mjs from assets/logo-source.png — do not edit.
 *
 * Inlined rather than served as an <img> so the ink tokens in globals.css apply: an
 * <img> is its own document and cannot see [data-theme] on <html>, which would leave
 * the mark stuck on the OS colour scheme whenever it disagrees with the site toggle.
 */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 ${VB_W} ${VB_H}"
      role="img"
      aria-label="Indra Kusuma"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
${grads.map((g) => '        ' + g.replace(/<stop/g, '\n          <stop').replace('</linearGradient>', '\n        </linearGradient>')).join('\n')}
      </defs>
${paths.map((p) => '      ' + p.replace('/>', ' />')).join('\n')}
    </svg>
  );
}
`;
writeFileSync(join(root, 'src', 'components', 'LogoMark.tsx'), tsx);

console.log(`viewBox 0 0 ${VB_W} ${VB_H}  ${shapes.length} shapes, ${shapes.reduce((a, s) => a + s.loops.reduce((b, l) => b + l.length, 0), 0)} points`);
console.log(`public/logo.svg              ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
console.log(`src/components/LogoMark.tsx  ${(Buffer.byteLength(tsx) / 1024).toFixed(1)} KB`);
console.log(`ink tokens  light ${decl(THEME.light)}   dark ${decl(THEME.dark)}`);
