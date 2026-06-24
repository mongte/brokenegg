'use client';

import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { openDemoModal } from '../lib/events';

type DemoRequestVariant = 'primary' | 'secondary' | 'badge';

interface DemoRequestButtonProps {
  variant?: DemoRequestVariant;
  /** 직접 지정 시 그대로 사용, 미지정 시 로케일별 기본 라벨. */
  label?: string;
  style?: CSSProperties;
}

/**
 * "데모 요청" CTA. 헤더·히어로·최종 CTA에서 재사용.
 * 클릭 시 공용 데모 요청 모달을 연다(openDemoModal()).
 * 라벨은 next-intl로 다국어 처리 — badge 변형은 헤더용 짧은 라벨을 쓴다.
 */
export function DemoRequestButton({ variant = 'primary', label, style }: DemoRequestButtonProps) {
  const t = useTranslations();
  const className = variant === 'badge' ? 'badge' : `btn btn-${variant}`;
  const text = label ?? (variant === 'badge' ? t('header.demoRequest') : t('common.demoRequest'));

  return (
    <button type="button" className={className} style={style} onClick={openDemoModal}>
      {text}
    </button>
  );
}
