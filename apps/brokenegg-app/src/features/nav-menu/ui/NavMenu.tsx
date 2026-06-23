'use client';

import styles from './nav-menu.module.css';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Home, Boxes, Briefcase, Building2, ArrowRight, type LucideIcon } from 'lucide-react';
import { siteConfig } from '@/shared/config';

/** 메뉴 경로별 어울리는 아이콘. 매핑이 없으면 기본 화살표. */
const MENU_ICONS: Record<string, LucideIcon> = {
  '/': Home,
  '/services': Boxes,
  '/cases': Briefcase,
  '/about': Building2,
};

/**
 * 헤더 우측 햄버거 버튼 → 버튼 아래로 펼쳐지는 드롭다운 메뉴.
 * 메뉴 항목은 siteConfig.menu (홈 / 서비스 소개 / 고객 사례).
 */
export function NavMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [open]);

  return (
    <div className={styles['nav-menu']} ref={ref}>
      <button
        type="button"
        className={styles['menu-toggle']}
        aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      />

      {open ? (
        <nav className={styles['nav-dropdown']} role="menu" aria-label="메뉴">
          {siteConfig.menu.map((item) => {
            const Icon = MENU_ICONS[item.href] ?? ArrowRight;
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <span className={styles['nav-dropdown-icon']} aria-hidden="true">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
