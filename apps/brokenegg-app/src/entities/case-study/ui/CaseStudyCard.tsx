import type { CaseStudy } from '../model/types';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const { company, product, description, link, videoUrl, experienceUrl } = caseStudy;

  return (
    <article className="case-study">
      <div className="case-media-row">
        {/* 좌: 소개 영상 (URL 추후 제공) */}
        <div className="case-media case-media--video">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              title={`${company} ${product} 영상`}
              loading="lazy"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="case-media-placeholder">
              <span className="case-play" aria-hidden="true">
                ▶
              </span>
              <span className="case-media-ph-label">Video</span>
              <span className="case-media-ph-note">URL 연결 예정</span>
            </div>
          )}
        </div>

        {/* 우: 인터랙티브 3D 체험 (URL 추후 제공) */}
        <div className="case-media case-media--experience">
          <div className="case-exp-bar">
            사진을 눌러서 BROKEN EGG의 서비스를 체험해 보세요
          </div>
          {experienceUrl ? (
            <iframe
              src={experienceUrl}
              title={`${company} ${product} 3D 체험`}
              loading="lazy"
              allow="fullscreen; xr-spatial-tracking; accelerometer; gyroscope"
              allowFullScreen
            />
          ) : (
            <div className="case-media-placeholder">
              <span className="case-media-ph-label">Live 3D</span>
              <span className="case-media-ph-note">URL 연결 예정</span>
            </div>
          )}
        </div>
      </div>

      <div className="case-meta">
        <h3>
          {company} — {product}
        </h3>
        <p>{description}</p>
        {link ? <span className="case-link">{link}</span> : null}
      </div>
    </article>
  );
}
