// A WebPageTest-style filmstrip: the same page sampled every 1.5s. Before, it
// stays blank until 9s; after, it is there by 3s.
const A1 = '#c0203f';
const INK = '#1a0d12';
const TIMES = [0, 1.5, 3, 4.5, 6, 7.5, 9];

const h = (type, style, children) => ({ type, props: { style: { display: 'flex', ...style }, children } });
const mono = { fontFamily: 'JetBrains Mono' };

const frame = (state) =>
  h('div', { flexDirection: 'column', boxSizing: 'border-box', width: 124, height: 92, borderRadius: 10, background: '#ffffff', border: `2px solid ${state === 'done' ? A1 : 'rgba(26,13,18,0.12)'}`, padding: 10 }, [
    h('div', { width: '100%', height: 8, borderRadius: 4, background: state === 'blank' ? 'rgba(26,13,18,0.08)' : A1, marginBottom: 8 }, []),
    ...(state === 'partial'
      ? [h('div', { width: '100%', height: 30, borderRadius: 5, background: 'rgba(26,13,18,0.08)' }, [])]
      : state === 'blank'
      ? [h('div', { flex: 1, alignItems: 'center', justifyContent: 'center' }, [h('div', { width: 22, height: 22, borderRadius: 11, border: '4px solid rgba(26,13,18,0.12)', borderTopColor: 'rgba(26,13,18,0.4)' }, [])])]
      : [
          h('div', { width: '100%', height: 30, borderRadius: 5, background: '#f0c9d2', marginBottom: 7 }, []),
          h('div', { width: '70%', height: 8, borderRadius: 4, background: 'rgba(26,13,18,0.25)' }, []),
        ]),
  ]);

const strip = (label, sub, doneAt) =>
  h('div', { alignItems: 'center', marginBottom: 26 }, [
    h('div', { flexDirection: 'column', width: 110, flexShrink: 0, ...mono }, [
      h('div', { fontSize: 20, color: INK }, label),
      h('div', { fontSize: 16, color: doneAt < 9 ? A1 : 'rgba(26,13,18,0.45)', marginTop: 4 }, sub),
    ]),
    h('div', { gap: 14 }, TIMES.map((t) => frame(t >= doneAt ? 'done' : t >= doneAt - 1.5 && doneAt < 9 ? 'partial' : 'blank'))),
  ]);

export default {
  card: ({ title, category }) =>
    h('div', { flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '104px 80px 100px', background: '#eceef4', color: INK, fontFamily: 'Space Grotesk' }, [
      h('div', { justifyContent: 'space-between', fontSize: 24, letterSpacing: '0.14em', textTransform: 'uppercase', ...mono }, [
        h('div', { color: 'rgba(26,13,18,0.55)' }, category),
        h('div', { color: A1 }, 'LCP · p75'),
      ]),
      h('div', { flexDirection: 'column' }, [
        strip('before', 'SPA · 9s', 9),
        strip('after', 'MPA · <3s', 3),
        h('div', { marginLeft: 110, ...mono, fontSize: 16, color: 'rgba(26,13,18,0.45)' },
          TIMES.map((t, i) => h('div', { width: 124, flexShrink: 0, marginLeft: i ? 14 : 0, justifyContent: 'center' }, `${t}s`))),
      ]),
      h('div', { fontSize: 56, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em' }, title),
    ]),
};
