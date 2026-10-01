import type { MetadataRoute } from 'next';

import { siteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/configurator`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];
}
