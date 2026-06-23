'use client';

import styles from './service-preview.module.css';
import { cx } from '@/shared/lib';
import { useEffect, useRef, useState, type TransitionEvent } from 'react';

interface ServicePreviewProps {
  /** 펼침 여부. true → slide down, false → slide up. */
  open: boolean;
  /** 임베드할 데모 URL. */
  url: string | null;
  /** 헤더 라벨용 서비스명. */
  title?: string;
  /** 콘텐츠 종류 — 헤더 라벨 접미사 결정. 기본 'live3d'. */
  kind?: 'live3d' | 'video';
  onClose: () => void;
}

/**
 * 서비스 카드 아래로 펼쳐지는 라이브 3D 프리뷰 패널.
 *
 * 동작 규칙
 * - **최초 열림 전**에는 패널/iframe 모두 DOM에 없음.
 * - 한 번 열린 뒤에는 iframe을 **언마운트하지 않고 유지** → 재열람 시 재로딩 없음(3D 상태 보존).
 *   닫히면 stage를 `display:none`(parked)으로 숨겨 브라우저가 렌더 루프(rAF)를 자동 일시정지.
 * - 열릴 때: 높이 0 → 목표 높이로 slide down. **transition이 끝난 뒤에야** iframe을 노출(reveal).
 */
export function ServicePreview({ open, url, title, kind = 'live3d', onClose }: ServicePreviewProps) {
  const kindLabel = kind === 'video' ? 'VIDEO' : 'LIVE 3D';
  const panelRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  // 최초 열림 이후 패널을 DOM에 계속 유지 (iframe 보존용)
  const [everOpened, setEverOpened] = useState(false);
  // 높이 목표 (slide down/up 트리거)
  const [expanded, setExpanded] = useState(false);
  // stage(iframe) 시각적 노출 여부 (slide down 완료 후 true)
  const [revealed, setRevealed] = useState(false);
  // 완전히 접힌 뒤 stage를 display:none 처리 → rAF 정지 + 메모리 외 GPU 작업 중단
  const [parked, setParked] = useState(true);

  useEffect(() => {
    if (open) {
      setEverOpened(true);
      setParked(false); // 보이기 전에 stage를 활성화(숨김 해제)
      // 높이 0 상태로 커밋된 다음 프레임에서 목표 높이로 전환 → 트랜지션 발동.
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => setExpanded(true));
      });
      return () => cancelAnimationFrame(rafRef.current);
    }
    // 닫기: 먼저 노출 해제 후 높이 접기. (collapse 완료 시 parked 처리)
    setRevealed(false);
    setExpanded(false);
    return undefined;
  }, [open]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== panelRef.current || event.propertyName !== 'height') return;
    if (expanded) {
      // slide down 완료 → iframe 노출
      setRevealed(true);
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      // slide up 완료 → stage를 display:none으로 park (iframe은 살아있되 렌더 정지)
      setParked(true);
    }
  };

  if (!everOpened) return null;

  return (
    <div
      ref={panelRef}
      className={cx(styles['service-preview'], expanded && styles['open'])}
      onTransitionEnd={handleTransitionEnd}
      aria-hidden={!expanded}
    >
      <div className={styles['service-preview-inner']}>
        <div className={styles['service-preview-bar']}>
          <span className={styles['service-preview-label']}>
            {title ? `${title} · ${kindLabel}` : kindLabel}
          </span>
          <button type="button" className={styles['service-preview-close']} onClick={onClose}>
            닫기 ✕
          </button>
        </div>
        <div
          className={cx(
            styles['service-preview-stage'],
            revealed && styles['is-revealed'],
            parked && styles['is-parked'],
          )}
        >
          {url ? (
            <iframe
              src={url}
              title={title ?? 'Live 3D preview'}
              loading="lazy"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write; accelerometer; gyroscope; xr-spatial-tracking; web-share"
              allowFullScreen
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
