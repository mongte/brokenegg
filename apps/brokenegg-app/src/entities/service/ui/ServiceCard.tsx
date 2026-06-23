import styles from './service-card.module.css';
import { cx } from '@/shared/lib';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/shared/ui/badge';
import type { Service } from '../model/types';

interface ServiceCardProps {
  service: Service;
  /** 제공되면 카드가 클릭 가능해지고 인라인 프리뷰 펼침을 토글. (href 카드에는 불필요) */
  onSelect?: () => void;
  /** 현재 펼쳐져 활성 상태인지. */
  active?: boolean;
}

export function ServiceCard({ service, onSelect, active = false }: ServiceCardProps) {
  const isLink = Boolean(service.href);
  const interactive = isLink || Boolean(onSelect);

  const cueLabel = isLink
    ? service.cueLabel ?? 'VIEW ▸'
    : service.previewKind === 'video'
      ? 'WATCH ▸'
      : 'LIVE 3D ▸';

  const inner = (
    <>
      <Image
        src={service.image}
        alt={service.name}
        fill
        sizes="(max-width: 1024px) 100vw, 25vw"
      />
      <div className={styles['service-overlay']}>
        <div className={styles['service-meta']}>
          <Badge style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
            {service.code}
          </Badge>
          <span style={{ fontSize: '10px', fontWeight: 700 }}>{service.tag}</span>
        </div>
        <div className={styles['service-info']}>
          <span>{service.category}</span>
          <h4>{service.name}</h4>
        </div>
      </div>
      {interactive ? (
        <span className={styles['service-cue']}>{active ? '닫기 ✕' : cueLabel}</span>
      ) : null}
    </>
  );

  // href가 있으면 라우트 이동 링크로 렌더 (인라인 프리뷰 대신).
  if (service.href) {
    return (
      <Link
        href={service.href}
        className={cx(styles['service-item'], styles['is-interactive'], 'is-link')}
        aria-label={`${service.name} — ${service.category}`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={cx(
        styles['service-item'],
        interactive && styles['is-interactive'],
        active && styles['is-active'],
      )}
      onClick={onSelect}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-expanded={interactive ? active : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect?.();
              }
            }
          : undefined
      }
    >
      {inner}
    </div>
  );
}
