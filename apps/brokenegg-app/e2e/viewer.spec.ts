import { test, expect } from '@playwright/test';

/**
 * Poim 3D 뷰어가 COOP/COEP 헤더 없이도(single-thread export) 렌더되는지 검증.
 * - 씬 데이터(poim_scene.zip) 로드 성공 로그 확인
 * - canvas WebGL2 컨텍스트 활성 확인
 * - crossOriginIsolated 가 false 인지(=헤더 제거됨) 확인
 * - 치명적 로드 실패가 없는지 확인
 */
test('Poim viewer renders without COOP/COEP (single-thread)', async ({ page }) => {
  const consoleMsgs: string[] = [];
  const pageErrors: string[] = [];
  const reqFailed: string[] = [];

  page.on('console', (m) => consoleMsgs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('requestfailed', (r) =>
    reqFailed.push(`${r.failure()?.errorText ?? ''} ${r.url()}`),
  );

  await page.goto('/ko/viewer/poim', { waitUntil: 'domcontentloaded' });

  // 씬 데이터 로드 성공 로그를 기다린다 (viewer_function.js 가 출력).
  await expect
    .poll(() => consoleMsgs.some((m) => m.includes('성공적으로 로드')), {
      timeout: 45_000,
      message: 'poim_scene.zip 로드 성공 로그를 기다림',
    })
    .toBe(true);

  const coi = await page.evaluate(() => self.crossOriginIsolated);
  const canvas = await page.evaluate(() => {
    const c = document.querySelector('canvas') as HTMLCanvasElement | null;
    return c ? { w: c.width, h: c.height, gl2: !!c.getContext('webgl2') } : null;
  });

  // teardown 용 엔진 핸들이 전역에 노출됐는지(언마운트 시 requestQuit 호출 가능)
  const engineExposed = await page.evaluate(
    () =>
      typeof (window as unknown as { __godotEngine?: { requestQuit?: unknown } })
        .__godotEngine?.requestQuit === 'function',
  );

  const wasmPckFailed = reqFailed.some(
    (f) => f.includes('viewer.wasm') || f.includes('viewer.pck') || f.includes('poim_scene.zip'),
  );
  const fatalLoad = pageErrors.some((e) => e.includes('Failed loading file'));

  // 진단 출력
  console.log('crossOriginIsolated:', coi);
  console.log('canvas:', JSON.stringify(canvas));
  console.log('requestfailed:', reqFailed.length ? reqFailed.join('\n') : '(none)');
  console.log(
    'godot logs:',
    consoleMsgs.filter((m) => /Godot|성공적|OpenGL|single-thread|Failed/.test(m)).join('\n'),
  );

  // 단언
  expect(coi, '헤더 제거됨 → crossOriginIsolated 는 false 여야 함').toBe(false);
  expect(engineExposed, '언마운트 teardown 용 엔진 핸들이 노출돼야 함').toBe(true);
  expect(canvas?.gl2, 'WebGL2 컨텍스트가 활성이어야 함').toBe(true);
  expect(canvas && canvas.w > 0 && canvas.h > 0, 'canvas 가 그려진 크기를 가져야 함').toBe(true);
  expect(wasmPckFailed, 'wasm/pck/zip 로드 실패가 없어야 함').toBe(false);
  expect(fatalLoad, '"Failed loading file" 치명 에러가 없어야 함').toBe(false);

  await page.screenshot({ path: 'e2e/viewer-no-coep.png' });
});
