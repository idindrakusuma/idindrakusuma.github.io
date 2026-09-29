import { getStore } from '@netlify/blobs';
import type { ClapStore } from './core';

/**
 * One site-wide store, whatever the deploy. A deploy preview reads and writes
 * the real counts, so what it shows — the popular list included — is what the
 * live site shows; a clap given on a preview is a real clap.
 */
export function clapStore(): ClapStore {
  return getStore({ name: 'claps', consistency: 'strong' });
}
