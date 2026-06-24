import styles from './problems.module.css';
import { useTranslations } from 'next-intl';
import { Badge } from '@/shared/ui/badge';
import { siteConfig } from '@/shared/config';
import { ProblemCard, type Problem } from '@/entities/problem';

export function Problems() {
  const t = useTranslations('problems');
  const items = t.raw('items') as Problem[];
  return (
    <>
      <div className={styles['section-header']}>
        <div className={styles['tags-row']}>
          {siteConfig.topicTags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className={styles['sort-by']}>
          {t('sortBy')} <span>{t('newest')}</span>
        </div>
      </div>

      <section className={styles['problem-grid']}>
        {items.map((problem) => (
          <ProblemCard key={problem.num} problem={problem} />
        ))}
      </section>
    </>
  );
}
