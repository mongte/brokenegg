import type { DemoRequestForm } from '../model/types';

/** 필드별 최대 길이 (과도한 입력/페이로드 방지). */
export const FIELD_LIMITS = {
  company: 100,
  name: 50,
  contact: 40,
  email: 100,
  message: 2000,
} as const;

/** 필드명 → 에러 메시지 맵. 에러가 없으면 빈 객체. */
export type DemoFormErrors = Partial<Record<keyof DemoRequestForm, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 데모 요청 폼 검증. 클라이언트(즉시 피드백)와 서버(방어) 양쪽에서 사용한다.
 * 빈 객체를 반환하면 유효.
 */
export function validateDemoForm(form: DemoRequestForm): DemoFormErrors {
  const errors: DemoFormErrors = {};

  const company = form.company.trim();
  const name = form.name.trim();
  const contact = form.contact.trim();
  const email = form.email.trim();
  const message = form.message.trim();

  if (!company) {
    errors.company = '회사명을 입력해주세요.';
  } else if (company.length > FIELD_LIMITS.company) {
    errors.company = `회사명은 ${FIELD_LIMITS.company}자 이내로 입력해주세요.`;
  }

  if (!name) {
    errors.name = '이름을 입력해주세요.';
  } else if (name.length > FIELD_LIMITS.name) {
    errors.name = `이름은 ${FIELD_LIMITS.name}자 이내로 입력해주세요.`;
  }

  if (!contact) {
    errors.contact = '연락처를 입력해주세요.';
  } else if (contact.length > FIELD_LIMITS.contact) {
    errors.contact = `연락처는 ${FIELD_LIMITS.contact}자 이내로 입력해주세요.`;
  } else {
    // 하이픈·공백·+ 등 표기는 허용하되, 숫자만 추려 자릿수로 판단한다(국내 유선/휴대폰 9~11자리).
    const digits = contact.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 11) {
      errors.contact = '연락처를 정확히 입력해주세요. (숫자 9~11자리)';
    }
  }

  if (!email) {
    errors.email = '이메일을 입력해주세요.';
  } else if (email.length > FIELD_LIMITS.email) {
    errors.email = `이메일은 ${FIELD_LIMITS.email}자 이내로 입력해주세요.`;
  } else if (!EMAIL_RE.test(email)) {
    errors.email = '이메일 형식이 올바르지 않습니다.';
  }

  if (!message) {
    errors.message = '문의 내용을 입력해주세요.';
  } else if (message.length > FIELD_LIMITS.message) {
    errors.message = `문의 내용은 ${FIELD_LIMITS.message}자 이내로 입력해주세요.`;
  }

  return errors;
}

export function hasErrors(errors: DemoFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
