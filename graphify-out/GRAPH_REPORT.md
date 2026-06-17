# Graph Report - .  (2026-06-16)

## Corpus Check
- 11 files · ~4,541 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 26 nodes · 46 edges · 7 communities (6 shown, 1 thin omitted)
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 42,000 input · 4,479 output

## Community Hubs (Navigation)
- [[_COMMUNITY_콘텐츠 & 서비스 라인업|콘텐츠 & 서비스 라인업]]
- [[_COMMUNITY_핵심 기술 & 사업 구조|핵심 기술 & 사업 구조]]
- [[_COMMUNITY_3D 디지털제품여권 (DPP)|3D 디지털제품여권 (DPP)]]
- [[_COMMUNITY_산업안전 훈련 솔루션|산업안전 훈련 솔루션]]
- [[_COMMUNITY_위키 운영 & 인덱스|위키 운영 & 인덱스]]
- [[_COMMUNITY_운영 가이드|운영 가이드]]

## God Nodes (most connected - your core abstractions)
1. `핵심 기술 - 3D 인터랙션 시뮬레이션 엔진` - 11 edges
2. `솔루션 - 3D 디지털제품여권 (DPP)` - 10 edges
3. `솔루션 - 산업안전위험 교육` - 10 edges
4. `인덱스 (MOC)` - 10 edges
5. `회사 개요 (브로큰에그)` - 7 edges
6. `랜딩 페이지 카피` - 7 edges
7. `디지털 생태계` - 5 edges
8. `서비스 소개서 (원본 슬라이드 변환)` - 5 edges
9. `메인 카피` - 4 edges
10. `서비스 기획서 (정리본)` - 4 edges

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
- **단일 코어 엔진 → 두 솔루션 확장 (Core-to-Edge)** — wiki____________3d_____________________engine, wiki____________dpp, wiki____________safety_education [EXTRACTED 1.00]
- **디지털 생태계: 제품 완벽성 + 공정 안전성 통합** — wiki____________digital_ecosystem, wiki____________dpp, wiki____________safety_education, wiki____________3d_____________________engine [EXTRACTED 1.00]
- **랜딩 3종 서비스 (Egg One / Egg Two / XR)** — wiki____________egg_one, wiki____________egg_two, wiki____________xr_safety_training [EXTRACTED 1.00]

## Communities (7 total, 1 thin omitted)

### Community 0 - "콘텐츠 & 서비스 라인업"
Cohesion: 0.33
Nodes (7): 3D 인터랙션 시뮬레이션 엔진, 서비스 소개서 (원본 슬라이드 변환), 서비스 기획서 (정리본), Egg One — 반응형 3D 제품 시각화, Egg Two — 3D 반응형 미디어, 랜딩 페이지 카피, XR 산업안전 교육 (VR/AR/MR)

### Community 1 - "핵심 기술 & 사업 구조"
Cohesion: 0.47
Nodes (6): 핵심 기술 - 3D 인터랙션 시뮬레이션 엔진, 회사 개요 (브로큰에그), Core-to-Edge 사업 구조, 디지털 생태계, 네이티브 XR 확장성, 다각도 시점 제어 (Global View / Detail View)

### Community 2 - "3D 디지털제품여권 (DPP)"
Cohesion: 0.50
Nodes (4): 데이터의 시각화 (공급망 정보), 솔루션 - 3D 디지털제품여권 (DPP), ESG 규제 준수 / 제품여권 규제, 실시간 데이터 연동

### Community 3 - "산업안전 훈련 솔루션"
Cohesion: 0.50
Nodes (4): 체화형 반복 훈련 (Muscle Memory), 물리 엔진 기반 능동적 사고 시뮬레이션, 솔루션 - 산업안전위험 교육, 주요 훈련 시나리오 (지게차/협착/추락)

### Community 4 - "위키 운영 & 인덱스"
Cohesion: 0.67
Nodes (3): LLM Wiki + Graphify 운영 방식, 인덱스 (MOC), 메인 카피

## Knowledge Gaps
- **11 isolated node(s):** `brokenegg-doc CLAUDE.md (LLM Wiki 운영 가이드)`, `네이티브 XR 확장성`, `다각도 시점 제어 (Global View / Detail View)`, `물리 엔진 기반 능동적 사고 시뮬레이션`, `체화형 반복 훈련 (Muscle Memory)` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `솔루션 - 3D 디지털제품여권 (DPP)` connect `3D 디지털제품여권 (DPP)` to `콘텐츠 & 서비스 라인업`, `핵심 기술 & 사업 구조`, `위키 운영 & 인덱스`?**
  _High betweenness centrality (0.249) - this node is a cross-community bridge._
- **Why does `솔루션 - 산업안전위험 교육` connect `산업안전 훈련 솔루션` to `콘텐츠 & 서비스 라인업`, `핵심 기술 & 사업 구조`, `위키 운영 & 인덱스`?**
  _High betweenness centrality (0.249) - this node is a cross-community bridge._
- **Why does `핵심 기술 - 3D 인터랙션 시뮬레이션 엔진` connect `핵심 기술 & 사업 구조` to `콘텐츠 & 서비스 라인업`, `3D 디지털제품여권 (DPP)`, `산업안전 훈련 솔루션`, `위키 운영 & 인덱스`?**
  _High betweenness centrality (0.248) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `핵심 기술 - 3D 인터랙션 시뮬레이션 엔진` (e.g. with `3D 인터랙션 시뮬레이션 엔진` and `Core-to-Edge 사업 구조`) actually correct?**
  _`핵심 기술 - 3D 인터랙션 시뮬레이션 엔진` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `솔루션 - 3D 디지털제품여권 (DPP)` (e.g. with `서비스 소개서 (원본 슬라이드 변환)` and `Egg One — 반응형 3D 제품 시각화`) actually correct?**
  _`솔루션 - 3D 디지털제품여권 (DPP)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `솔루션 - 산업안전위험 교육` (e.g. with `서비스 소개서 (원본 슬라이드 변환)` and `XR 산업안전 교육 (VR/AR/MR)`) actually correct?**
  _`솔루션 - 산업안전위험 교육` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `brokenegg-doc CLAUDE.md (LLM Wiki 운영 가이드)`, `네이티브 XR 확장성`, `다각도 시점 제어 (Global View / Detail View)` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._