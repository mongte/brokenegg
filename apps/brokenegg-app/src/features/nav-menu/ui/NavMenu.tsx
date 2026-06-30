'use client';

import styles from './nav-menu.module.css';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Home, Briefcase, Building2, type LucideIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';

/** 메뉴 항목 — href + 경로별 아이콘. 라벨은 로케일별로 t('header.menu.*')에서. */
const MENU_ITEMS: { key: string; href: string; Icon: LucideIcon }[] = [
  { key: 'home', href: '/', Icon: Home },
  { key: 'cases', href: '/cases', Icon: Briefcase },
  { key: 'about', href: '/about', Icon: Building2 },
];

/**
 * 헤더 우측 햄버거 버튼 → 버튼 아래로 펼쳐지는 드롭다운 메뉴.
 * 링크는 로케일을 자동으로 붙이는 next-intl Link를 사용한다.
 */
export function NavMenu() {
  const t = useTranslations('header');
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
        aria-label={t(open ? 'menu.close' : 'menu.open')}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      />

      {open ? (
        <nav className={styles['nav-dropdown']} role="menu" aria-label={t('menu.label')}>
          {MENU_ITEMS.map(({ key, href, Icon }) => (
            <Link key={href} href={href} role="menuitem" onClick={() => setOpen(false)}>
              <span className={styles['nav-dropdown-icon']} aria-hidden="true">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              {t(`menu.${key}`)}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
