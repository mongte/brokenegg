import { SiteHeader } from '@/widgets/site-header';
import { SiteFooter } from '@/widgets/site-footer';
import { FinalCta } from '@/widgets/final-cta';
import { UseCaseRow, useCases } from '@/entities/use-case';

export function ServicesIntroPage() {
  return (
    <>
      <div className="grid-bg" />

      <div className="canvas">
        <SiteHeader />

        <section className="hero">
          <span className="section-tag">Service</span>
          <h1 className="hero-headline">
            전시·교육·영업·발표까지,
            <br />
            3D 시뮬레이션의 활용
          </h1>
          <p className="hero-sub">
            복잡한 제품과 개념을 손으로 만지듯 보여주는 3D 시뮬레이션이 실제로 어디에
            쓰이는지 정리했습니다.
          </p>
        </section>

        <section className="use-cases">
          {useCases.map((uc) => (
            <UseCaseRow key={uc.id} useCase={uc} />
          ))}
        </section>

        <FinalCta />
        <SiteFooter />
      </div>
    </>
  );
}
