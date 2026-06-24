import styles from './leadership.module.css';
import { useTranslations } from 'next-intl';

interface Leader {
  name: string;
  role: string;
  focus: string;
}

export function Leadership() {
  const t = useTranslations('about.leadership');
  const leaders = t.raw('leaders') as Leader[];
  const background = t.raw('background') as string[];
  return (
    <section className="about-leadership">
      <div className="about-section-head">
        <span className="section-tag">{t('tag')}</span>
        <h2>{t('title')}</h2>
        <p>{t('sub')}</p>
      </div>

      <div className={styles['leader-grid']}>
        {leaders.map((l) => (
          <article className={styles['leader-card']} key={l.name}>
            <div className={styles['leader-role']}>{l.role}</div>
            <h3 className={styles['leader-name']}>{l.name}</h3>
            <p className={styles['leader-focus']}>{l.focus}</p>
          </article>
        ))}
      </div>

      <div className={styles['leader-background']}>
        <span className={styles['leader-background-label']}>{t('backgroundLabel')}</span>
        <ul className={styles['leader-background-tags']}>
          {background.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
