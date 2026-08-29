import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export — the site is served from GitHub Pages, so there is no Node runtime.
  output: 'export',
  // Pages serves directories, so every route needs its own index.html.
  trailingSlash: true,
  images: {
    // next/image's optimizer needs a server; the export ships the originals as-is.
    unoptimized: true,
  },
};

export default nextConfig;
