import { defineRouting } from 'next-intl/routing';

/** 지원 로케일 — 한국어(기본) · 영어. */
export const routing = defineRouting({
  locales: ['ko', 'en'],
  defaultLocale: 'ko',
});

export type Locale = (typeof routing.locales)[number];
