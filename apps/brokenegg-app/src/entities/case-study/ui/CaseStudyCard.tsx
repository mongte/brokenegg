'use client';

import styles from './case-study.module.css';
import { cx } from '@/shared/lib';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Play, ExternalLink, Mail } from 'lucide-react';
import type { CaseStudy } from '../model/types';
import { buildAutoplaySrc, getYouTubeThumbnail } from '../lib/youtube';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

/** 3D 체험 단계: idle(이미지) → rotating(회전) → loaded(iframe). */
type ExpStage = 'idle' | 'rotating' | 'loaded';

/**
 * 고객 사례 카드. 좌측 YouTube · 우측 인터랙티브 3D.
 *
 * 좌(YouTube)
 * - 클릭 전엔 썸네일 + 가운데 재생 버튼만 노출. 자동재생하지 않음.
 * - 가운데를 누르면 그때 iframe을 마운트하고 **소리 ON**으로 재생(autoplay=1, mute 미지정).
 *
 * 우(3D)
 * - 기본은 이미지 + play 아이콘. 누르면 **회전 애니메이션** 후 iframe을 로드(회전 완료 후 마운트).
 * - iframe은 한 번 로드되면 언마운트하지 않음(재로딩 없음).
 * - 뷰포트 밖으로 나가면 stage를 `display:none`(park) → 브라우저가 렌더 루프(rAF)를 자동 일시정지.
 *   (메인 ServicePreview와 동일한 메모리/GPU 최적화)
 */
export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const { company, product, description, link, videoUrl, experienceUrl, posterUrl } = caseStudy;
  const t = useTranslations('cases');
  const label = `${company} ${product}`;

  // 좌: YouTube
  const [videoPlaying, setVideoPlaying] = useState(false);
  // 우: 3D 체험 단계
  const [expStage, setExpStage] = useState<ExpStage>('idle');
  // 우: iframe 마운트 후 뷰포트 밖이면 park
  const [expParked, setExpParked] = useState(false);
  const expRef = useRef<HTMLDivElement>(null);

  // 좌(YouTube)는 영상 썸네일, 우(3D)는 내부 리소스 이미지(없으면 영상 썸네일로 폴백)
  const videoPoster = getYouTubeThumbnail(videoUrl);
  const expPoster = posterUrl ?? videoPoster;

  // 회전 완료 → iframe 로드. animationend가 누락돼도 타임아웃으로 안전하게 진행.
  useEffect(() => {
    if (expStage !== 'rotating') return;
    const timer = setTimeout(() => {
      setExpStage((s) => (s === 'rotating' ? 'loaded' : s));
    }, 1100);
    return () => clearTimeout(timer);
  }, [expStage]);

  // iframe 마운트 후: 뷰포트 밖이면 park(display:none)로 렌더 정지, 다시 보이면 복귀.
  useEffect(() => {
    if (expStage !== 'loaded') return;
    const el = expRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setExpParked(!entry.isIntersecting),
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [expStage]);

  const handleRotateEnd = () => {
    setExpStage((s) => (s === 'rotating' ? 'loaded' : s));
  };

  return (
    <article className={styles['case-study']}>
      <div className={styles['case-media-row']}>
        {/* 좌: 소개 영상 (YouTube) */}
        <div className={cx(styles['case-media'], styles['case-media--video'])}>
          {videoPlaying && videoUrl ? (
            <iframe
              src={buildAutoplaySrc(videoUrl)}
              title={label}
              loading="lazy"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : videoUrl ? (
            <button
              type="button"
              className={cx(styles['case-poster'], 'case-poster--video')}
              style={videoPoster ? { backgroundImage: `url(${videoPoster})` } : undefined}
              onClick={() => setVideoPlaying(true)}
              aria-label={t('videoPlay', { name: label })}
            >
              <span className={styles['case-play-btn']} aria-hidden="true">
                <Play size={26} strokeWidth={2} fill="currentColor" />
              </span>
            </button>
          ) : (
            <div className={styles['case-media-placeholder']}>
              <span className={styles['case-media-ph-label']}>Video</span>
              <span className={styles['case-media-ph-note']}>{t('phVideo')}</span>
            </div>
          )}
        </div>

        {/* 우: 인터랙티브 3D 체험 */}
        <div className={cx(styles['case-media'], styles['case-media--experience'])} ref={expRef}>
          <div className={styles['case-exp-bar']}>{t('expBar')}</div>

          {expStage === 'loaded' && experienceUrl ? (
            <div className={cx(styles['case-exp-stage'], expParked && styles['is-parked'])}>
              <iframe
                src={experienceUrl}
                title={label}
                loading="lazy"
                allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope"
                allowFullScreen
              />
            </div>
          ) : experienceUrl ? (
            <button
              type="button"
              className={cx(
                styles['case-poster'],
                styles['case-poster--exp'],
                expStage === 'rotating' && styles['is-rotating'],
              )}
              style={expPoster ? { backgroundImage: `url(${expPoster})` } : undefined}
              onClick={() => setExpStage((s) => (s === 'idle' ? 'rotating' : s))}
              onAnimationEnd={handleRotateEnd}
              disabled={expStage === 'rotating'}
              aria-label={t('expStart', { name: label })}
            >
              <span className={cx(styles['case-play-btn'], 'case-play-btn--exp')} aria-hidden="true">
                <Play size={26} strokeWidth={2} fill="currentColor" />
              </span>
            </button>
          ) : (
            <div className={styles['case-media-placeholder']}>
              <span className={styles['case-media-ph-label']}>Live 3D</span>
              <span className={styles['case-media-ph-note']}>{t('phLive')}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles['case-meta']}>
        <h3>
          {company} — {product}
        </h3>
        <p>{description}</p>
        {link ? <CaseLink value={link} /> : null}
      </div>
    </article>
  );
}

/**
 * 사례 링크 한 줄.
 * - 외부 URL(http/https): 새 탭으로 열고(`target=_blank` + `rel=noopener noreferrer`)
 *   외부 링크 아이콘을 함께 표기. (웹표준: 새 창 이동은 아이콘으로 명시)
 * - 이메일: `mailto:`로 연결하고 메일 아이콘 표기.
 */
function CaseLink({ value }: { value: string }) {
  const t = useTranslations('cases');
  const isUrl = /^https?:\/\//i.test(value);
  const isEmail = !isUrl && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (isUrl) {
    return (
      <a className={styles['case-link']} href={value} target="_blank" rel="noopener noreferrer">
        <span>{value}</span>
        <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
        <span className="sr-only">{t('newTab')}</span>
      </a>
    );
  }

  if (isEmail) {
    return (
      <a className={styles['case-link']} href={`mailto:${value}`}>
        <Mail size={14} strokeWidth={2} aria-hidden="true" />
        <span>{value}</span>
      </a>
    );
  }

  return <span className={cx(styles['case-link'], styles['case-link--plain'])}>{value}</span>;
}
