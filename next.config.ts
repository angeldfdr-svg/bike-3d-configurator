import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Keeps the production bundle free of accidental source maps and keeps the
  // compiler strict about server/client boundaries.
  productionBrowserSourceMaps: false,
};

export default nextConfig;
