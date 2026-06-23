'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { DEMO_MODAL_OPEN_EVENT } from '../lib/events';
import { PRIVACY_CONSENT } from '../model/policy';
import { EMPTY_FORM, type DemoRequestForm, type DemoRequestResponse } from '../model/types';
import { FIELD_LIMITS, hasErrors, validateDemoForm, type DemoFormErrors } from '../lib/validate';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/** 네트워크가 멈춰도 영원히 "전송 중"에 갇히지 않도록 두는 상한. */
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * 입력 단계 제약(constrain): 허용되지 않는 문자를 타이핑/붙여넣기 즉시 제거한다.
 * onKeyDown이 아니라 onChange에서 처리해야 붙여넣기·자동완성·IME 우회까지 막힌다.
 * 어디까지나 UX 보정이며, 실제 방어는 validate(클라이언트+서버)가 담당한다.
 */
const SANITIZERS: Partial<Record<keyof DemoRequestForm, (v: string) => string>> = {
  // 연락처: 숫자와 전화번호 표기 문자(+, -, 공백)만 남긴다.
  contact: (v) => v.replace(/[^\d+\-\s]/g, ''),
  // 이메일: 공백 불가.
  email: (v) => v.replace(/\s/g, ''),
};

/**
 * 데모 요청 모달. layout에 한 번만 마운트되고, 어디서든 openDemoModal() 신호를 받아 열린다.
 * 전송 시 /api/demo-request 로 POST → 서버가 메일 발송.
 */
export function DemoRequestModal() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<DemoFormErrors>({});
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [consentError, setConsentError] = useState('');
  const [form, setForm] = useState<DemoRequestForm>(EMPTY_FORM);

  // 외부 CTA → 모달 열기. 닫았다 다시 열면 항상 이전 입력을 초기화한다.
  useEffect(() => {
    const handler = () => {
      setForm(EMPTY_FORM);
      setAgreePrivacy(false);
      setFieldErrors({});
      setConsentError('');
      setError('');
      setStatus('idle');
      setOpen(true);
    };
    window.addEventListener(DEMO_MODAL_OPEN_EVENT, handler);
    return () => window.removeEventListener(DEMO_MODAL_OPEN_EVENT, handler);
  }, []);

  // 열려 있을 때 배경 스크롤 잠금 + Esc 닫기(전송 중에는 막지 않음)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, status]);

  function close() {
    // 전송 중에는 닫지 않는다(중복/유실 방지).
    if (status === 'submitting') return;
    setOpen(false);
    setError('');
    setConsentError('');
    setFieldErrors({});
    setStatus('idle');
    // 입력 초기화는 다시 열 때 일괄 처리한다(닫는 경로와 무관하게 항상 초기화).
  }

  const update =
    (field: keyof DemoRequestForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const sanitize = SANITIZERS[field];
      const value = sanitize ? sanitize(e.target.value) : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      // 입력을 고치면 해당 필드 에러와 직전 전송 에러를 즉시 해제
      setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
      if (status === 'error') {
        setStatus('idle');
        setError('');
      }
    };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;

    // 1) 클라이언트 검증
    const errors = validateDemoForm(form);
    setFieldErrors(errors);
    const consentMissing = !agreePrivacy;
    setConsentError(consentMissing ? '개인정보 수집 및 이용에 동의해주세요.' : '');
    if (hasErrors(errors) || consentMissing) {
      setStatus('idle');
      setError('');
      return;
    }

    // 2) 전송 (타임아웃 가드)
    setError('');
    setStatus('submitting');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      let json: DemoRequestResponse;
      try {
        json = (await res.json()) as DemoRequestResponse;
      } catch {
        throw new Error('서버 응답을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.');
      }

      if (!res.ok || !json.ok) {
        throw new Error(json.error || '전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('요청 시간이 초과되었습니다. 네트워크 상태를 확인하고 다시 시도해주세요.');
      } else if (err instanceof TypeError) {
        setError('네트워크 오류로 전송하지 못했습니다. 연결을 확인한 뒤 다시 시도해주세요.');
      } else {
        setError(err instanceof Error ? err.message : '전송에 실패했습니다.');
      }
    } finally {
      clearTimeout(timer);
    }
  }

  if (!open) return null;

  const submitting = status === 'submitting';

  return (
    <div
      className="demo-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="demo-modal" role="dialog" aria-modal="true" aria-label="데모 요청">
        <button
          type="button"
          className="demo-modal-close"
          onClick={close}
          disabled={submitting}
          aria-label="닫기"
        >
          ✕
        </button>

        {status === 'success' ? (
          <div className="demo-modal-success">
            <span className="badge">SENT</span>
            <h2>요청이 접수되었습니다.</h2>
            <p>
              영업일 기준 1–2일 내에
              <br />
              남겨주신 연락처로 회신드리겠습니다.
            </p>
            <button type="button" className="btn btn-primary" onClick={close}>
              닫기
            </button>
          </div>
        ) : (
          <>
            <div className="demo-modal-head">
              <span className="badge">DEMO REQUEST</span>
              <h2>데모를 요청하세요</h2>
              <p>제품과 도입 방식이 궁금하시면 남겨주세요. 영업일 기준 1–2일 내 회신드립니다.</p>
            </div>

            <form className="demo-form" onSubmit={onSubmit} noValidate>
              {/* 허니팟: 화면에 안 보이고 봇만 채움 */}
              <input
                type="text"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                className="demo-honeypot"
                aria-hidden="true"
              />

              <div className="demo-field">
                <label htmlFor="demo-company">
                  회사명 <span className="req">*</span>
                </label>
                <input
                  id="demo-company"
                  type="text"
                  maxLength={FIELD_LIMITS.company}
                  value={form.company}
                  onChange={update('company')}
                  placeholder="브로큰에그"
                  aria-invalid={!!fieldErrors.company}
                  aria-describedby={fieldErrors.company ? 'demo-company-error' : undefined}
                  disabled={submitting}
                />
                {fieldErrors.company && (
                  <p id="demo-company-error" className="demo-field-error" role="alert">
                    {fieldErrors.company}
                  </p>
                )}
              </div>

              <div className="demo-field-row">
                <div className="demo-field">
                  <label htmlFor="demo-name">이름</label>
                  <input
                    id="demo-name"
                    type="text"
                    maxLength={FIELD_LIMITS.name}
                    value={form.name}
                    onChange={update('name')}
                    placeholder="홍길동"
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? 'demo-name-error' : undefined}
                    disabled={submitting}
                  />
                  {fieldErrors.name && (
                    <p id="demo-name-error" className="demo-field-error" role="alert">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>
                <div className="demo-field">
                  <label htmlFor="demo-contact">
                    연락처 <span className="req">*</span>
                  </label>
                  <input
                    id="demo-contact"
                    type="tel"
                    maxLength={FIELD_LIMITS.contact}
                    value={form.contact}
                    onChange={update('contact')}
                    placeholder="010-0000-0000"
                    inputMode="tel"
                    aria-invalid={!!fieldErrors.contact}
                    aria-describedby={fieldErrors.contact ? 'demo-contact-error' : undefined}
                    disabled={submitting}
                  />
                  {fieldErrors.contact && (
                    <p id="demo-contact-error" className="demo-field-error" role="alert">
                      {fieldErrors.contact}
                    </p>
                  )}
                </div>
              </div>

              <div className="demo-field">
                <label htmlFor="demo-email">이메일</label>
                <input
                  id="demo-email"
                  type="email"
                  maxLength={FIELD_LIMITS.email}
                  value={form.email}
                  onChange={update('email')}
                  placeholder="name@company.com"
                  inputMode="email"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'demo-email-error' : undefined}
                  disabled={submitting}
                />
                {fieldErrors.email && (
                  <p id="demo-email-error" className="demo-field-error" role="alert">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="demo-field">
                <label htmlFor="demo-message">문의 내용</label>
                <textarea
                  id="demo-message"
                  rows={4}
                  maxLength={FIELD_LIMITS.message}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="도입 목적, 일정, 궁금한 점을 자유롭게 적어주세요."
                  aria-invalid={!!fieldErrors.message}
                  aria-describedby={fieldErrors.message ? 'demo-message-error' : undefined}
                  disabled={submitting}
                />
                {fieldErrors.message && (
                  <p id="demo-message-error" className="demo-field-error" role="alert">
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              <div className="demo-consent-group">
                <div className="demo-consent-title">
                  개인정보 수집 및 이용 동의 <span className="req">*</span>
                </div>
                <div className="demo-policy">{PRIVACY_CONSENT}</div>
                <label className="demo-consent">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => {
                      setAgreePrivacy(e.target.checked);
                      if (e.target.checked) setConsentError('');
                    }}
                    disabled={submitting}
                  />
                  <span>개인정보 수집 및 이용에 동의합니다.</span>
                </label>
                {consentError && (
                  <p className="demo-field-error" role="alert">
                    {consentError}
                  </p>
                )}
              </div>

              {status === 'error' && error && (
                <p className="demo-form-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="btn btn-primary demo-submit" disabled={submitting}>
                {submitting ? '전송 중…' : '전송'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
