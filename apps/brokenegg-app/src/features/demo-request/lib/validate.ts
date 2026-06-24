import type { DemoRequestForm } from '../model/types';

/** 필드별 최대 길이 (과도한 입력/페이로드 방지). */
export const FIELD_LIMITS = {
  company: 100,
  name: 50,
  contact: 40,
  email: 100,
  message: 2000,
} as const;

/**
 * 필드명 → 에러 *코드* 맵. 에러가 없으면 빈 객체.
 * 값은 로케일 독립적인 코드(예: 'company_required')이며,
 * 화면 표시는 UI(useTranslations)가 `demo.errors.<code>`로 번역한다.
 * 클라이언트와 서버 라우트가 같은 검증기를 공유한다.
 */
export type DemoFormErrors = Partial<Record<keyof DemoRequestForm, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateDemoForm(form: DemoRequestForm): DemoFormErrors {
  const errors: DemoFormErrors = {};

  const company = form.company.trim();
  const name = form.name.trim();
  const contact = form.contact.trim();
  const email = form.email.trim();
  const message = form.message.trim();

  if (!company) {
    errors.company = 'company_required';
  } else if (company.length > FIELD_LIMITS.company) {
    errors.company = 'company_max';
  }

  if (!name) {
    errors.name = 'name_required';
  } else if (name.length > FIELD_LIMITS.name) {
    errors.name = 'name_max';
  }

  if (!contact) {
    errors.contact = 'contact_required';
  } else if (contact.length > FIELD_LIMITS.contact) {
    errors.contact = 'contact_max';
  } else {
    // 하이픈·공백·+ 등 표기는 허용하되, 숫자만 추려 자릿수로 판단(국내 유선/휴대폰 9~11자리).
    const digits = contact.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 11) {
      errors.contact = 'contact_invalid';
    }
  }

  if (!email) {
    errors.email = 'email_required';
  } else if (email.length > FIELD_LIMITS.email) {
    errors.email = 'email_max';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'email_invalid';
  }

  if (!message) {
    errors.message = 'message_required';
  } else if (message.length > FIELD_LIMITS.message) {
    errors.message = 'message_max';
  }

  return errors;
}

export function hasErrors(errors: DemoFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
