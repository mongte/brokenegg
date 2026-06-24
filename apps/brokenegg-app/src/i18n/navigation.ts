import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/** 로케일을 자동으로 붙여주는 내비게이션 유틸 (Link/useRouter/usePathname 등). */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
