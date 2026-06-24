'use client';

import { useEffect, useRef } from 'react';
import styles from './godot-viewer.module.css';

interface GodotViewerProps {
  /** 에셋 베이스 경로 (예: `/godot/poim`). viewer.js·.wasm·.pck 가 이 아래 있어야 한다. */
  base: string;
}

/** viewer.js 가 전역에 노출하는 엔진 핸들(라우트 핸들러가 패치해 주입). */
type GodotWindow = Window & {
  __godotEngine?: { requestQuit?: () => void };
};

/**
 * Godot 4 웹 익스포트를 iframe 없이 같은 라우트의 <canvas> 에 직접 마운트한다.
 *
 * viewer.js 는 로드되면 자동 시작 IIFE 가 돌며 `#canvas` 와 `#status*` DOM 을 찾아 엔진을 부팅한다.
 * 경로는 라우트 핸들러가 executable 을 절대경로로 치환해 해결한다. (Poim export 는 single-thread
 * 라 COOP/COEP 헤더는 불필요 → 제거됨.)
 *
 * 언마운트 teardown: 한 탭에서 여러 모델을 SPA 전환해도 wasm 힙/GPU 가 쌓이지 않도록,
 * 떠날 때 엔진 메인루프를 종료(requestQuit)하고 WebGL 컨텍스트를 해제하며 주입 스크립트를 제거한다.
 * (다음 뷰어 로드 시 `var Godot` 재할당으로 이전 wasm 힙이 GC 대상이 됨.)
 */
export function GodotViewer({ base }: GodotViewerProps) {
  const started = useRef(false);

  useEffect(() => {
    // React Strict Mode 의 이중 effect / 재마운트로 엔진이 두 번 부팅되는 것 방지.
    if (started.current) return;
    started.current = true;

    // viewer_function.js 가 viewer.js 보다 먼저 실행되어야 한다:
    // 씬 스크립트가 호출하는 전역(prograssbar 인터페이스, downloadFileLength)을 정의한다.
    // async=false 로 넣으면 삽입 순서대로 실행된다.
    const fnScript = document.createElement('script');
    fnScript.src = `${base}/viewer_function.js`;
    fnScript.async = false;
    fnScript.dataset.godot = 'poim-fn';
    document.body.appendChild(fnScript);

    const script = document.createElement('script');
    script.src = `${base}/viewer.js`;
    script.async = false;
    script.dataset.godot = 'poim';
    document.body.appendChild(script);

    // ── teardown (언마운트/라우트 전환 시) ──
    return () => {
      started.current = false;
      const w = window as GodotWindow;

      // 1) Godot 메인루프 종료 → 엔진 내부 정리(onExit) + requestAnimationFrame 중단.
      try {
        w.__godotEngine?.requestQuit?.();
      } catch {
        /* 부팅 전이면 무시 */
      }

      // 2) WebGL 컨텍스트 명시적 해제 → GPU 리소스 즉시 반환.
      try {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
        const gl = canvas?.getContext('webgl2') as WebGL2RenderingContext | null;
        gl?.getExtension('WEBGL_lose_context')?.loseContext();
      } catch {
        /* noop */
      }

      // 3) 주입한 스크립트 제거 + 엔진 핸들 정리(참조 끊기 → 다음 GC 때 wasm 힙 회수).
      fnScript.remove();
      script.remove();
      delete w.__godotEngine;
    };
  }, [base]);

  return (
    <div className={styles.wrap}>
      <canvas id="canvas" className={styles.canvas}>
        HTML5 canvas appears to be unsupported.
      </canvas>
      <div id="status" className={styles.status}>
        <progress id="status-progress" className={styles.progress} />
        <div id="status-notice" className={styles.notice} />
      </div>
    </div>
  );
}
