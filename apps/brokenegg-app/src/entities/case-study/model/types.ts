export interface CaseStudy {
  id: string;
  /** 고객사명 (예: 주식회사 쏘쿨) */
  company: string;
  /** 대상 제품/프로젝트 (예: 캠핑용 냉장고) */
  product: string;
  description: string;
  /** 외부 링크 또는 연락처(스토어 URL / 이메일 등). 없으면 미표기. */
  link?: string;
  /** 케이스 소개 영상(YouTube embed). 없으면 영역만 placeholder. */
  videoUrl?: string;
  /** 인터랙티브 3D 체험(iframe). 없으면 영역만 placeholder. */
  experienceUrl?: string;
  /** 3D 체험 썸네일(클릭 전 노출 이미지) 오버라이드. 미지정 시 영상 썸네일을 사용. */
  posterUrl?: string;
}
