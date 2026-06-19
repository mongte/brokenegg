export const siteConfig = {
  name: 'Broken Egg',
  metadata: {
    title: 'Broken Egg — 3D Interactive Simulation',
    description:
      '도면 속에 갇혀 있던 제품을, 손으로 만지듯 보여주세요. 브로큰에그의 3D 인터랙션 시뮬레이션 · XR 산업안전 교육 솔루션.',
  },
  /** Anchor target shared by every "데모 요청" CTA. */
  demoAnchor: '#demo',
  servicesAnchor: '#services',
  nav: [
    { label: 'PRODUCT', active: true },
    { label: 'SIMULATION', active: false },
    { label: 'SAFETY', active: false },
  ],
  /** 햄버거(오버레이) 메뉴. 랜딩은 "홈"으로 표기. */
  menu: [
    { label: '홈', href: '/' },
    { label: '서비스 소개', href: '/services' },
    { label: '고객 사례', href: '/cases' },
  ],
  topicTags: ['CLIMATE CHANGE', 'SAFETY FIRST', 'INNOVATION', 'ESG COMPLIANCE'],
  footer: {
    copyright: '© 2024 Broken Egg Inc. All Rights Reserved.',
    links: ['Privacy', 'Terms', 'Contact'],
    ref: '[REF: BRK-EGG-2024-V1]',
  },
} as const;
