import styles from './partner-marquee.module.css';
import { partners, PartnerLogo } from '@/entities/partner';

/**
 * 산학협력 · 지원기관 로고 마퀴.
 *
 * 뫼비우스(무한 루프) 구현
 * - 같은 로고 목록을 **두 벌** 이어 붙이고 트랙을 translateX 0 → -50%로 무한 이동.
 *   두 번째 벌이 첫 번째 벌과 동일하므로 -50% 지점이 시작점과 완전히 겹쳐 끊김 없이 이어진다.
 * - 순수 CSS 애니메이션(JS 불필요). hover 시 일시정지, reduced-motion이면 정지.
 * - 두 번째 벌은 스크린리더 중복 방지를 위해 decorative 처리.
 */
export function PartnerMarquee() {
  return (
    <div className={styles['marquee']} role="region" aria-label="산학협력 및 지원기관">
      <div className={styles['marquee-track']}>
        <ul className={styles['marquee-set']}>
          {partners.map((p) => (
            <li key={p.id}>
              <PartnerLogo partner={p} />
            </li>
          ))}
        </ul>
        <ul className={styles['marquee-set']} aria-hidden="true">
          {partners.map((p) => (
            <li key={`dup-${p.id}`}>
              <PartnerLogo partner={p} decorative />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
