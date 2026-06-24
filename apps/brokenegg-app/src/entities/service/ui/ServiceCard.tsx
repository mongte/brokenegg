'use client';

import styles from './service-card.module.css';
import { cx } from '@/shared/lib';
import Image from 'next/image';
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type TransitionEvent,
} from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/shared/ui/badge';
import type { Service } from '../model/types';

interface ServiceCardProps {
  service: Service;
  /** 제공되면 카드가 클릭 가능해지고 프리뷰 노출을 토글. (href 카드에는 불필요) */
  onSelect?: () => void;
  /** 뒤집힌 카드의 닫기 버튼에서 호출. (compact 플립 모드) */
  onClose?: () => void;
  /** 현재 펼쳐져 활성 상태인지. */
  active?: boolean;
  /** ≤1024px 여부 — true면 하단 패널 대신 카드 자체가 뒤집혀 콘텐츠를 노출. */
  compact?: boolean;
}

export function ServiceCard({
  service,
  onSelect,
  onClose,
  active = false,
  compact = false,
}: ServiceCardProps) {
  const t = useTranslations('servicePreview');
  const isLink = Boolean(service.href);
  const interactive = isLink || Boolean(onSelect);

  const cueLabel = isLink
    ? service.cueLabel ?? 'VIEW ▸'
    : service.previewKind === 'video'
      ? 'WATCH ▸'
      : 'LIVE 3D ▸';

  // 플립 대상: compact 모드 + 데모를 가진 인터랙티브 카드.
  const flippable = compact && Boolean(service.demoUrl) && Boolean(onSelect);

  const flipRef = useRef<HTMLDivElement>(null);
  // 한 번 뒤집힌 뒤로는 iframe을 계속 유지 (재열람 시 재로딩 방지).
  const [mounted, setMounted] = useState(false);
  // 플립 완료 후에만 콘텐츠를 시각적으로 노출.
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!flippable) {
      setRevealed(false);
      return;
    }
    // 닫히는 중에는 즉시 콘텐츠를 숨겨 역방향 플립 동안 비치지 않게 함.
    if (!active) setRevealed(false);
  }, [active, flippable]);

  const handleFlipEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== flipRef.current || event.propertyName !== 'transform') return;
    if (active) {
      // 플립(앞→뒤) 완료 → 이제서야 iframe 마운트 + 노출.
      setMounted(true);
      setRevealed(true);
    }
  };

  const kindLabel = service.previewKind === 'video' ? 'VIDEO' : 'LIVE 3D';

  const front = (
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
        <span className={styles['service-cue']}>{active ? t('close') : cueLabel}</span>
      ) : null}
    </>
  );

  // href가 있으면 라우트 이동 링크로 렌더 (플립 없음).
  if (service.href) {
    return (
      <Link
        href={service.href}
        className={cx(styles['service-item'], styles['is-interactive'], 'is-link')}
        aria-label={`${service.name} — ${service.category}`}
      >
        {front}
      </Link>
    );
  }

  const handleKeyDown = interactive
    ? (event: ReactKeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect?.();
        }
      }
    : undefined;

  return (
    <div
      className={cx(
        styles['service-item'],
        interactive && styles['is-interactive'],
        active && styles['is-active'],
        flippable && styles['is-flippable'],
      )}
      onClick={onSelect}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-expanded={interactive ? active : undefined}
      onKeyDown={handleKeyDown}
    >
      <div ref={flipRef} className={styles['service-flip']} onTransitionEnd={handleFlipEnd}>
        <div className={styles['service-face']}>{front}</div>

        {flippable ? (
          <div
            className={styles['service-back']}
            // 뒤집힌 면에서의 클릭이 카드 토글로 버블링되지 않게 차단.
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles['service-back-bar']}>
              <span className={styles['service-back-label']}>
                {`${service.name} · ${kindLabel}`}
              </span>
              <button
                type="button"
                className={styles['service-back-close']}
                onClick={onClose}
              >
                {t('close')}
              </button>
            </div>
            <div
              className={cx(
                styles['service-back-stage'],
                revealed && styles['is-revealed'],
              )}
            >
              {mounted && service.demoUrl ? (
                <iframe
                  src={service.demoUrl}
                  title={service.name}
                  loading="lazy"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write; accelerometer; gyroscope; xr-spatial-tracking; web-share"
                  allowFullScreen
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
