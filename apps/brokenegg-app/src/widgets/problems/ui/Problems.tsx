import styles from './problems.module.css';
import { Badge } from '@/shared/ui/badge';
import { siteConfig } from '@/shared/config';
import { ProblemCard, problems } from '@/entities/problem';

export function Problems() {
  return (
    <>
      <div className={styles['section-header']}>
        <div className={styles['tags-row']}>
          {siteConfig.topicTags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className={styles['sort-by']}>
          Sort by <span>NEWEST</span>
        </div>
      </div>

      <section className={styles['problem-grid']}>
        {problems.map((problem) => (
          <ProblemCard key={problem.num} problem={problem} />
        ))}
      </section>
    </>
  );
}
