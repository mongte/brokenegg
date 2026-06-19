import type { Service } from './types';

export const services: Service[] = [
  {
    code: 'BE-01',
    tag: 'LIVE INTERACTIVE',
    category: 'Product Visualization',
    name: 'Egg One',
    image:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    demoUrl: 'https://be-engine.web.app/',
  },
  {
    code: 'BE-02',
    tag: 'MEDIA ENGINE',
    category: 'Interactive 3D Media',
    name: 'Egg Two',
    image:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    demoUrl: 'https://be-demo01.web.app',
  },
  {
    code: 'BE-XR',
    tag: 'VR/AR/MR',
    category: 'Industrial Training',
    name: 'XR Safety',
    image:
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800',
    // 음소거 자동재생(브라우저 정책상 소리 자동재생은 차단되므로 mute=1로 보장)
    demoUrl:
      'https://www.youtube.com/embed/23-NOB2gDpw?autoplay=1&mute=1&playsinline=1&rel=0',
    previewKind: 'video',
  },
  {
    code: 'CUSTOM',
    tag: 'R&D LAB',
    category: 'Enterprise Solution',
    name: 'Custom Lab',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    href: '/cases',
    cueLabel: 'CASES ▸',
  },
];
