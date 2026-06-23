import styles from './problem-card.module.css';
import type { Problem } from '../model/types';

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <div className={styles['problem-card']}>
      <span className={styles['num']}>{problem.num}</span>
      <h3>{problem.title}</h3>
      <p>{problem.body}</p>
    </div>
  );
}
