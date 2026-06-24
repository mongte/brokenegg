import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { brotliDecompressSync } from 'node:zlib';
import type { NextRequest } from 'next/server';

/**
 * Godot 웹뷰어 에셋 서버 (로컬 테스트).
 * `godot-assets/<...>` 의 파일을 같은 오리진으로 서빙한다.
 * `.br`(brotli) 사전압축본이 있으면 `Content-Encoding: br`로 보내고(브라우저가 자동 해제),
 * 없으면 원본을 그대로 보낸다. wasm은 application/wasm 으로 줘야 instantiateStreaming 이 동작.
 *
 * viewer.js 는 자기 스크립트 src 기준으로 viewer.wasm/.pck 를 fetch 하므로,
 * 셋을 모두 같은 `/godot/<folder>/` 프리픽스로 서빙하면 경로가 자연히 맞는다.
 */

const CONTENT_TYPES: Record<string, string> = {
  '.wasm': 'application/wasm',
  '.js': 'text/javascript',
  '.pck': 'application/octet-stream',
  '.zip': 'application/zip', // poim_scene.zip (런타임 모델 데이터). Godot 은 Content-Type 무시하지만 명시.
  '.css': 'text/css',
  '.png': 'image/png',
  '.json': 'application/json',
};

function resolveRoot(): string {
  // Nx/Next 실행 위치(cwd)가 워크스페이스 루트일 수도, 앱 디렉토리일 수도 있어 둘 다 시도.
  const candidates = [
    path.join(process.cwd(), 'godot-assets'),
    path.join(process.cwd(), 'apps', 'brokenegg-app', 'godot-assets'),
  ];
  return candidates.find((c) => existsSync(c)) ?? candidates[0];
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: parts } = await params;

  // 경로 탈출 방지
  if (parts.some((p) => p === '..' || p.includes('/') || p.includes('\\'))) {
    return new Response('bad path', { status: 400 });
  }

  const root = resolveRoot();
  const rel = parts.join('/');
  const ext = path.extname(rel);
  const filePath = path.join(root, rel);
  const brPath = `${filePath}.br`;
  const fileName = parts[parts.length - 1];
  const baseUrl = `/godot/${parts.slice(0, -1).join('/')}`; // 예: /godot/poim

  // 클라이언트가 br 을 받을 때만 사전압축본을 보낸다(콘텐츠 협상).
  const acceptsBr = (req.headers.get('accept-encoding') ?? '').includes('br');

  // ⚠️ Godot 로더는 Content-Length 만큼 버퍼를 미리 잡고(`new Uint8Array(length)`) 거기에
  // 디코드된 바이트를 채운다. 사전압축본(.br)을 Content-Encoding: br 로 주면
  // Content-Length=압축크기 < 디코드크기 → 버퍼 오버플로 → "Failed loading file".
  // 따라서 Godot 가 직접 fetch 하는 바이너리(wasm/pck/...)는 **무압축**으로 서빙한다.
  // (브라우저 <script>/<link> 가 받는 파일이면 br 이 안전하지만, 여기선 엔진이 직접 읽으므로 무압축.)
  let body: Buffer;
  let encoding: string | null = null;

  // viewer.js 는 GODOT_CONFIG 의 executable 을 절대경로로 바꿔 서빙한다.
  // 동적 주입 <script> 는 document.currentScript 가 null 이 되어 viewer.js 가
  // wasm/pck 를 페이지 경로(/ko/viewer/...) 기준으로 잘못 찾는 문제를 원천 차단.
  // executable 을 `/godot/<folder>/viewer` 절대경로로 만들면 wasm·pck 가 항상 여기서 로드된다.
  // viewer_function.js 는 initSetting.url 을 에셋 베이스로 치환한다.
  // 씬이 런타임에 poim_scene.zip(모델 데이터)을 url+file+".zip" 로 fetch 하는데,
  // url="" 이면 페이지 경로(/ko/viewer/poim_scene.zip)에서 찾아 404 가 난다.
  // url="/godot/<folder>/" 로 만들면 /godot/<folder>/poim_scene.zip 에서 정상 로드.
  if (fileName === 'viewer.js' || fileName === 'viewer_function.js') {
    try {
      const text = await readFile(filePath, 'utf8');
      // viewer_function.js 의 url 은 Godot HTTPRequest 가 파싱하므로 scheme+host 포함 전체 URL 이어야 한다.
      const absBase = `${req.nextUrl.origin}${baseUrl}/`; // 예: http://localhost:3000/godot/poim/
      const patched =
        fileName === 'viewer.js'
          ? text
              // wasm/pck 절대경로
              .replace(/("executable":")([^"/][^"]*)(")/, `$1${baseUrl}/$2$3`)
              // 엔진 인스턴스를 전역에 노출 → 위젯 언마운트 시 requestQuit() 로 정리(teardown).
              .replace(
                /const engine = new Engine\(GODOT_CONFIG\)/,
                'const engine = (window.__godotEngine = new Engine(GODOT_CONFIG))',
              )
          : text.replace(/url:\s*""/, `url: "${absBase}"`);
      const headers = new Headers();
      headers.set('Content-Type', 'text/javascript');
      headers.set('Cache-Control', 'no-store'); // 치환본이라 캐시 금지
      headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
      return new Response(patched, { headers });
    } catch {
      return new Response(`not found: ${rel}`, { status: 404 });
    }
  }

  void encoding;

  // ── brotli 스트리밍 (전송량/egress 절감 + Godot 로더 호환) ──
  // 핵심: 브라우저는 Content-Encoding: br 을 항상 자동 해제해 Godot 에 넘긴다.
  // 문제는 Content-Length(압축크기)와 디코드크기가 안 맞아 Godot 로더 버퍼가 터지는 것.
  // → Content-Length 를 **생략**하고 ReadableStream 으로 보내면(chunked transfer)
  //    압축 전송(7.5MB)은 유지하면서 로더 오버플로를 피한다.
  if (acceptsBr && existsSync(brPath)) {
    const brBuf = await readFile(brPath);
    const stream = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(new Uint8Array(brBuf));
        c.close();
      },
    });
    const h = new Headers();
    h.set('Content-Type', CONTENT_TYPES[ext] ?? 'application/octet-stream');
    h.set('Content-Encoding', 'br');
    h.set('Vary', 'Accept-Encoding');
    // Content-Length 의도적 생략 → chunked → Godot 로더 호환
    h.set('Cache-Control', 'public, max-age=31536000, immutable');
    h.set('Cross-Origin-Resource-Policy', 'cross-origin');
    return new Response(stream, { headers: h });
  }

  // 폴백: br 미지원/미존재 → 무압축으로(Content-Length 일치).
  // 원본이 없으면 .br 을 즉석 해제해 서빙한다 → 디스크엔 .br 만 둬도 됨(원본 wasm/pck 삭제 가능).
  try {
    body = await readFile(filePath);
  } catch {
    if (existsSync(brPath)) {
      body = brotliDecompressSync(await readFile(brPath));
    } else {
      return new Response(`not found: ${rel}`, { status: 404 });
    }
  }

  const headers = new Headers();
  headers.set('Content-Type', CONTENT_TYPES[ext] ?? 'application/octet-stream');
  headers.set('Vary', 'Accept-Encoding');
  headers.set('Content-Length', String(body.byteLength));
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  return new Response(new Uint8Array(body), { headers });
}
