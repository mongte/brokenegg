import type { CaseStudy } from './types';

// 영상/3D URL은 추후 제공 예정 — 지금은 영역(placeholder)만 잡는다.
// 설명/링크가 확인되지 않은 항목은 [확인 필요]로 두고 채워넣는다.
export const caseStudies: CaseStudy[] = [
  {
    id: 'sokool',
    company: '주식회사 쏘쿨',
    product: '캠핑용 냉장고',
    description: '특허받은 항균소재 알루미늄 챔버를 탑재하여 효과적인 냉각전달의 기능',
    link: 'https://smartstore.naver.com/sokool',
  },
  {
    id: 'cslab',
    company: 'CSLAB',
    product: '칵테일 자동제조장비',
    description: '칵테일 대량생산을 위한 자동제조장비',
    link: 'cocktailstyle.lab@gmail.com',
  },
  {
    id: 'balance-brake',
    company: '균형제동',
    product: '[확인 필요 — 제품/프로젝트명]',
    description: '[확인 필요 — 설명 입력 예정]',
  },
];
