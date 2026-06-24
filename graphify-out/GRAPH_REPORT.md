# Graph Report - .  (2026-06-24)

## Corpus Check
- 5 files · ~7,578 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 101 nodes · 169 edges · 7 communities (6 shown, 1 thin omitted)
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.83)
- Token cost: 30,000 input · 3,000 output

## Community Hubs (Navigation)
- [[_COMMUNITY_디자인 시스템 토큰·개요|디자인 시스템 토큰·개요]]
- [[_COMMUNITY_디자인 컴포넌트·레이아웃·카피|디자인 컴포넌트·레이아웃·카피]]
- [[_COMMUNITY_3D 엔진·XR·솔루션|3D 엔진·XR·솔루션]]
- [[_COMMUNITY_3D 웹뷰어 배포 아키텍처|3D 웹뷰어 배포 아키텍처]]
- [[_COMMUNITY_위키 운영·MOC|위키 운영·MOC]]
- [[_COMMUNITY_위키 가이드(CLAUDE)|위키 가이드(CLAUDE)]]

## God Nodes (most connected - your core abstractions)
1. `인덱스 (MOC)` - 24 edges
2. `디자인 시스템 - 컴포넌트` - 17 edges
3. `디자인 시스템 - 개요` - 15 edges
4. `디자인 시스템 - 디자인 토큰` - 13 edges
5. `디자인 시스템 - 페이지 레이아웃 패턴` - 13 edges
6. `핵심 기술 - 3D 웹뷰어 배포 아키텍처` - 12 edges
7. `핵심 기술 - 3D 인터랙션 시뮬레이션 엔진` - 11 edges
8. `솔루션 - 3D 디지털제품여권 (DPP)` - 10 edges
9. `솔루션 - 산업안전위험 교육` - 10 edges
10. `회사 개요 (브로큰에그)` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Egg One — 반응형 3D 제품 시각화` --semantically_similar_to--> `솔루션 - 3D 디지털제품여권 (DPP)`  [INFERRED] [semantically similar]
  brokenegg-doc/wiki/랜딩 페이지 카피.md → brokenegg-doc/wiki/솔루션 - 3D 디지털제품여권 (DPP).md
- `XR 산업안전 교육 (VR/AR/MR)` --semantically_similar_to--> `솔루션 - 산업안전위험 교육`  [INFERRED] [semantically similar]
  brokenegg-doc/wiki/랜딩 페이지 카피.md → brokenegg-doc/wiki/솔루션 - 산업안전위험 교육.md
- `Core-to-Edge 사업 구조` --rationale_for--> `핵심 기술 - 3D 인터랙션 시뮬레이션 엔진`  [INFERRED]
  brokenegg-doc/wiki/회사 개요.md → brokenegg-doc/wiki/핵심 기술 - 3D 인터랙션 시뮬레이션 엔진.md
- `인덱스 (MOC)` --references--> `핵심 기술 - 3D 인터랙션 시뮬레이션 엔진`  [EXTRACTED]
  brokenegg-doc/wiki/인덱스 (MOC).md → brokenegg-doc/wiki/핵심 기술 - 3D 웹뷰어 배포 아키텍처.md
- `인덱스 (MOC)` --references--> `디지털 생태계`  [EXTRACTED]
  brokenegg-doc/wiki/인덱스 (MOC).md → brokenegg-doc/wiki/핵심 기술 - 3D 웹뷰어 배포 아키텍처.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **3D 뷰어 비용/로딩 최적화 레버 (single-thread + R2 + wasm공유 + Brotli)** — wiki____________3d__________________________single_thread______, wiki____________3d__________________________cloudflare_r2, wiki____________3d__________________________wasm__________, wiki____________3d__________________________brotli____ [EXTRACTED 0.85]

## Communities (7 total, 1 thin omitted)

### Community 0 - "디자인 시스템 토큰·개요"
Cohesion: 0.11
Nodes (24): Badge 컴포넌트, Button 컴포넌트, 디자인 시스템 - 개요, /brokenegg-page 스킬, 에디토리얼 그리드 원칙, 프레임-인-캔버스 원칙, global.css (구현 단일 출처), 마이크로 타이포 라벨 원칙 (+16 more)

### Community 1 - "디자인 컴포넌트·레이아웃·카피"
Cohesion: 0.15
Nodes (23): 디자인 시스템 - 컴포넌트, FinalCta 위젯, 목적 기반 세그먼트 명명 규칙, Hero 위젯, Logo 컴포넌트, Problems 위젯, service-preview 인라인 프리뷰 피처, Services 위젯 (미디어 갤러리) (+15 more)

### Community 2 - "3D 엔진·XR·솔루션"
Cohesion: 0.16
Nodes (22): 3D 인터랙션 시뮬레이션 엔진, 서비스 소개서 (원본 슬라이드 변환), 서비스 기획서 (정리본), 핵심 기술 - 3D 인터랙션 시뮬레이션 엔진, 회사 개요 (브로큰에그), Core-to-Edge 사업 구조, 데이터의 시각화 (공급망 정보), 디지털 생태계 (+14 more)

### Community 3 - "3D 웹뷰어 배포 아키텍처"
Cohesion: 0.17
Nodes (16): 솔루션 - 3D 디지털제품여권 (DPP), 핵심 기술 - 3D 웹뷰어 배포 아키텍처, 핵심 기술 - 3D 인터랙션 시뮬레이션 엔진, brokenegg-app (Next.js 16, Vercel), Brotli 압축, Canvas 직접 마운트 임베드, Cloudflare R2, COOP/COEP cross-origin isolation (+8 more)

### Community 4 - "위키 운영·MOC"
Cohesion: 0.18
Nodes (14): LLM Wiki + Graphify 운영 방식, 메인 카피, 회사 개요, 디자인 시스템 - 개요, 디자인 시스템 - 컴포넌트, 디자인 시스템 - 디자인 토큰, 솔루션 - 산업안전위험 교육, 디자인 시스템 - 페이지 레이아웃 패턴 (+6 more)

## Knowledge Gaps
- **25 isolated node(s):** `brokenegg-doc CLAUDE.md (LLM Wiki 운영 가이드)`, `네이티브 XR 확장성`, `다각도 시점 제어 (Global View / Detail View)`, `물리 엔진 기반 능동적 사고 시뮬레이션`, `체화형 반복 훈련 (Muscle Memory)` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `인덱스 (MOC)` connect `위키 운영·MOC` to `3D 엔진·XR·솔루션`, `3D 웹뷰어 배포 아키텍처`?**
  _High betweenness centrality (0.186) - this node is a cross-community bridge._
- **Why does `핵심 기술 - 3D 웹뷰어 배포 아키텍처` connect `3D 웹뷰어 배포 아키텍처` to `위키 운영·MOC`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `디자인 시스템 - 컴포넌트` connect `디자인 컴포넌트·레이아웃·카피` to `디자인 시스템 토큰·개요`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **What connects `brokenegg-doc CLAUDE.md (LLM Wiki 운영 가이드)`, `네이티브 XR 확장성`, `다각도 시점 제어 (Global View / Detail View)` to the rest of the system?**
  _26 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `디자인 시스템 토큰·개요` be split into smaller, more focused modules?**
  _Cohesion score 0.11231884057971014 - nodes in this community are weakly interconnected._