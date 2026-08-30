import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export — the site is served from GitHub Pages, so there is no Node runtime.
  output: 'export',
  // Pages serves directories, so every route needs its own index.html.
  trailingSlash: true,
  experimental: {
    // The stylesheet is one render-blocking request on the critical path, worth
    // ~400ms on a throttled connection, for 9.5 KiB. Inlining it into <head>
    // removes the round-trip entirely. The cost is that it no longer caches
    // across navigations — the right trade for a site people mostly arrive at,
    // read, and leave.
    inlineCss: true,
  },
  images: {
    // next/image's optimizer needs a server; the export ships the originals as-is.
    unoptimized: true,
  },
  allowedDevOrigins: ['192.168.100.*']
};

export default nextConfig;
