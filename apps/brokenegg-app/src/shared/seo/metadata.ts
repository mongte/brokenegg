import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

/** 운영 도메인(canonical·OG 절대 URL 기준). 배포 도메인이 다르면 NEXT_PUBLIC_SITE_URL로 덮어쓴다. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://brokenegg.co.kr').replace(
  /\/$/,
  '',
);
export const SITE_NAME = 'Broken Egg';
export const OG_IMAGE = '/og.png';
/** 이전 홈페이지에서 발급받은 네이버 서치어드바이저 사이트 인증코드(재사용). */
export const NAVER_SITE_VERIFICATION = '43f621b651200f20111fe3fa0bceac86f7b7652d';

/** meta.json의 페이지별 키. ''(빈 문자열)이면 홈(meta.title/description). */
export type MetaKey = '' | 'cases' | 'services' | 'about';

const OG_LOCALE: Record<string, string> = { ko: 'ko_KR', en: 'en_US' };

/**
 * 페이지별 메타데이터 생성 — 제목·설명·canonical·hreflang(ko/en/x-default)·OpenGraph·Twitter.
 * @param path 로케일 뒤 경로 (예: '' | '/about' | '/cases' | '/services')
 */
export async function buildMetadata(
  locale: string,
  metaKey: MetaKey,
  path: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const title = metaKey ? t(`${metaKey}.title`) : t('title');
  const description = metaKey ? t(`${metaKey}.description`) : t('description');
  const canonical = `${SITE_URL}/${locale}${path}`;

  // 검색 키워드: 공통(base) + 페이지별. 중복 제거.
  const baseKeywords = (t.raw('keywords') as string[] | undefined) ?? [];
  const pageKeywords = metaKey
    ? ((t.raw(`${metaKey}.keywords`) as string[] | undefined) ?? [])
    : [];
  const keywords = Array.from(new Set([...baseKeywords, ...pageKeywords]));

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) languages[loc] = `${SITE_URL}/${loc}${path}`;
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${path}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      locale: OG_LOCALE[locale] ?? locale,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

/** 조직(Organization) 구조화 데이터(JSON-LD). 검색결과 리치 표시용. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: '주식회사 브로큰에그',
    url: SITE_URL,
    logo: `${SITE_URL}${OG_IMAGE}`,
    foundingDate: '2023-07-20',
    founders: [{ '@type': 'Person', name: '이상문' }],
    description:
      '반응형 3D 인터랙션 시뮬레이션 · XR 산업안전 교육 솔루션을 만드는 기업.',
    knowsAbout: [
      '3D simulation',
      'interactive 3D',
      '3D product visualization',
      'digital twin',
      'XR',
      'VR',
      'AR',
      'industrial safety training',
      'WebGL',
      '3D 시뮬레이션',
      '반응형 3D',
      'XR 산업안전 교육',
    ],
    sameAs: [SITE_URL],
  };
}
