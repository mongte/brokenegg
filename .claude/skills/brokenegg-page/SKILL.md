---
name: brokenegg-page
description: 브로큰에그 홈페이지(apps/brokenegg-app)의 확립된 디자인 시스템과 FSD 구조를 기준으로 새 페이지(상세/하위/카테고리 페이지)를 만든다. 사용자가 `/brokenegg-page`를 호출하거나 "브로큰에그 (상세)페이지 만들어줘 / 이 디자인 기준으로 ~ 페이지 추가해줘"라고 할 때 사용. 디자인 토큰·컴포넌트·레이아웃 규칙은 brokenegg-doc/wiki의 "디자인 시스템 -" 노트가 단일 출처.
---

# brokenegg-page — 디자인 시스템 기준 신규 페이지 작성

브로큰에그 랜딩의 디자인 언어(흑백 모노크롬 · 프레임-인-캔버스 · 에디토리얼 그리드)와 FSD 구조를 **그대로 유지**하며 새 페이지를 만드는 스킬. 추측으로 새 스타일을 만들지 말고, 항상 기준 문서와 기존 코드를 먼저 읽는다.

## 호출 형태
```
/brokenegg-page <라우트/이름> <무엇을 담는 페이지인지>
예) /brokenegg-page solutions/dpp DPP 솔루션 상세 페이지
    /brokenegg-page about 회사 소개 페이지
```
인자가 모호하면(라우트·목적·필요한 섹션) 먼저 사용자에게 짧게 확인한다.

## 절차

### 0. 기준 읽기 (토큰 절약 순서 — 매번 전체 grep 금지)
1. **디자인 기준** (단일 출처):
   - `brokenegg-doc/wiki/디자인 시스템 - 개요.md`
   - `brokenegg-doc/wiki/디자인 시스템 - 디자인 토큰.md`
   - `brokenegg-doc/wiki/디자인 시스템 - 컴포넌트.md`
   - `brokenegg-doc/wiki/디자인 시스템 - 페이지 레이아웃 패턴.md` ← 골격·체크리스트의 핵심
2. **정확한 값**: `apps/brokenegg-app/src/app/global.css` (토큰·클래스 실측).
3. **콘텐츠**: 그래프 우선 — `graphify-out/GRAPH_REPORT.md` → 필요한 `wiki/` 카피/솔루션 노트만. (루트·doc CLAUDE.md 규칙 준수)
4. **기존 구현 참고**: `src/views/home`, `src/widgets/*`, `src/shared/ui/*`로 패턴 확인.

### 1. 페이지 설계
- 페이지 목적에 맞게 [[디자인 시스템 - 페이지 레이아웃 패턴]]의 "섹션 빌딩블록"에서 조합을 고른다.
- 필수 셸: `grid-bg` + `.canvas` + `SiteHeader` + (본문) + (권장)`FinalCta` + `SiteFooter`.
- 페이지는 **hero(세리프 section-tag + 큰 헤드라인)**로 시작. 어두운 미디어 면은 페이지당 1회.
- 어떤 섹션을 쓸지 사용자에게 1줄로 제안하고 진행.

### 2. FSD 배치 (반드시 준수)
| 만들 것 | 위치 |
|---|---|
| Next 라우트 | `src/app/<route>/page.tsx` — view만 렌더하도록 얇게 |
| 화면 조립 | `src/views/<name>/ui/<Name>Page.tsx` + `src/views/<name>/index.ts` |
| 페이지 전용 블록 | 해당 view 내부 (여러 페이지 재사용 시 `src/widgets/`로 승격) |
| 새 도메인 명사 | `src/entities/<name>` (model/ui + index.ts) |
| 공용 프리미티브 | `src/shared/ui/<name>` (컴포넌트별 index.ts) |
- import 방향은 아래로만: `app → views → widgets → features → entities → shared`.
- 모든 슬라이스에 `index.ts` public API(named export). 깊은 내부경로 import 금지, `export *` 금지.
- 세그먼트 이름은 목적 기반(`ui/model/api/lib/config`) — `components/hooks/types` 금지.
- `SiteHeader`/`SiteFooter`는 새로 만들지 말고 `@/widgets/site-header`·`@/widgets/site-footer` 재사용.

### 3. 스타일 규칙
- **기존 `global.css` 클래스를 최대한 재사용**(.canvas/.hero/.section-tag/.section-header/.problem-grid/.btn/.badge ...).
- 부족하면 `global.css`에 클래스를 추가하되 **반드시 토큰 사용**: `var(--text-main/-muted/--border/--accent-bg/--radius-* /--font-*)`. 하드코딩 색/픽셀 반경 금지.
- 모노크롬 유지(액센트 컬러 도입 금지). 강조는 굵기·크기·세리프·여백.
- 마이크로 라벨은 대문자·700·letter-spacing. 섹션 좌우 패딩 40px, 경계 `border-top:1px solid var(--border)`.
- 반응형: 1024px에서 다열 그리드가 1열로 붕괴하도록(기존 미디어쿼리 패턴 따름).

### 4. 콘텐츠
- 카피는 `wiki/`(랜딩 페이지 카피·메인 카피·해당 솔루션 노트)에서 가져온다.
- 위키에 없는 사실은 **추측 금지** → placeholder로 두고 사용자에게 확인하거나, 새 카피가 필요하면 `brokenegg-doc/wiki/`에 `status: review` 노트로 추가하고 MOC에 링크.
- 라우트/뷰에 `metadata`(title/description) 설정. 공통값은 `src/shared/config/site.ts`.

### 5. 검증 (필수)
- `cd apps/brokenegg-app && npx tsc --noEmit -p tsconfig.json`
- `npx nx build @brokenegg/brokenegg-app`
- 둘 다 통과해야 완료. 새 라우트가 빌드 라우트 목록에 잡히는지 확인.

### 6. 마무리
- [[디자인 시스템 - 페이지 레이아웃 패턴]]의 "완료 체크리스트" 항목을 점검해 보고.
- 디자인 시스템 자체를 바꾼 경우(새 토큰/공통 컴포넌트)에만 해당 위키 노트와 MOC를 갱신.

## 하지 말 것
- 랜딩과 다른 톤/컬러/그림자 카드 UI 도입.
- 셸(canvas/header/footer) 없이 맨몸 페이지 작성.
- 디자인 값 하드코딩, FSD import 규칙 위반, public API 우회.
- 위키에 없는 수치·사례를 사실처럼 작성.
