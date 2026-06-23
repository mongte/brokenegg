/**
 * 데모 요청 폼 수신 엔드포인트.
 * 클라이언트 모달이 보낸 데이터를 Web3Forms로 전달해 지정 메일로 발송한다.
 * access_key는 서버 환경변수(WEB3FORMS_KEY)로만 다루고 번들에 노출하지 않는다.
 *
 * 클라이언트 검증과 별개로 서버에서도 한 번 더 방어 검증한다(우회 요청 대비).
 */
import type { DemoRequestForm, DemoRequestResponse } from '@/features/demo-request';
// 런타임 함수는 public API(barrel)로 가져오면 클라이언트 컴포넌트까지 번들에 끌려오므로
// 서버 라우트에서는 검증 모듈을 직접 가리킨다.
import { hasErrors, validateDemoForm } from '@/features/demo-request/lib/validate';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const UPSTREAM_TIMEOUT_MS = 15_000;

function json(body: DemoRequestResponse, status: number) {
  return Response.json(body, { status });
}

/** 신뢰할 수 없는 값을 안전하게 문자열로. (배열/객체/숫자/undefined → '') */
function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export async function POST(request: Request) {
  const accessKey = process.env.WEB3FORMS_KEY;
  if (!accessKey) {
    return json({ ok: false, error: '메일 발송이 설정되지 않았습니다. (WEB3FORMS_KEY 누락)' }, 500);
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

  const errors = validateDemoForm(form);
  if (hasErrors(errors)) {
    const first = Object.values(errors)[0];
    return json({ ok: false, error: first ?? '입력값을 확인해주세요.' }, 400);
  }

  // Web3Forms 호출 (네트워크 행/지연 가드)
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        access_key: accessKey,
        subject: `[데모 요청] ${form.company}`,
        from_name: form.name || form.company,
        회사명: form.company,
        이름: form.name || '-',
        연락처: form.contact,
        이메일: form.email || '-',
        문의내용: form.message || '-',
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

  const result = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
  if (!res.ok || !result.success) {
    return json({ ok: false, error: result.message || '메일 발송에 실패했습니다.' }, 502);
  }

  return json({ ok: true }, 200);
}
