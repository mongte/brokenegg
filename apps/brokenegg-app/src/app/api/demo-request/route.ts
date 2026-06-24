/**
 * 데모 요청 폼 수신 엔드포인트.
 * 클라이언트 모달이 보낸 데이터를 Resend로 전달해 지정 메일로 발송한다.
 * RESEND_API_KEY는 서버 환경변수로만 다루고 번들에 노출하지 않는다(서버 발송).
 *
 * 클라이언트 검증과 별개로 서버에서도 한 번 더 방어 검증한다(우회 요청 대비).
 *
 * 필요 환경변수
 * - RESEND_API_KEY     : Resend API 키 (https://resend.com → API Keys)
 * - DEMO_NOTIFY_EMAIL  : 알림을 받을 메일 주소(수신함)
 * - DEMO_FROM          : (선택) 발신 표기. 기본 'Broken Egg <onboarding@resend.dev>'
 *                        자체 도메인 발신은 Resend에서 도메인 인증 후 'noreply@brokenegg.co.kr' 등으로 교체.
 *   ※ 도메인 미인증(onboarding@resend.dev) 상태에서는 Resend 계정 소유자 메일로만 수신 가능.
 */
import type { DemoRequestForm, DemoRequestResponse } from '@/features/demo-request';
// 런타임 함수는 public API(barrel)로 가져오면 클라이언트 컴포넌트까지 번들에 끌려오므로
// 서버 라우트에서는 검증 모듈을 직접 가리킨다.
import { hasErrors, validateDemoForm } from '@/features/demo-request/lib/validate';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'Broken Egg <onboarding@resend.dev>';
const UPSTREAM_TIMEOUT_MS = 15_000;

function json(body: DemoRequestResponse, status: number) {
  return Response.json(body, { status });
}

/** 신뢰할 수 없는 값을 안전하게 문자열로. (배열/객체/숫자/undefined → '') */
function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/** HTML 이메일 본문에 사용자 입력이 그대로 들어가지 않도록 escape. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(form: DemoRequestForm): string {
  const rows: [string, string][] = [
    ['회사명', form.company],
    ['이름', form.name || '-'],
    ['연락처', form.contact],
    ['이메일', form.email || '-'],
    ['문의내용', form.message || '-'],
  ];
  const trs = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;font-weight:700;color:#666;white-space:nowrap;vertical-align:top">${k}</td>` +
        `<td style="padding:8px 12px;color:#111;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join('');
  return (
    `<div style="font-family:system-ui,sans-serif;max-width:560px">` +
    `<h2 style="font-size:18px;margin:0 0 16px">새 데모 요청</h2>` +
    `<table style="border-collapse:collapse;width:100%;border:1px solid #e0e0e0">${trs}</table>` +
    `</div>`
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.DEMO_NOTIFY_EMAIL;
  const from = process.env.DEMO_FROM || DEFAULT_FROM;
  if (!apiKey || !to) {
    return json(
      { ok: false, error: '메일 발송이 설정되지 않았습니다. (RESEND_API_KEY/DEMO_NOTIFY_EMAIL 누락)' },
      500,
    );
  }

  // 본문 파싱 (JSON이 아니면 400)
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: '잘못된 요청입니다.' }, 400);
  }
  if (typeof raw !== 'object' || raw === null) {
    return json({ ok: false, error: '잘못된 요청입니다.' }, 400);
  }
  const body = raw as Record<string, unknown>;

  // 허니팟: 봇이면 성공한 척 조용히 종료
  if (asString(body.botcheck).trim()) {
    return json({ ok: true }, 200);
  }

  // 모든 필드를 문자열로 정규화 → 공유 검증기로 방어
  const form: DemoRequestForm = {
    company: asString(body.company).trim(),
    name: asString(body.name).trim(),
    contact: asString(body.contact).trim(),
    email: asString(body.email).trim(),
    message: asString(body.message).trim(),
  };

  // 서버 방어 검증(우회 요청 대비). 정상 사용자는 클라이언트에서 먼저 막힌다.
  if (hasErrors(validateDemoForm(form))) {
    return json({ ok: false, error: 'invalid_input' }, 400);
  }

  // Resend 호출 (네트워크 행/지연 가드)
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        from,
        to: [to],
        subject: `[데모 요청] ${form.company}`,
        html: buildHtml(form),
        // 문의자 이메일이 있으면 바로 회신 가능하도록 reply_to 지정
        ...(form.email ? { reply_to: form.email } : {}),
      }),
    });
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === 'AbortError';
    return json(
      {
        ok: false,
        error: timedOut
          ? '메일 서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.'
          : '메일 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      502,
    );
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const detail = (await res.json().catch(() => ({}))) as { message?: string };
    return json({ ok: false, error: detail.message || '메일 발송에 실패했습니다.' }, 502);
  }

  return json({ ok: true }, 200);
}
