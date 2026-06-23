import styles from './company-history.module.css';
import { milestones, MilestoneItem } from '@/entities/milestone';

export function CompanyHistory() {
  return (
    <section className="about-history">
      <div className="about-section-head">
        <span className="section-tag">History</span>
        <h2>성장 연혁</h2>
        <p>설립 이후 특허 · 인증 · 전시로 쌓아온 발자취입니다.</p>
      </div>

      <ol className={styles['milestone-list']}>
        {milestones.map((m) => (
          <MilestoneItem key={`${m.date}-${m.title}`} milestone={m} />
        ))}
      </ol>
    </section>
  );
}
