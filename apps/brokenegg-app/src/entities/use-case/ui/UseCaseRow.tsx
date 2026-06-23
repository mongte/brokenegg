import styles from './use-case.module.css';
import {
  Users,
  TrendingUp,
  Rss,
  Monitor,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react';
import type { UseCase, UseCaseIcon } from '../model/types';

const ICONS: Record<UseCaseIcon, LucideIcon> = {
  users: Users,
  'trending-up': TrendingUp,
  rss: Rss,
  monitor: Monitor,
  'message-circle': MessageCircle,
};

interface UseCaseRowProps {
  useCase: UseCase;
}

export function UseCaseRow({ useCase }: UseCaseRowProps) {
  const Icon = ICONS[useCase.icon];

  return (
    <article className={styles['use-case']}>
      <div className={styles['use-case-head']}>
        <span className={styles['use-case-icon']}>
          <Icon size={40} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h3>{useCase.title}</h3>
      </div>
      <div className={styles['use-case-body']}>
        {useCase.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  );
}
