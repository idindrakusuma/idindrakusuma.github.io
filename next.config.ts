import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export — the site is served from GitHub Pages, so there is no Node runtime.
  output: 'export',
  // Pages serves directories, so every route needs its own index.html.
  trailingSlash: true,
  eslint: {
    // Linting is oxlint's job, wired into the `build` script itself. Next would
    // otherwise look for an ESLint install on every build and warn when it finds
    // none; saying so here makes the absence deliberate rather than incidental.
    ignoreDuringBuilds: true,
  },
  images: {
    // next/image's optimizer needs a server; the export ships the originals as-is.
    unoptimized: true,
  },
};

export default nextConfig;
