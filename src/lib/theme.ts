/**
 * Who owns the visitor's theme.
 *
 * The palette is selected by `data-theme` on <html>, and the decision behind it
 * was previously made twice: once as a minified string inlined into <head>, once
 * as an effect in the nav. The storage key was a bare literal in both, and the
 * guard around `localStorage` appeared three times with three different fallback
 * behaviours. This module holds the key and the rule; hooks/useTheme.ts holds the
 * DOM work.
 *
 * The rule, stated once: an explicit stored choice wins; otherwise follow the OS;
 * if neither can be read, light.
 */

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'ik-theme';

/**
 * Anything other than the two known values is treated as no choice at all — a
 * stray key from another origin, or a value left by an older version of the
 * site, should not be able to put the page into an undefined palette.
 */
export function resolveTheme(stored: string | null, systemPrefersDark: boolean): Theme {
  if (stored === 'dark' || stored === 'light') return stored;
  return systemPrefersDark ? 'dark' : 'light';
}

/**
 * The same rule as `resolveTheme`, as source text for a <script> in <head>.
 *
 * It has to run before first paint to avoid a flash of the wrong palette, which
 * means it cannot import anything — hence a string rather than a call. The
 * storage key is interpolated from the constant above so the two cannot drift,
 * and the shapes are kept deliberately parallel so a change to one is an obvious
 * prompt to change the other.
 */
export const THEME_SCRIPT =
  `(function(){try{` +
  `var t=localStorage.getItem('${THEME_STORAGE_KEY}');` +
  `if(t!=='dark'&&t!=='light'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}` +
  `document.documentElement.setAttribute('data-theme',t);` +
  `}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;
