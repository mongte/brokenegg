import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/button';
import { siteConfig } from '@/shared/config';
import { DemoRequestButton } from '@/features/demo-request';

export function Hero() {
  const t = useTranslations();
  return (
    <section className="hero">
      <span className="section-tag">{t('hero.tag')}</span>
      <h1 className="hero-headline">
        {t('hero.headlineLine1')}
        <br />
        {t('hero.headlineLine2')}
      </h1>
      <div className="hero-ctas">
        <DemoRequestButton variant="primary" />
        <Button href={siteConfig.servicesAnchor} variant="secondary">
          {t('common.viewServices')}
        </Button>
      </div>
    </section>
  );
}
