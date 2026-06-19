# Graph Report - .  (2026-06-19)

## Corpus Check
- 6 files · ~6,217 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 73 nodes · 128 edges · 12 communities (11 shown, 1 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.84)
- Token cost: 42,000 input · 4,579 output

## Community Hubs (Navigation)
- [[_COMMUNITY_디자인 시스템 기준 & 페이지 작성|디자인 시스템 기준 & 페이지 작성]]
- [[_COMMUNITY_디자인 토큰|디자인 토큰]]
- [[_COMMUNITY_컴포넌트·위젯 카탈로그 (FSD)|컴포넌트·위젯 카탈로그 (FSD)]]
- [[_COMMUNITY_3D 엔진 & 서비스 라인업|3D 엔진 & 서비스 라인업]]
- [[_COMMUNITY_페이지 셸 & 공통 위젯|페이지 셸 & 공통 위젯]]
- [[_COMMUNITY_회사·사업 구조|회사·사업 구조]]
- [[_COMMUNITY_버튼·배지 프리미티브|버튼·배지 프리미티브]]
- [[_COMMUNITY_DPP 솔루션|DPP 솔루션]]
- [[_COMMUNITY_산업안전 교육 솔루션|산업안전 교육 솔루션]]
- [[_COMMUNITY_위키 운영 (LLM Wiki+Graphify)|위키 운영 (LLM Wiki+Graphify)]]
- [[_COMMUNITY_위키 운영 가이드|위키 운영 가이드]]

## God Nodes (most connected - your core abstractions)
1. `디자인 시스템 - 컴포넌트` - 17 edges
2. `디자인 시스템 - 개요` - 15 edges
3. `디자인 시스템 - 디자인 토큰` - 13 edges
4. `디자인 시스템 - 페이지 레이아웃 패턴` - 13 edges
5. `핵심 기술 - 3D 인터랙션 시뮬레이션 엔진` - 11 edges
6. `솔루션 - 3D 디지털제품여권 (DPP)` - 10 edges
7. `솔루션 - 산업안전위험 교육` - 10 edges
8. `인덱스 (MOC)` - 10 edges
9. `회사 개요 (브로큰에그)` - 7 edges
10. `랜딩 페이지 카피` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Egg One — 반응형 3D 제품 시각화` --semantically_similar_to--> `솔루션 - 3D 디지털제품여권 (DPP)`  [INFERRED] [semantically similar]
  brokenegg-doc/wiki/랜딩 페이지 카피.md → brokenegg-doc/wiki/솔루션 - 3D 디지털제품여권 (DPP).md
- `XR 산업안전 교육 (VR/AR/MR)` --semantically_similar_to--> `솔루션 - 산업안전위험 교육`  [INFERRED] [semantically similar]
  brokenegg-doc/wiki/랜딩 페이지 카피.md → brokenegg-doc/wiki/솔루션 - 산업안전위험 교육.md
- `Core-to-Edge 사업 구조` --rationale_for--> `핵심 기술 - 3D 인터랙션 시뮬레이션 엔진`  [INFERRED]
  brokenegg-doc/wiki/회사 개요.md → brokenegg-doc/wiki/핵심 기술 - 3D 인터랙션 시뮬레이션 엔진.md
- `랜딩 페이지 카피` --references--> `핵심 기술 - 3D 인터랙션 시뮬레이션 엔진`  [INFERRED]
  brokenegg-doc/wiki/랜딩 페이지 카피.md → brokenegg-doc/wiki/핵심 기술 - 3D 인터랙션 시뮬레이션 엔진.md
- `메인 카피` --references--> `핵심 기술 - 3D 인터랙션 시뮬레이션 엔진`  [INFERRED]
  brokenegg-doc/wiki/메인 카피.md → brokenegg-doc/wiki/핵심 기술 - 3D 인터랙션 시뮬레이션 엔진.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **디자인 시스템 4부작 노트 (개요·토큰·컴포넌트·레이아웃)** — wiki_design_system_overview, wiki_design_system_tokens, wiki_design_system_components, wiki_design_system_layout_patterns [EXTRACTED 0.90]
- **페이지 셸 구성 (grid-bg + canvas + SiteHeader/Footer)** — wiki_design_system_tokens_grid_bg, wiki_design_system_tokens_canvas, wiki_design_system_components_site_header, wiki_design_system_components_site_footer [EXTRACTED 0.90]
- **섹션 빌딩블록 조합 (Hero/Problems/Services/Testimonials/FinalCta)** — wiki_design_system_components_hero, wiki_design_system_components_problems, wiki_design_system_components_services, wiki_design_system_components_testimonials, wiki_design_system_components_final_cta [EXTRACTED 0.85]

## Communities (12 total, 1 thin omitted)

### Community 0 - "디자인 시스템 기준 & 페이지 작성"
Cohesion: 0.24
Nodes (13): 디자인 시스템 - 페이지 레이아웃 패턴, FSD import 방향 규칙, 리듬 규칙 (밝음→검정 갤러리→밝음), 디자인 시스템 - 개요, /brokenegg-page 스킬, 모노크롬 우선 원칙, 한 번의 대비 면 원칙, Variant 레퍼런스 디자인 (BRK-EGG-2024-V1) (+5 more)

### Community 1 - "디자인 토큰"
Cohesion: 0.18
Nodes (12): 에디토리얼 그리드 원칙, global.css (구현 단일 출처), 두 서체의 역할 분담 원칙, 디자인 시스템 - 디자인 토큰, 반응형 브레이크포인트 (1024px), 색 토큰 (Color), 모션 (Motion), Noto Serif KR (세리프) (+4 more)

### Community 2 - "컴포넌트·위젯 카탈로그 (FSD)"
Cohesion: 0.31
Nodes (10): 디자인 시스템 - 컴포넌트, 목적 기반 세그먼트 명명 규칙, Hero 위젯, Logo 컴포넌트, Problems 위젯, service-preview 인라인 프리뷰 피처, Services 위젯 (미디어 갤러리), Testimonials 위젯 (+2 more)

### Community 3 - "3D 엔진 & 서비스 라인업"
Cohesion: 0.33
Nodes (7): 3D 인터랙션 시뮬레이션 엔진, 서비스 소개서 (원본 슬라이드 변환), 서비스 기획서 (정리본), Egg One — 반응형 3D 제품 시각화, Egg Two — 3D 반응형 미디어, 랜딩 페이지 카피, XR 산업안전 교육 (VR/AR/MR)

### Community 4 - "페이지 셸 & 공통 위젯"
Cohesion: 0.33
Nodes (7): FinalCta 위젯, SiteFooter 위젯, SiteHeader 위젯, 페이지 골격 (셸), 프레임-인-캔버스 원칙, canvas (캔버스 카드), grid-bg (격자 배경)

### Community 5 - "회사·사업 구조"
Cohesion: 0.47
Nodes (6): 핵심 기술 - 3D 인터랙션 시뮬레이션 엔진, 회사 개요 (브로큰에그), Core-to-Edge 사업 구조, 디지털 생태계, 네이티브 XR 확장성, 다각도 시점 제어 (Global View / Detail View)

### Community 6 - "버튼·배지 프리미티브"
Cohesion: 0.40
Nodes (5): Badge 컴포넌트, Button 컴포넌트, 마이크로 타이포 라벨 원칙, 알약 형태 원칙, 반경 토큰 (Radius)

### Community 7 - "DPP 솔루션"
Cohesion: 0.50
Nodes (4): 데이터의 시각화 (공급망 정보), 솔루션 - 3D 디지털제품여권 (DPP), ESG 규제 준수 / 제품여권 규제, 실시간 데이터 연동

### Community 8 - "산업안전 교육 솔루션"
Cohesion: 0.50
Nodes (4): 체화형 반복 훈련 (Muscle Memory), 물리 엔진 기반 능동적 사고 시뮬레이션, 솔루션 - 산업안전위험 교육, 주요 훈련 시나리오 (지게차/협착/추락)

### Community 9 - "위키 운영 (LLM Wiki+Graphify)"
Cohesion: 0.67
Nodes (3): LLM Wiki + Graphify 운영 방식, 인덱스 (MOC), 메인 카피

## Knowledge Gaps
- **17 isolated node(s):** `brokenegg-doc CLAUDE.md (LLM Wiki 운영 가이드)`, `네이티브 XR 확장성`, `다각도 시점 제어 (Global View / Detail View)`, `물리 엔진 기반 능동적 사고 시뮬레이션`, `체화형 반복 훈련 (Muscle Memory)` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `디자인 시스템 - 컴포넌트` connect `컴포넌트·위젯 카탈로그 (FSD)` to `디자인 시스템 기준 & 페이지 작성`, `디자인 토큰`, `페이지 셸 & 공통 위젯`, `버튼·배지 프리미티브`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Why does `디자인 시스템 - 개요` connect `디자인 시스템 기준 & 페이지 작성` to `디자인 토큰`, `컴포넌트·위젯 카탈로그 (FSD)`, `페이지 셸 & 공통 위젯`, `버튼·배지 프리미티브`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `디자인 시스템 - 디자인 토큰` connect `디자인 토큰` to `디자인 시스템 기준 & 페이지 작성`, `컴포넌트·위젯 카탈로그 (FSD)`, `페이지 셸 & 공통 위젯`, `버튼·배지 프리미티브`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `핵심 기술 - 3D 인터랙션 시뮬레이션 엔진` (e.g. with `3D 인터랙션 시뮬레이션 엔진` and `Core-to-Edge 사업 구조`) actually correct?**
  _`핵심 기술 - 3D 인터랙션 시뮬레이션 엔진` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `brokenegg-doc CLAUDE.md (LLM Wiki 운영 가이드)`, `네이티브 XR 확장성`, `다각도 시점 제어 (Global View / Detail View)` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._