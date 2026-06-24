'use client';

import styles from './demo-request.module.css';
import { cx } from '@/shared/lib';
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { DEMO_MODAL_OPEN_EVENT } from '../lib/events';
import { EMPTY_FORM, type DemoRequestForm, type DemoRequestResponse } from '../model/types';
import { FIELD_LIMITS, hasErrors, validateDemoForm, type DemoFormErrors } from '../lib/validate';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/** 네트워크가 멈춰도 영원히 "전송 중"에 갇히지 않도록 두는 상한. */
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * 입력 단계 제약(constrain): 허용되지 않는 문자를 타이핑/붙여넣기 즉시 제거한다.
 * onKeyDown이 아니라 onChange에서 처리해야 붙여넣기·자동완성·IME 우회까지 막힌다.
 */
const SANITIZERS: Partial<Record<keyof DemoRequestForm, (v: string) => string>> = {
  contact: (v) => v.replace(/[^\d+\-\s]/g, ''),
  email: (v) => v.replace(/\s/g, ''),
};

/**
 * 데모 요청 모달. layout에 한 번만 마운트되고, 어디서든 openDemoModal() 신호를 받아 열린다.
 * 전송 시 /api/demo-request 로 POST → 서버가 메일 발송. 카피는 next-intl로 다국어 처리.
 */
export function DemoRequestModal() {
  const t = useTranslations('demo');
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<DemoFormErrors>({});
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [consentInvalid, setConsentInvalid] = useState(false);
  const [form, setForm] = useState<DemoRequestForm>(EMPTY_FORM);

  useEffect(() => {
    const handler = () => {
      setForm(EMPTY_FORM);
      setAgreePrivacy(false);
      setFieldErrors({});
      setConsentInvalid(false);
      setError('');
      setStatus('idle');
      setOpen(true);
    };
    window.addEventListener(DEMO_MODAL_OPEN_EVENT, handler);
    return () => window.removeEventListener(DEMO_MODAL_OPEN_EVENT, handler);
  }, []);

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
    if (status === 'submitting') return;
    setOpen(false);
    setError('');
    setConsentInvalid(false);
    setFieldErrors({});
    setStatus('idle');
  }

  const update =
    (field: keyof DemoRequestForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const sanitize = SANITIZERS[field];
      const value = sanitize ? sanitize(e.target.value) : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
      if (status === 'error') {
        setStatus('idle');
        setError('');
      }
    };

  /** 검증 에러 코드 → 현재 로케일 메시지. (필드별 최대 길이를 {max}로 주입) */
  const fieldErrorText = (field: keyof DemoRequestForm) => {
    const code = fieldErrors[field];
    if (!code) return null;
    return t(`errors.${code}`, { max: FIELD_LIMITS[field] });
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;

    // 1) 클라이언트 검증
    const errors = validateDemoForm(form);
    setFieldErrors(errors);
    const consentMissing = !agreePrivacy;
    setConsentInvalid(consentMissing);
    if (hasErrors(errors) || consentMissing) {
      setStatus('idle');
      setError('');
      // 검증 실패한 첫 항목으로 포커스 이동 → 어디가 문제인지 강조.
      const order: (keyof DemoRequestForm)[] = ['company', 'name', 'contact', 'email', 'message'];
      const firstInvalid = order.find((field) => errors[field]);
      const target = firstInvalid
        ? document.getElementById(`demo-${firstInvalid}`)
        : document.getElementById('demo-consent-check');
      target?.focus();
      target?.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
        throw new Error('submitFailed');
      }
      if (!res.ok || !json.ok) {
        throw new Error('submitFailed');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError(t('errors.timeout'));
      } else if (err instanceof TypeError) {
        setError(t('errors.network'));
      } else {
        setError(t('errors.submitFailed'));
      }
    } finally {
      clearTimeout(timer);
    }
  }

  if (!open) return null;

  const submitting = status === 'submitting';

  return (
    <div
      className={styles['demo-modal-backdrop']}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className={styles['demo-modal']} role="dialog" aria-modal="true" aria-label={t('title')}>
        <button
          type="button"
          className={styles['demo-modal-close']}
          onClick={close}
          disabled={submitting}
          aria-label={t('close')}
        >
          ✕
        </button>

        {status === 'success' ? (
          <div className={styles['demo-modal-success']}>
            <span className="badge">{t('successBadge')}</span>
            <h2>{t('successTitle')}</h2>
            <p>
              {t('successBody1')}
              <br />
              {t('successBody2')}
            </p>
            <button type="button" className="btn btn-primary" onClick={close}>
              {t('close')}
            </button>
          </div>
        ) : (
          <>
            <div className={styles['demo-modal-head']}>
              <span className="badge">{t('badge')}</span>
              <h2>{t('title')}</h2>
              <p>{t('desc')}</p>
            </div>

            <form className={styles['demo-form']} onSubmit={onSubmit} noValidate>
              <input
                type="text"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                className={styles['demo-honeypot']}
                aria-hidden="true"
              />

              <div className={styles['demo-field']}>
                <label htmlFor="demo-company">
                  {t('company')} <span className={styles['req']}>*</span>
                </label>
                <input
                  id="demo-company"
                  type="text"
                  maxLength={FIELD_LIMITS.company}
                  value={form.company}
                  onChange={update('company')}
                  placeholder={t('companyPh')}
                  aria-invalid={!!fieldErrors.company}
                  aria-describedby={fieldErrors.company ? 'demo-company-error' : undefined}
                  disabled={submitting}
                />
                {fieldErrors.company && (
                  <p id="demo-company-error" className={styles['demo-field-error']} role="alert">
                    {fieldErrorText('company')}
                  </p>
                )}
              </div>

              <div className={styles['demo-field-row']}>
                <div className={styles['demo-field']}>
                  <label htmlFor="demo-name">
                    {t('name')} <span className={styles['req']}>*</span>
                  </label>
                  <input
                    id="demo-name"
                    type="text"
                    maxLength={FIELD_LIMITS.name}
                    value={form.name}
                    onChange={update('name')}
                    placeholder={t('namePh')}
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? 'demo-name-error' : undefined}
                    disabled={submitting}
                  />
                  {fieldErrors.name && (
                    <p id="demo-name-error" className={styles['demo-field-error']} role="alert">
                      {fieldErrorText('name')}
                    </p>
                  )}
                </div>
                <div className={styles['demo-field']}>
                  <label htmlFor="demo-contact">
                    {t('contact')} <span className={styles['req']}>*</span>
                  </label>
                  <input
                    id="demo-contact"
                    type="tel"
                    maxLength={FIELD_LIMITS.contact}
                    value={form.contact}
                    onChange={update('contact')}
                    placeholder={t('contactPh')}
                    inputMode="tel"
                    aria-invalid={!!fieldErrors.contact}
                    aria-describedby={fieldErrors.contact ? 'demo-contact-error' : undefined}
                    disabled={submitting}
                  />
                  {fieldErrors.contact && (
                    <p id="demo-contact-error" className={styles['demo-field-error']} role="alert">
                      {fieldErrorText('contact')}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles['demo-field']}>
                <label htmlFor="demo-email">
                  {t('email')} <span className={styles['req']}>*</span>
                </label>
                <input
                  id="demo-email"
                  type="email"
                  maxLength={FIELD_LIMITS.email}
                  value={form.email}
                  onChange={update('email')}
                  placeholder={t('emailPh')}
                  inputMode="email"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'demo-email-error' : undefined}
                  disabled={submitting}
                />
                {fieldErrors.email && (
                  <p id="demo-email-error" className={styles['demo-field-error']} role="alert">
                    {fieldErrorText('email')}
                  </p>
                )}
              </div>

              <div className={styles['demo-field']}>
                <label htmlFor="demo-message">
                  {t('message')} <span className={styles['req']}>*</span>
                </label>
                <textarea
                  id="demo-message"
                  rows={4}
                  maxLength={FIELD_LIMITS.message}
                  value={form.message}
                  onChange={update('message')}
                  placeholder={t('messagePh')}
                  aria-invalid={!!fieldErrors.message}
                  aria-describedby={fieldErrors.message ? 'demo-message-error' : undefined}
                  disabled={submitting}
                />
                {fieldErrors.message && (
                  <p id="demo-message-error" className={styles['demo-field-error']} role="alert">
                    {fieldErrorText('message')}
                  </p>
                )}
              </div>

              <div className={styles['demo-consent-group']}>
                <div className={styles['demo-consent-title']}>
                  {t('consentTitle')} <span className={styles['req']}>*</span>
                </div>
                <div className={styles['demo-policy']}>{t('policy')}</div>
                <label className={styles['demo-consent']}>
                  <input
                    id="demo-consent-check"
                    type="checkbox"
                    checked={agreePrivacy}
                    aria-invalid={consentInvalid}
                    onChange={(e) => {
                      setAgreePrivacy(e.target.checked);
                      if (e.target.checked) setConsentInvalid(false);
                    }}
                    disabled={submitting}
                  />
                  <span>{t('consentLabel')}</span>
                </label>
                {consentInvalid && (
                  <p className={styles['demo-field-error']} role="alert">
                    {t('errors.consent')}
                  </p>
                )}
              </div>

              {status === 'error' && error && (
                <p className={styles['demo-form-error']} role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className={cx('btn', 'btn-primary', styles['demo-submit'])}
                disabled={submitting}
              >
                {submitting ? t('submitting') : t('submit')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
