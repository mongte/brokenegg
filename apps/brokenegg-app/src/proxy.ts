import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // api·내부 경로·정적 파일(.확장자 포함)은 제외하고 모든 경로에 로케일 적용
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
