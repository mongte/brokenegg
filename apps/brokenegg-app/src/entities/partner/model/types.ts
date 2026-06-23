/** 산학협력 · 기관 파트너 로고 한 건. */
export interface Partner {
  id: string;
  /** 기관/학교명 (이미지 대체 텍스트). */
  name: string;
  /** public 기준 로고 경로. */
  logo: string;
  /** 분류 — 'institution'(지원기관/정부) | 'academia'(산학협력 학교). */
  kind: 'institution' | 'academia';
}
