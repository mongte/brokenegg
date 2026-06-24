import styles from './site-header.module.css';
import { getTranslations } from 'next-intl/server';
import { Badge } from '@/shared/ui/badge';
import { Logo } from '@/shared/ui/logo';
import { siteConfig } from '@/shared/config';
import { Link } from '@/i18n/navigation';
import { DemoRequestButton } from '@/features/demo-request';
import { NavMenu } from '@/features/nav-menu';
import { LanguageSwitcher } from '@/features/lang-switch';

export async function SiteHeader() {
  const t = await getTranslations('header');
  return (
    <header className={styles['header']}>
      <div className={styles['nav-left']}>
        {siteConfig.nav.map((item) => (
          <Badge key={item.label} active={item.active}>
            {item.label}
          </Badge>
        ))}
      </div>
      <div className={styles['logo']}>
        <Link href="/" aria-label={t('menu.home')}>
          <Logo />
        </Link>
      </div>
      {/* 상단 우측: 언어 메뉴 → Demo Request → 햄버거 메뉴 순 */}
      <div className={styles['nav-right']}>
        <LanguageSwitcher />
        <DemoRequestButton variant="badge" />
        <NavMenu />
      </div>
    </header>
  );
}
