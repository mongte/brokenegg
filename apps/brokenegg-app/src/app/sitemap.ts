import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/shared/seo';
import { routing } from '@/i18n/routing';

/** 사이트맵에 포함할 로케일 뒤 경로. */
const PATHS = ['', '/services', '/cases', '/about'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    PATHS.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
      // hreflang 대체 링크 (ko/en)
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((loc) => [loc, `${SITE_URL}/${loc}${path}`]),
        ),
      },
    })),
  );
}
