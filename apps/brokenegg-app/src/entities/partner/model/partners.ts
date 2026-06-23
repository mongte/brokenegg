import type { Partner } from './types';

const BASE = '/images/about/partners';

/**
 * 산학협력 · 지원기관 로고.
 * - institution: 정부·창업지원기관·글로벌 파트너 배지
 * - academia: 산학협력 학교
 * 로고 이미지는 모두 내부 리소스(public/images/about/partners)로 관리.
 */
export const partners: Partner[] = [
  // 지원기관 / 정부 / 글로벌
  { id: 'mss', name: '중소벤처기업부', logo: `${BASE}/mss.png`, kind: 'institution' },
  { id: 'kised', name: '창업진흥원', logo: `${BASE}/kised.png`, kind: 'institution' },
  {
    id: 'youth-startup-academy',
    name: '청년창업사관학교',
    logo: `${BASE}/youth-startup-academy.png`,
    kind: 'institution',
  },
  { id: 'kosme', name: '중소벤처기업진흥공단 (KOSME)', logo: `${BASE}/kosme.png`, kind: 'institution' },
  {
    id: 'nvidia-inception',
    name: 'NVIDIA Inception Program',
    logo: `${BASE}/nvidia-inception.png`,
    kind: 'institution',
  },
  // 산학협력 학교
  { id: 'sungil-hs', name: '성일정보고등학교', logo: `${BASE}/sungil-hs.png`, kind: 'academia' },
  { id: 'incheon-univ', name: '인천대학교', logo: `${BASE}/incheon-univ.png`, kind: 'academia' },
  { id: 'sangmyung-univ', name: '상명대학교', logo: `${BASE}/sangmyung-univ.png`, kind: 'academia' },
  {
    id: 'korea-media-univ',
    name: '한국영상대학교',
    logo: `${BASE}/korea-media-univ.png`,
    kind: 'academia',
  },
  { id: 'suwon-univ', name: '수원대학교', logo: `${BASE}/suwon-univ.png`, kind: 'academia' },
];
