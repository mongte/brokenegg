'use client';

import styles from './lang-switch.module.css';
import { useEffect, useRef, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Globe, Check } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

/**
 * 언어 메뉴. 현재 로케일을 표시하고, 같은 경로를 다른 로케일로 전환한다.
 * usePathname/useRouter(next-intl)는 로케일 프리픽스를 알아서 처리한다.
 */
export function LanguageSwitcher() {
  const t = useTranslations('lang');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
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

  const switchTo = (next: string) => {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => router.replace(pathname, { locale: next }));
  };

  return (
    <div className={styles['lang-switch']} ref={ref}>
      <button
        type="button"
        className={styles['lang-trigger']}
        aria-label={t('label')}
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={pending}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe size={15} strokeWidth={1.75} aria-hidden="true" />
        <span>{t('short')}</span>
      </button>

      {open ? (
        <div className={styles['lang-menu']} role="menu" aria-label={t('label')}>
          {routing.locales.map((loc) => (
            <button
              key={loc}
              type="button"
              role="menuitemradio"
              aria-checked={loc === locale}
              className={styles['lang-item']}
              onClick={() => switchTo(loc)}
            >
              <span>{t(loc)}</span>
              {loc === locale ? <Check size={14} strokeWidth={2.25} aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
