import { defineConfig, devices } from '@playwright/test';

/**
 * Godot 웹뷰어 e2e 테스트 설정.
 * 외부에서 띄운 dev 서버(:3000)에 붙어서 검증한다(webServer 자동기동은 Nx 락 이슈로 미사용).
 * 헤드리스 Chromium 에서 WebGL2 를 쓰려면 SwiftShader 활성 플래그가 필요하다.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    launchOptions: {
      args: ['--enable-unsafe-swiftshader'],
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
