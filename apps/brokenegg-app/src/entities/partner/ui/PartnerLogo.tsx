import styles from './partner-logo.module.css';
import type { Partner } from '../model/types';

interface PartnerLogoProps {
  partner: Partner;
  /** 마퀴 복제본 등 스크린리더에서 중복 읽기를 막을 때 true. */
  decorative?: boolean;
}

/** 파트너 로고 한 칸. 높이 고정, 폭은 비율 유지. */
export function PartnerLogo({ partner, decorative = false }: PartnerLogoProps) {
  return (
    <span className={styles['partner-logo']} title={partner.name}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={partner.logo}
        alt={decorative ? '' : partner.name}
        aria-hidden={decorative || undefined}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </span>
  );
}
