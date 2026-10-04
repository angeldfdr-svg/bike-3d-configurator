import type { NextConfig } from 'next';

/**
 * Security headers applied to every response.
 *
 * These are the industry-standard headers that harden the app against common
 * web attack vectors without requiring a backend or a WAF:
 *
 * - Content-Security-Policy: restricts which sources can load scripts, styles,
 *   images and media. Three.js and React Three Fiber need blob: and data: for
 *   WebGL textures; @vercel/og needs images from the same origin.
 * - Permissions-Policy: opts out of browser APIs the app never uses.
 * - X-Frame-Options: prevents the page from being embedded in iframes (clickjacking).
 * - X-Content-Type-Options: prevents MIME-type sniffing.
 * - Referrer-Policy: limits referrer data sent to third parties.
 * - Strict-Transport-Security: forces HTTPS for one year (preload-ready).
 *
 * CSP is kept intentionally permissive for WebGL:
 *   `worker-src blob:` — Three.js spawns workers for texture decoding
 *   `img-src data: blob:` — canvas readback and generated textures
 */
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval in dev; tighten in prod with nonces
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "media-src 'none'",
      "worker-src blob:",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
    ].join('; '),
  },
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()',
      'payment=()',
      'usb=()',
    ].join(', '),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Keeps the production bundle free of accidental source maps.
  productionBrowserSourceMaps: false,

  async headers() {
    return [
      {
        // Apply security headers to every route.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
