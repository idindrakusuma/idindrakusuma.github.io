'use client';

import { useEffect, useId, useState, useSyncExternalStore } from 'react';

/**
 * A diagram written as a ```mermaid fence in a post.
 *
 * Mermaid lays text out by measuring it in a real DOM, so it cannot run at
 * build time without a headless browser. It renders here instead, and is
 * imported only when a diagram is on the page — every other post ships none of
 * it. Until then, and without JavaScript, the source shows as a plain code
 * block, which is still readable.
 *
 * The palette follows the site's theme and re-renders on the toggle, since
 * Mermaid bakes colours into the SVG rather than reading CSS variables.
 */

const PALETTES = {
  light: {
    background: '#ffffff',
    primaryColor: '#f3f6fc',
    primaryBorderColor: '#d6def0',
    primaryTextColor: '#0a1224',
    secondaryColor: '#e8f5ee',
    tertiaryColor: '#fbfbef',
    clusterBkg: '#fbf6f7',
    clusterBorder: '#e6c3ca',
    lineColor: '#55648a',
    textColor: '#0a1224',
    edgeLabelBackground: '#ffffff',
  },
  dark: {
    background: '#0b1220',
    primaryColor: '#141f33',
    primaryBorderColor: '#26375a',
    primaryTextColor: '#eaf0fb',
    secondaryColor: '#12281f',
    tertiaryColor: '#18160c',
    clusterBkg: '#0f1826',
    clusterBorder: '#3a2a3a',
    lineColor: '#93a3c4',
    textColor: '#eaf0fb',
    edgeLabelBackground: '#0b1220',
  },
} as const;

const currentTheme = () =>
  document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

export default function Mermaid({ chart }: { chart: string }) {
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [svg, setSvg] = useState<string | null>(null);
  // Null on the server, where there is no theme yet — the source shows until hydration.
  const theme = useSyncExternalStore(subscribe, currentTheme, () => null);

  useEffect(() => {
    if (!theme) return;
    let cancelled = false;
    (async () => {
      const { default: mermaid } = await import('mermaid');
      // Mermaid sizes each box by measuring its label, so the font has to be
      // loaded and named exactly as the page uses it — next/font's family name,
      // not a CSS variable — or the text overflows the box it was measured for.
      await document.fonts.ready;
      const fontFamily = getComputedStyle(document.body).fontFamily;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        themeVariables: { ...PALETTES[theme], fontFamily, fontSize: '14px' },
        flowchart: { curve: 'basis', htmlLabels: true },
      });
      try {
        const { svg } = await mermaid.render(`${id}-${theme}`, chart);
        if (!cancelled) setSvg(svg);
      } catch (error) {
        // A diagram that fails to parse keeps showing its source.
        console.error(error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id, theme]);

  return (
    <figure className="ik-mermaid">
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <pre>
          <code>{chart}</code>
        </pre>
      )}
    </figure>
  );
}
