export interface LeaderPhoto {
  role: string;
  photo: string;
}

/**
 * 리더 사진(회사소개서 pptx에서 추출 → 흑백 처리, public/images/about/leaders).
 * 표시 텍스트(이름·역할·focus)는 messages `about.leadership.leaders` 에서, 사진은 여기서 index 순서로 병합.
 */
export const leaderPhotos: LeaderPhoto[] = [
  { role: 'CEO', photo: '/images/about/leaders/ceo.jpg' },
  { role: 'CTO', photo: '/images/about/leaders/cto.jpg' },
];
