import { useTranslations } from 'next-intl';
import { SiteHeader } from '@/widgets/site-header';
import { SiteFooter } from '@/widgets/site-footer';
import { FinalCta } from '@/widgets/final-cta';
import { CaseStudyCard, caseStudies } from '@/entities/case-study';

export function CasesPage() {
  const t = useTranslations('cases');
  return (
    <>
      <div className="grid-bg" />

      <div className="canvas">
        <SiteHeader />

        <section className="hero">
          <span className="section-tag">{t('tag')}</span>
          <h1 className="hero-headline">
            {t('headlineLine1')}
            <br />
            {t('headlineLine2')}
          </h1>
          <p className="hero-sub">{t('sub')}</p>
        </section>

        <section className="cases">
          {caseStudies.map((cs) => (
            <CaseStudyCard
              key={cs.id}
              caseStudy={{
                ...cs,
                company: t(`items.${cs.id}.company`),
                product: t(`items.${cs.id}.product`),
                description: t(`items.${cs.id}.description`),
              }}
            />
          ))}
        </section>

        <FinalCta />
        <SiteFooter />
      </div>
    </>
  );
}
