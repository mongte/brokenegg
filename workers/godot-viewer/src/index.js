/**
 * Godot 웹뷰어 에셋 엣지 서버 (Cloudflare Worker × R2) — 프로덕션.
 *
 * brokenegg-app 의 로컬 라우트 핸들러(`src/app/godot/[...path]/route.ts`)를 그대로 포팅한 것.
 * 클라이언트(QR 스캔 폰)가 이 Worker 에서 **직접** 에셋을 받으므로 R2 egress($0)가 그대로 유지된다.
 * (Next.js 로 프록시하면 Vercel egress 과금 → 그래서 엣지에서 서빙한다.)
 *
 * 경로 규약:  https://<worker-host>/<id>/<file>   →  R2 key `<id>/<file>`
 *   예) https://godot.example/poim/viewer.wasm  →  r2: poim/viewer.wasm(.br)
 *
 * 핵심 제약(라우트 핸들러와 동일, 단일 출처: brokenegg-doc/wiki/핵심 기술 - 3D 웹뷰어 배포 아키텍처.md):
 *  1. brotli 사전압축본(.br)은 **Content-Length 를 생략(chunked)** 하고 보낸다.
 *     Godot 로더가 `new Uint8Array(Content-Length)` 로 버퍼를 미리 잡는데, 압축크기로 잡으면
 *     디코드크기와 안 맞아 오버플로("Failed loading file") → Content-Length 없이 chunked 로 보내면
 *     브라우저가 br 을 자동 해제하면서 로더도 호환된다(압축 전송 유지).
 *  2. viewer.js 의 `executable` 을 절대 URL 로, viewer_function.js 의 `url` 을 전체 URL 로 치환한다.
 *     (동적 주입 스크립트는 document.currentScript=null → 상대경로 해석이 깨짐 / Godot HTTPRequest 는
 *      scheme+host 포함 전체 URL 요구.)
 *  3. cross-origin(뷰어 페이지는 brokenegg.app, 에셋은 이 Worker) → 모든 응답에 CORS 허용.
 */

const CONTENT_TYPES = {
  '.wasm': 'application/wasm',
  '.js': 'text/javascript',
  '.pck': 'application/octet-stream',
  '.zip': 'application/zip', // poim_scene.zip (런타임 모델 데이터)
  '.css': 'text/css',
  '.png': 'image/png',
  '.json': 'application/json',
};

function extname(name) {
  const i = name.lastIndexOf('.');
  return i < 0 ? '' : name.slice(i);
}

/** 에셋은 어디서든 임베드 가능해야 하므로 와일드카드 CORS. (공개 정적 에셋) */
function withCors(headers = new Headers()) {
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  headers.set('Access-Control-Allow-Headers', '*');
  headers.set('Access-Control-Max-Age', '86400');
  return headers;
}

function notFound(key) {
  return new Response(`not found: ${key}`, { status: 404, headers: withCors() });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: withCors() });
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('method not allowed', { status: 405, headers: withCors() });
    }

    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    // 최소 <id>/<file>. 경로 탈출 방지.
    if (parts.length < 2 || parts.some((p) => p === '..' || p === '.')) {
      return new Response('bad path', { status: 400, headers: withCors() });
    }

    const key = parts.join('/'); // poim/viewer.wasm
    const fileName = parts[parts.length - 1];
    const ext = extname(fileName);
    const baseUrl = `${url.origin}/${parts.slice(0, -1).join('/')}`; // https://host/poim

    // ── viewer.js / viewer_function.js: 치환 후 서빙 (캐시 금지: 호스트별 치환본) ──
    if (fileName === 'viewer.js' || fileName === 'viewer_function.js') {
      const obj = await env.BUCKET.get(key);
      if (!obj) return notFound(key);
      const text = await obj.text();
      const absBase = `${baseUrl}/`; // 예: https://host/poim/
      const patched =
        fileName === 'viewer.js'
          ? text
              // wasm/pck 를 항상 이 베이스에서 로드(상대경로 해석 깨짐 방지).
              .replace(/("executable":")([^"/][^"]*)(")/, `$1${baseUrl}/$2$3`)
              // 엔진 인스턴스를 전역에 노출 → 위젯 언마운트 teardown 에서 requestQuit().
              .replace(
                /const engine = new Engine\(GODOT_CONFIG\)/,
                'const engine = (window.__godotEngine = new Engine(GODOT_CONFIG))',
              )
          // 씬이 poim_scene.zip 을 url+file+".zip" 로 HTTPRequest → 전체 URL 필요.
          : text.replace(/url:\s*""/, `url: "${absBase}"`);
      const headers = withCors();
      headers.set('Content-Type', 'text/javascript');
      headers.set('Cache-Control', 'no-store');
      return new Response(request.method === 'HEAD' ? null : patched, { headers });
    }

    // ── brotli 사전압축본: Content-Length 생략 + chunked 스트리밍 ──
    // 브라우저가 Content-Encoding: br 을 자동 해제해 Godot 에 넘긴다. Content-Length 를 주면
    // 압축크기로 버퍼를 잡아 오버플로 → identity TransformStream 으로 흘려보내 chunked(길이 미지정) 보장.
    const acceptsBr = (request.headers.get('accept-encoding') || '').includes('br');
    if (acceptsBr) {
      const br = await env.BUCKET.get(`${key}.br`);
      if (br) {
        const headers = withCors();
        headers.set('Content-Type', CONTENT_TYPES[ext] ?? 'application/octet-stream');
        headers.set('Content-Encoding', 'br');
        headers.set('Vary', 'Accept-Encoding');
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        if (request.method === 'HEAD') return new Response(null, { headers });
        // pipeThrough identity → 출력 길이 미지정 → Content-Length 안 붙음(chunked).
        const body = br.body.pipeThrough(new TransformStream());
        // ⚠️ encodeBody:'manual' — 본문이 **이미 br 로 인코딩됨**을 런타임에 알려 자동 재압축을 막는다.
        // 없으면 Cloudflare/workerd 가 Accept-Encoding: br 을 보고 br(br(...)) 이중 인코딩 → 브라우저가
        // 1회만 풀어 Godot 에 still-br 전달 → "Failed loading file". (wrangler dev 로 실측 확인.)
        return new Response(body, { headers, encodeBody: 'manual' });
      }
    }

    // ── 폴백: 무압축 원본 (예: poim_scene.zip, 또는 br 미수락 클라이언트) ──
    const obj = await env.BUCKET.get(key);
    if (!obj) return notFound(key);
    const headers = withCors();
    headers.set('Content-Type', CONTENT_TYPES[ext] ?? 'application/octet-stream');
    headers.set('Vary', 'Accept-Encoding');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Content-Length', String(obj.size));
    return new Response(request.method === 'HEAD' ? null : obj.body, { headers });
  },
};
