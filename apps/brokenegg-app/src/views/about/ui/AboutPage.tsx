import { useTranslations } from 'next-intl';
import { SiteHeader } from '@/widgets/site-header';
import { SiteFooter } from '@/widgets/site-footer';
import { ContactCta } from '@/widgets/contact-cta';
import { CompanyOverview } from '@/widgets/company-overview';
import { CompanyHistory } from '@/widgets/company-history';
import { Leadership } from '@/widgets/leadership';
import { PartnerMarquee } from '@/widgets/partner-marquee';

export function AboutPage() {
  const t = useTranslations('about');
  return (
    <>
      <div className="grid-bg" />

      <div className="canvas">
        <SiteHeader />

        <section className="hero">
          <span className="section-tag">{t('hero.tag')}</span>
          <h1 className="hero-headline">
            {t('hero.headlineLine1')}
            <br />
            {t('hero.headlineLine2')}
          </h1>
          <p className="hero-sub">{t('hero.sub')}</p>
        </section>

        <CompanyOverview />
        <CompanyHistory />
        <Leadership />

        <section className="about-partners">
          <div className="about-section-head">
            <span className="section-tag">{t('partners.tag')}</span>
            <h2>{t('partners.title')}</h2>
            <p>{t('partners.sub')}</p>
          </div>
          <PartnerMarquee />
        </section>

        <ContactCta />
        <SiteFooter />
      </div>
    </>
  );
}
