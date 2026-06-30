# Godot 웹뷰어 에셋 엣지 서버 (Cloudflare Worker × R2)

QR 스캔 폰이 **이 Worker 에서 직접** Godot 에셋(wasm/pck/zip)을 받는다 → R2 egress($0) 유지.
로컬 라우트 핸들러(`apps/brokenegg-app/src/app/godot/[...path]/route.ts`)를 그대로 포팅한 것:
`.br` 을 **Content-Length 없이 chunked** 로 보내고(Godot 로더 호환), viewer.js/viewer_function.js 의
경로·URL 을 치환하며, cross-origin CORS 를 붙인다.

> 아키텍처 단일 출처: `brokenegg-doc/wiki/핵심 기술 - 3D 웹뷰어 배포 아키텍처.md` (프로덕션 R2 섹션).

```
workers/godot-viewer/
├── src/index.js      # Worker 본체 (route.ts 의 R2 버전)
├── wrangler.toml     # 버킷 바인딩(BUCKET → brokenegg-godot)
└── package.json      # wrangler devDep + deploy 스크립트
```

키 규약: `r2://brokenegg-godot/<id>/<file>` → `https://<worker-host>/<id>/<file>`.

---

## 최초 1회 배포 (자격증명 필요 — 사용자가 실행)

세션에서 `! <명령>` 으로 바로 실행하면 출력이 대화에 들어옵니다.

```bash
# 0) Worker 디렉터리에서 의존성 설치
cd workers/godot-viewer && npm install

# 1) Cloudflare 로그인 (브라우저 OAuth 창이 뜸)
npx wrangler login

# 2) R2 버킷 생성 (이름은 wrangler.toml 의 bucket_name 과 일치)
npx wrangler r2 bucket create brokenegg-godot

# 3) Worker 배포 → 출력되는 https://brokenegg-godot-viewer.<subdomain>.workers.dev 를 복사
npx wrangler deploy
```

## 에셋 업로드 (모델 추가/교체마다)

```bash
# brokenegg-app 디렉터리에서. (먼저 godot-assets/<id>/ 에 export + compress.mjs 로 .br 생성)
cd apps/brokenegg-app
node godot-assets/compress.mjs poim      # viewer.wasm/.pck → .br (이미 있으면 생략 가능)
node godot-assets/upload-r2.mjs poim     # 서빙 5종을 R2 에 업로드
```

## Next.js 연결

배포 3)에서 받은 Worker URL 을 brokenegg-app 환경변수에 넣는다:

```bash
# 로컬
echo 'NEXT_PUBLIC_GODOT_CDN_BASE=https://brokenegg-godot-viewer.<subdomain>.workers.dev' >> apps/brokenegg-app/.env.local

# Vercel (프로덕션)
cd apps/brokenegg-app && npx vercel env add NEXT_PUBLIC_GODOT_CDN_BASE production
```

설정하면 `/[locale]/viewer/[id]` 가 같은 오리진 `/godot` 핸들러 대신 이 Worker 에서 에셋을 받는다.
미설정이면 로컬 핸들러로 폴백하므로 **로컬 개발은 그대로** 동작한다.

## 검증

```bash
WORKER=https://brokenegg-godot-viewer.<subdomain>.workers.dev
# 1) br 이 chunked(Content-Length 없음)로 오는지 — transfer-encoding: chunked, content-encoding: br
curl -sI -H "Accept-Encoding: br" "$WORKER/poim/viewer.wasm" | grep -iE "content-encoding|content-length|transfer-encoding|access-control"
# 2) viewer.js 가 executable 을 절대 URL 로 치환했는지
curl -s "$WORKER/poim/viewer.js" | grep -o '"executable":"[^"]*"'
# 3) viewer_function.js 의 url 이 전체 URL 인지
curl -s "$WORKER/poim/viewer_function.js" | grep -o 'url:\s*"[^"]*"'
# 4) 실제 렌더: 브라우저로 https://<vercel-app>/ko/viewer/poim
```

`content-length` 가 **없어야** 정상(있으면 Godot 로더 오버플로). `content-encoding: br` + `transfer-encoding: chunked` 조합이 맞다.

## 주의

- **⚠️ `encodeBody: 'manual'` (가장 중요)**: 사전압축 `.br` 응답은 반드시 `new Response(body, { encodeBody: 'manual' })` 로 보낸다.
  안 그러면 Cloudflare/workerd 가 `Accept-Encoding: br` 을 보고 이미 br 인 본문을 **한 번 더** 압축 → `br(br(...))` 이중 인코딩
  → 브라우저가 1회만 풀어 Godot 에 still-br 전달 → "Failed loading file". `wrangler dev` 로 재현·수정 검증함.
  (검증: 받은 바이트가 원본 `.br` 과 정확히 일치, 1회 디코드 시 37.7MB 유효 wasm.)
- **br 전용 서빙**: wasm/pck 는 `.br` 만 올린다(Worker 는 br 미수락 클라이언트용 무압축 폴백을 안 가짐).
  모든 모던 브라우저가 `Accept-Encoding: br` 를 보내므로 QR(모바일) 환경에서 안전.
- viewer.js/viewer_function.js 는 호스트별 치환본이라 `Cache-Control: no-store`. wasm/pck/zip 은 immutable 1년 캐시.
- 커스텀 도메인(godot.brokenegg.app)을 쓰려면 `wrangler.toml` 의 `routes` 주석을 풀고 zone 설정 후 재배포.
