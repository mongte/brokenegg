import { useTranslations } from 'next-intl';
import { SiteHeader } from '@/widgets/site-header';
import { SiteFooter } from '@/widgets/site-footer';
import { FinalCta } from '@/widgets/final-cta';
import { UseCaseRow, useCases } from '@/entities/use-case';

export function ServicesIntroPage() {
  const t = useTranslations('servicesPage');
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

        <section className="use-cases">
          {useCases.map((uc) => (
            <UseCaseRow
              key={uc.id}
              useCase={{
                ...uc,
                title: t(`useCases.${uc.id}.title`),
                body: t.raw(`useCases.${uc.id}.body`) as string[],
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
