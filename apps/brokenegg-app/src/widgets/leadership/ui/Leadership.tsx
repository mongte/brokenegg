import Image from 'next/image';
import styles from './leadership.module.css';
import { useTranslations } from 'next-intl';
import { leaderPhotos } from '@/entities/leader';

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
        {leaders.map((l, i) => (
          <article className={styles['leader-card']} key={l.name}>
            {leaderPhotos[i] ? (
              <div className={styles['leader-photo']}>
                <Image
                  src={leaderPhotos[i].photo}
                  alt={`${l.name} ${l.role}`}
                  fill
                  sizes="120px"
                  // 직접 교체하는 사진이라 최적화 캐시(/_next/image, immutable)를 끔
                  // → public 원본을 그대로 서빙, 파일 교체가 새로고침에 바로 반영.
                  unoptimized
                />
              </div>
            ) : null}
            <div className={styles['leader-info']}>
              <div className={styles['leader-role']}>{l.role}</div>
              <h3 className={styles['leader-name']}>{l.name}</h3>
              <p className={styles['leader-focus']}>{l.focus}</p>
            </div>
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
