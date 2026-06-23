import styles from './site-header.module.css';
import Link from 'next/link';
import { Badge } from '@/shared/ui/badge';
import { Logo } from '@/shared/ui/logo';
import { siteConfig } from '@/shared/config';
import { DemoRequestButton } from '@/features/demo-request';
import { NavMenu } from '@/features/nav-menu';

export function SiteHeader() {
  return (
    <header>
      <div className={styles['nav-left']}>
        {siteConfig.nav.map((item) => (
          <Badge key={item.label} active={item.active}>
            {item.label}
          </Badge>
        ))}
      </div>
      <div className={styles['logo']}>
        <Link href="/" aria-label="홈으로 이동">
          <Logo />
        </Link>
      </div>
      <div className={styles['nav-right']}>
        <DemoRequestButton variant="badge" label="DEMO REQUEST" />
        <NavMenu />
      </div>
    </header>
  );
}
