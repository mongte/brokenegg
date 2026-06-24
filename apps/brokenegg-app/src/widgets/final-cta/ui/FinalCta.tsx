import styles from './final-cta.module.css';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/shared/config';
import { DemoRequestButton } from '@/features/demo-request';

export function FinalCta() {
  const t = useTranslations('finalCta');
  return (
    <section className={styles['final-cta']} id={siteConfig.demoAnchor.replace('#', '')}>
      <h2>
        {t('title1')}
        <br />
        {t('title2')}
      </h2>
      <DemoRequestButton
        variant="primary"
        style={{ padding: '20px 60px', fontSize: '18px' }}
      />
    </section>
  );
}
