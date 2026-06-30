import { useTranslations } from 'next-intl';
import styles from './trust.module.css';

/**
 * 신뢰 지표 섹션 — 회사소개서(특허·인증·NVIDIA Inception) + 고객·레퍼런스.
 * 카피는 `messages` 의 `trust.*`. 랜딩의 testimonials 앞에 배치.
 */
export function Trust() {
  const t = useTranslations('trust');
  const stats = t.raw('stats') as { value: string; label: string }[];
  const clients = t.raw('clients') as string[];

  return (
    <section className="trust" id="credentials">
      <div className={`about-section-head ${styles['head']}`}>
        <span className="section-tag">{t('tag')}</span>
        <h2>{t('title')}</h2>
        <p>{t('sub')}</p>
      </div>

      <div className={styles['stats']}>
        {stats.map((s) => (
          <div key={s.value} className={styles['stat']}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className={styles['clients']}>
        <span className={styles['clients-label']}>{t('clientsLabel')}</span>
        <ul>
          {clients.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
