import styles from './company-overview.module.css';
import { useTranslations } from 'next-intl';

const ROW_KEYS = ['company', 'founded', 'ceo', 'industry', 'business', 'service'] as const;

export function CompanyOverview() {
  const t = useTranslations('about.overview');
  return (
    <section className={styles['about-overview']}>
      <div className="about-overview-intro">
        <span className="section-tag">{t('tag')}</span>
        <h2 className={styles['about-overview-headline']}>
          {t('headlineLine1')}
          <br />
          {t('headlineLine2')}
        </h2>
        <p className={styles['about-overview-lead']}>{t('lead')}</p>
      </div>

      <dl className={styles['about-overview-table']}>
        {ROW_KEYS.map((key) => (
          <div className={styles['about-overview-row']} key={key}>
            <dt>{t(`rows.${key}`)}</dt>
            <dd>{t(`values.${key}`)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
