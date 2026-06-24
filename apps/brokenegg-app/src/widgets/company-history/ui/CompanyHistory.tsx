import styles from './company-history.module.css';
import { useTranslations } from 'next-intl';
import { milestones, MilestoneItem } from '@/entities/milestone';

export function CompanyHistory() {
  const t = useTranslations('about.history');
  // 날짜·강조는 모델에서, 내용(title)은 로케일 메시지에서 순서대로 병합.
  const titles = t.raw('items') as string[];
  return (
    <section className="about-history">
      <div className="about-section-head">
        <span className="section-tag">{t('tag')}</span>
        <h2>{t('title')}</h2>
        <p>{t('sub')}</p>
      </div>

      <ol className={styles['milestone-list']}>
        {milestones.map((m, i) => (
          <MilestoneItem key={m.date} milestone={{ ...m, title: titles[i] }} />
        ))}
      </ol>
    </section>
  );
}
