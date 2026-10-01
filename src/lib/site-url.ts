/**
 * Canonical site URL used for metadata, robots and sitemap.
 * Falls back to the local development origin when the env var is absent.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
