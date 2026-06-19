export interface Service {
  /** e.g. "BE-01" */
  code: string;
  /** e.g. "LIVE INTERACTIVE" */
  tag: string;
  category: string;
  name: string;
  image: string;
  /** 인라인 프리뷰로 띄울 데모 URL. 없으면 카드 클릭 시 펼침 없음. */
  demoUrl?: string;
  /** 프리뷰 콘텐츠 종류. 라벨/큐 문구가 달라짐. 기본 'live3d'. */
  previewKind?: 'live3d' | 'video';
  /** 설정되면 카드 클릭 시 인라인 프리뷰 대신 해당 내부 라우트로 이동. */
  href?: string;
  /** 카드 우하단 큐 문구 직접 지정(주로 href 카드용). */
  cueLabel?: string;
}
