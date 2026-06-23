/** 성장 연혁 한 줄. */
export interface Milestone {
  /** 표시용 날짜 (예: '2024.11'). */
  date: string;
  /** 내용. */
  title: string;
  /** 대표 성과 강조용. */
  highlight?: boolean;
}
