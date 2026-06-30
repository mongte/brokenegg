#!/usr/bin/env bash
# 인증(아래 0단계) 후 이거 하나만 실행하면 끝: 버킷 생성 → 배포 → 에셋 업로드 → env 연결 → 클라우드 검증.
#
# 0) 먼저 둘 중 하나로 인증:
#    A) 대화형:   npx wrangler login
#    B) 비대화형: export CLOUDFLARE_API_TOKEN=...   (+ 필요시 export CLOUDFLARE_ACCOUNT_ID=...)
# 1) cd workers/godot-viewer && ./deploy.sh [id]      (id 기본 poim)
set -euo pipefail

ID="${1:-poim}"
BUCKET="${R2_BUCKET:-brokenegg-godot}"
HERE="$(cd "$(dirname "$0")" && pwd)"
APP="$(cd "$HERE/../../apps/brokenegg-app" && pwd)"
WR="npx wrangler"

echo "▶ 인증 확인"
if ! $WR whoami >/dev/null 2>&1; then
  echo "  ✗ 미인증. 먼저: npx wrangler login  (또는 export CLOUDFLARE_API_TOKEN=...)" >&2
  exit 1
fi
$WR whoami 2>/dev/null | grep -iE "account|email" | head -2 || true

echo "▶ R2 버킷 생성 ($BUCKET) — 이미 있으면 무시"
$WR r2 bucket create "$BUCKET" 2>&1 | tail -1 || true

echo "▶ Worker 배포"
DEPLOY_OUT="$($WR deploy 2>&1)"
echo "$DEPLOY_OUT"
URL="$(printf '%s\n' "$DEPLOY_OUT" | grep -oE 'https://[a-zA-Z0-9.-]+\.workers\.dev' | head -1)"
if [ -z "$URL" ]; then
  echo "  ✗ 배포 URL 파싱 실패. 위 출력에서 https://...workers.dev 를 확인하세요." >&2
  exit 1
fi
echo "  ✓ Worker URL: $URL"

echo "▶ 클라우드 R2 에 에셋 업로드 ($ID)"
( cd "$APP" && R2_BUCKET="$BUCKET" node godot-assets/upload-r2.mjs "$ID" )

echo "▶ Next.js env 연결 ($APP/.env.local)"
ENVF="$APP/.env.local"
touch "$ENVF"
# 기존 줄 제거 후 갱신
grep -v '^NEXT_PUBLIC_GODOT_CDN_BASE=' "$ENVF" > "$ENVF.tmp" 2>/dev/null || true
mv "$ENVF.tmp" "$ENVF" 2>/dev/null || true
echo "NEXT_PUBLIC_GODOT_CDN_BASE=$URL" >> "$ENVF"
echo "  ✓ NEXT_PUBLIC_GODOT_CDN_BASE=$URL"

echo "▶ 클라우드 검증 (chunked br + 치환 + CORS)"
fail=0
H="$(curl -sI -H 'Accept-Encoding: br' "$URL/$ID/viewer.wasm")"
echo "$H" | grep -qi 'content-encoding: *br'        && echo "  ✓ content-encoding: br" || { echo "  ✗ br 없음"; fail=1; }
echo "$H" | grep -qi 'content-length'               && { echo "  ✗ Content-Length 존재(오버플로 위험)"; fail=1; } || echo "  ✓ Content-Length 없음(chunked)"
echo "$H" | grep -qi 'access-control-allow-origin'  && echo "  ✓ CORS" || { echo "  ✗ CORS 없음"; fail=1; }
curl -s "$URL/$ID/viewer.js" | grep -q "\"executable\":\"$URL/$ID/viewer\"" && echo "  ✓ executable 치환" || { echo "  ✗ executable 치환 실패"; fail=1; }
curl -s "$URL/$ID/viewer_function.js" | grep -q "url: \"$URL/$ID/\"" && echo "  ✓ url 치환" || { echo "  ✗ url 치환 실패"; fail=1; }

echo
if [ "$fail" = 0 ]; then
  echo "✅ 완료. https://<vercel-app>/ko/viewer/$ID (또는 로컬: .env.local 반영 후 dev 재시작) 에서 Worker 경유 렌더."
  echo "   Vercel 프로덕션엔: cd $APP && npx vercel env add NEXT_PUBLIC_GODOT_CDN_BASE production  ($URL)"
else
  echo "⚠ 일부 검증 실패 — 위 ✗ 항목 확인. (encodeBody:'manual' 누락 시 br 이중인코딩 의심)"
  exit 1
fi
