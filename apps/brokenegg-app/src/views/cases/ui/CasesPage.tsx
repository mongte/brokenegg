import { SiteHeader } from '@/widgets/site-header';
import { SiteFooter } from '@/widgets/site-footer';
import { FinalCta } from '@/widgets/final-cta';
import { CaseStudyCard, caseStudies } from '@/entities/case-study';

export function CasesPage() {
  return (
    <>
      <div className="grid-bg" />

      <div className="canvas">
        <SiteHeader />

        <section className="hero">
          <span className="section-tag">Cases</span>
          <h1 className="hero-headline">
            제품을 손으로 만지듯 보여준,
            <br />
            실제 도입 사례
          </h1>
          <p className="hero-sub">
            3D 시뮬레이션 매뉴얼 · 카탈로그가 현장에서 어떻게 쓰였는지 모았습니다.
            각 사례의 소개 영상과 인터랙티브 3D 체험을 직접 확인해 보세요.
          </p>
        </section>

        <section className="cases">
          {caseStudies.map((cs) => (
            <CaseStudyCard key={cs.id} caseStudy={cs} />
          ))}
        </section>

        <FinalCta />
        <SiteFooter />
      </div>
    </>
  );
}
