import styles from './milestone.module.css';
import { cx } from '@/shared/lib';
import type { Milestone } from '../model/types';

interface MilestoneItemProps {
  milestone: Milestone;
}

export function MilestoneItem({ milestone }: MilestoneItemProps) {
  return (
    <li className={cx(styles['milestone'], milestone.highlight && styles['milestone--highlight'])}>
      <span className={styles['milestone-date']}>{milestone.date}</span>
      <span className={styles['milestone-dot']} aria-hidden="true" />
      <span className={styles['milestone-title']}>{milestone.title}</span>
    </li>
  );
}
