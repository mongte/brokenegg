# Brokenegg 홈페이지

[주식회사 브로큰에그(Brokenegg Inc.)](https://www.brokenegg.co.kr)의 공식 홈페이지 모노레포입니다.

> 정적인 3D 설계 데이터를 **살아 숨 쉬는 현실**로 전환하는 3D 그래픽스 소프트웨어 기업.
> 3D 설계 파일에 물리 법칙과 상호작용 논리를 부여해 실제처럼 작동하는 가상 환경(XR·실시간 인터랙션)을 구축합니다.

- **다국어**: 한국어(기본) · 영어
- **핵심 콘텐츠**: 회사 소개, 솔루션(3D 디지털제품여권 / 산업안전위험 교육), 포트폴리오, QR 기반 3D 웹뷰어

---

## 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 모노레포 | [Nx](https://nx.dev) 22 · [pnpm](https://pnpm.io) workspace |
| 웹 앱 | [Next.js](https://nextjs.org) 16 (App Router) · React 19 · TypeScript 5.9 |
| 스타일 | Tailwind CSS 3.4 · CSS Modules · `global.css` 디자인 토큰 |
| 국제화 | [next-intl](https://next-intl-docs.vercel.app) 4 (`ko` 기본, `en`) |
| 아키텍처 | Feature-Sliced Design (FSD) |
| 3D 뷰어 | Godot 4 웹(HTML5/WASM) export · Cloudflare R2 + Worker 에셋 호스팅 |
| 테스트 | Playwright (E2E) |
| 배포 | Vercel (웹 앱) · Cloudflare Workers (3D 에셋 엣지 서버) |

---

## 디렉터리 구조

```
brokenegg/
├── apps/
│   └── brokenegg-app/        # Next.js 홈페이지 (FSD 구조)
├── packages/                 # 공유 패키지 (예약)
├── workers/
│   └── godot-viewer/         # Godot 3D 에셋 엣지 서버 (Cloudflare Worker × R2)
├── brokenegg-doc/            # 지식 위키 (Single Source of Truth, Graphify)
├── graphify-out/             # Graphify가 생성한 지식 그래프 산출물
├── nx.json · pnpm-workspace.yaml
```

### `apps/brokenegg-app` (FSD 레이어)

```
src/
├── app/                      # Next.js App Router (라우트·API·SEO)
│   ├── [locale]/             # 로케일별 페이지: / · /about · /cases · /viewer/[id]
│   ├── godot/[...path]/      # Godot 에셋 프록시 라우트 핸들러
│   └── api/                  # demo-request, hello
├── views/                    # 페이지 조합 (home · about · cases)
├── widgets/                  # 독립 UI 블록 (hero · services · trust · site-header ...)
├── features/                 # 사용자 인터랙션 (demo-request · lang-switch · nav-menu ...)
├── entities/                 # 도메인 모델 (service · case-study · partner ...)
├── shared/                   # config · lib · seo · ui
└── i18n/                     # next-intl routing · navigation · request
```

> FSD 레이어/명명 규칙과 디자인 시스템의 단일 출처는 `brokenegg-doc/wiki/`입니다.

---

## 시작하기

### 요구 사항
- Node.js 20+ · pnpm

### 설치 & 개발 서버

```bash
pnpm install
pnpm dev          # nx dev @brokenegg/brokenegg-app → http://localhost:3000
```

### 주요 스크립트 (루트)

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버
pnpm lint         # 전체 lint
pnpm test         # 전체 test
pnpm typecheck    # 전체 타입 검사
pnpm graph        # Nx 프로젝트 그래프 시각화
```

### E2E 테스트

```bash
cd apps/brokenegg-app
pnpm test:e2e            # Playwright
pnpm test:e2e:headed     # 브라우저 표시 모드
```

---

## 3D 웹뷰어 (Godot × Cloudflare R2)

QR 스캔 → `/[locale]/viewer/[id]` 라우트에서 Godot 4 웹 export(WASM)를 직접 canvas에 마운트해 3D 모델을 렌더합니다.
에셋(wasm/pck/br)은 Cloudflare R2에 두고, `workers/godot-viewer` 엣지 Worker가 egress $0으로 서빙합니다.

- 로컬 개발 시에는 `apps/brokenegg-app/src/app/godot/[...path]/route.ts` 핸들러가 에셋을 프록시합니다.
- 배포·업로드 절차는 [`workers/godot-viewer/README.md`](workers/godot-viewer/README.md) 참고.
- 아키텍처 단일 출처: `brokenegg-doc/wiki/핵심 기술 - 3D 웹뷰어 배포 아키텍처.md`

---

## 지식 위키 (brokenegg-doc)

이 저장소의 **카피·디자인 시스템·솔루션 사실 정보의 단일 출처**는 `brokenegg-doc/`입니다.
Graphify로 생성한 지식 그래프가 `graphify-out/`에 있으며, 작업 전 `graphify-out/GRAPH_REPORT.md`를
먼저 참고하면 토큰을 절약하며 맥락을 파악할 수 있습니다. (자세한 운영 규칙은 [`CLAUDE.md`](CLAUDE.md) 참고.)

---

## 라이선스

MIT
