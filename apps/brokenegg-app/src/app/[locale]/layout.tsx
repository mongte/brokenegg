import '../global.css';
import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import {
  SITE_URL,
  NAVER_SITE_VERIFICATION,
  buildMetadata,
  organizationJsonLd,
} from '@/shared/seo';
import { DemoRequestModal } from '@/features/demo-request';

/** 빌드 시 ko·en 두 로케일을 정적 생성. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const base = await buildMetadata(locale, '', '');
  return {
    // 상대 OG/canonical URL을 절대 URL로 해석하는 기준
    metadataBase: new URL(SITE_URL),
    ...base,
    robots: { index: true, follow: true },
    // 네이버 서치어드바이저 사이트 인증 (이전 홈페이지 코드 재사용)
    verification: { other: { 'naver-site-verification': NAVER_SITE_VERIFICATION } },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // 정적 렌더링 활성화 (서버 컴포넌트의 useTranslations가 동작하도록)
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </head>
      <body>
        <NextIntlClientProvider>
          {children}
          <DemoRequestModal />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
