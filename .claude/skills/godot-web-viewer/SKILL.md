---
name: godot-web-viewer
description: brokenegg-app(Next.js 16, Vercel)에서 Godot 4 웹 익스포트(HTML5/WASM) 3D 뷰어를 QR별 개별 라우트(/[locale]/viewer/[id])로 서빙하는 작업. 사용자가 `/godot-web-viewer`를 호출하거나 "godot/3d 뷰어 라우트 만들어줘, QR 3d 렌더 붙여줘, viewer.wasm/pck 임베드, 3d 뷰어 R2/CDN 호스팅"이라고 할 때 사용. 아키텍처 단일 출처는 brokenegg-doc/wiki "핵심 기술 - 3D 웹뷰어 배포 아키텍처". 일반 페이지(디자인/카피)는 /brokenegg-page, 일반 3D 콘텐츠 개념은 위키 "핵심 기술 - 3D 인터랙션" 담당.
---

# godot-web-viewer — Godot 3D 웹뷰어 QR 라우트 서빙

Godot 4 웹 익스포트(viewer.wasm/pck/js)를 brokenegg-app에 QR별 라우트로 붙이는 스킬.
**추측 금지** — 아키텍처 결정은 항상 단일 출처 위키 노트와 실제 export 파일을 먼저 읽는다.

> ✅ **이미 구현·검증 완료**(2026-06-24, `/ko/viewer/poim` 렌더 + Playwright). 정답은 위키 "✅ 검증된 구현" 섹션 + `godot-assets/README.md`. 새 사실이 나오면 위키·이 스킬·README 를 함께 갱신.

## 호출 형태
```
/godot-web-viewer <무엇을>
예) /godot-web-viewer DPP 제품 QR 뷰어 라우트 스캐폴딩
    /godot-web-viewer R2 업로드 + 헤더 설정
    /godot-web-viewer single-thread 재익스포트 검증
```
인자가 모호하면(어느 단계인지·export가 준비됐는지·R2 계정 여부) 먼저 1줄 확인.

## 0. 기준 읽기 (매번, 토큰 절약 순서)
1. **아키텍처 단일 출처**: `brokenegg-doc/wiki/핵심 기술 - 3D 웹뷰어 배포 아키텍처.md` → **"✅ 검증된 구현"** 섹션부터. (§1~§8 은 초기 가설, 정정 있음)
2. **운영 상세**: `apps/brokenegg-app/godot-assets/README.md` — 필수 파일·치환·교체 절차.
3. **실제 구현 코드**: `src/app/godot/[...path]/route.ts`, `src/widgets/godot-viewer/`, `src/app/[locale]/viewer/[id]/page.tsx`.
4. **새 export**: viewer.js 의 `GODOT_THREADS_ENABLED`(true/false)로 멀티스레드 여부 확인.
5. 디자인 셸이 필요하면 `/brokenegg-page` 기준.

## 1. 핵심 사실 (실측 — 위키 "검증된 구현" 요약)
- **필수 파일 5개**: `viewer.js` · `viewer.wasm(.br)` · `viewer.pck(.br)` · **`viewer_function.js`** · **`poim_scene.zip`**. 뒤 둘 빠지면 엔진 떠도 씬 안 뜸.
- **QR별로 다른 건 `poim_scene.zip`(모델 데이터)** — wasm/pck/js 는 공유. (※ "pck 교체" 아님)
- **임베드 = canvas auto-start**: viewer.js 가 `#canvas`/`#status` DOM 찾아 자동 부팅. canvas override·`--main-pack` 안 씀.
- **핸들러가 viewer.js/viewer_function.js 를 치환**해 서빙: `executable`→절대경로, 엔진→`window.__godotEngine` 노출, `initSetting.url`→전체 URL(scheme+host).
- **brotli 는 `Content-Length` 없이 chunked(ReadableStream)** 로만 동작(아니면 "Failed loading file"). wasm 37.7→7.5MB, pck 3.4→1.1MB. zip 은 무압축.
- **이 export 는 single-thread** → COOP/COEP 불필요(헤더 제거됨). 멀티스레드 export면 헤더 필요(§아래).
- **teardown**: 언마운트 시 `requestQuit()`+`loseContext()`+스크립트 제거(한 탭 다중 전환 대비).

## 2. 작업 분기

### A. 새 모델(QR) 추가 — 가장 흔함
1. `godot-assets/<id>/` 에 export 5개 복사 → `node godot-assets/compress.mjs <id>` (`.br` 생성). 원본 wasm/pck 는 그 뒤 삭제 가능(.br 폴백).
2. `src/app/[locale]/viewer/[id]/page.tsx` 의 `ASSET_FOLDERS` 에 `<id>: '<id>'` 추가.
3. 데이터 파일명이 `poim_scene` 이 아니면 `viewer_function.js` 의 `file:` 확인.
4. dev 새로고침 → `/ko/viewer/<id>`.

### B. 새 export 가 멀티스레드일 때 (`GODOT_THREADS_ENABLED=true`)
- 권장: **Godot에서 Thread Support 끄고 재익스포트**(single-thread) → 헤더 불필요.
- 유지 시: `next.config.js` `headers()` 에 **뷰어 경로만** `COOP: same-origin`+`COEP: require-corp` 추가. 전체 사이트 금지. (README "단일스레드 원복" 의 역순)

### C. 핸들러/위젯 수정
- 서버 로직: `route.ts` (br chunked, 치환, 폴백, Content-Type). 새 파일 확장자는 `CONTENT_TYPES` 에 추가.
- 임베드: `src/widgets/godot-viewer/` (DOM·스크립트 주입·teardown).

### D. R2 프로덕션 이전 (아직 미적용)
- 엔진(공유) + 모델 zip(QR별) 분리 저장. `initSetting.url`→R2 전체 URL. **CORS 필수**.
- br 은 **Worker/핸들러가 chunked 로**(정적 .br 직접 서빙은 Content-Length 오버플로 재발).
- egress 무료가 핵심(QR별 33MB zip 다수 서빙해도 비용 0).

## 3. 검증 (필수)
- `cd apps/brokenegg-app && npx tsc --noEmit -p tsconfig.json`
- **Playwright e2e**: `pnpm --filter @brokenegg/brokenegg-app test:e2e` (dev 서버 :3000 필요) — 렌더·WebGL2·씬 로드 단언.
- 헤드리스로 직접 확인 가능: dev 서버 띄우고 `e2e/viewer.spec.ts` 실행, 스크린샷 `e2e/*.png`.
- 빌드에 40MB 에셋이 안 들어갔는지(`godot-assets/` gitignore) 확인.

## 4. 마무리 — 위키 동기화 (지속 업데이트)
- 새로 검증/확정된 사실 → `핵심 기술 - 3D 웹뷰어 배포 아키텍처.md`의 해당 섹션·§8 체크박스 갱신, `updated` 날짜 수정.
- 결정이 바뀌면 이 SKILL.md의 §1·§2도 함께 수정(둘이 어긋나지 않게).
- 그래프 재인덱싱은 **선택**. 정식 지식 지도는 **repo 루트의 `graphify-out/`**(프로젝트 모드 컨벤션)이며, 갱신은 **반드시 repo 루트에서** `/graphify ./brokenegg-doc --update`(루트 CLAUDE.md "운영" 참조 — doc 시맨틱 추출이라 API 키 필요).
  - ⚠️ 키 없는 `graphify update ./brokenegg-doc`는 `brokenegg-doc/graphify-out`에 **별도 stray를 만들 뿐 정식 루트 그래프를 갱신하지 않는다** → 쓰지 말 것.
  - 안 돌려도 됨: 위키 노트는 MOC·위키링크로 탐색 가능(루트 CLAUDE.md "그래프가 아직 없을 때" 폴백).

## 하지 말 것 (실측 함정)
- **사전압축 `.br` 을 `Content-Length` 와 함께 서빙** → Godot 로더 버퍼 오버플로("Failed loading file"). 반드시 chunked(Content-Length 생략).
- **`poim_scene.zip` 삭제** — 이건 모델 데이터 본체(대체본 없음). wasm/pck 원본은 .br 있으면 삭제 OK, zip 은 ❌.
- **`viewer_function.js` 누락** → prograssbar/downloadFileLength 미정의 + zip url 빈값 → 씬 안 뜸.
- 40MB 에셋을 `public/`·빌드 번들·메인 청크에 포함.
- iframe + `credentialless` 의존(Chromium 전용 → 모바일 QR 깨짐).
- COOP/COEP 를 사이트 전체에 적용. (애초에 single-thread 면 불필요)
- 디자인 셸이 필요한 페이지를 `/brokenegg-page` 기준 무시하고 임의 스타일로 작성.
