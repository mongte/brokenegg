import { SiteHeader } from '@/widgets/site-header';
import { SiteFooter } from '@/widgets/site-footer';
import { ContactCta } from '@/widgets/contact-cta';
import { CompanyOverview } from '@/widgets/company-overview';
import { CompanyHistory } from '@/widgets/company-history';
import { Leadership } from '@/widgets/leadership';
import { PartnerMarquee } from '@/widgets/partner-marquee';

export function AboutPage() {
  return (
    <>
      <div className="grid-bg" />

      <div className="canvas">
        <SiteHeader />

        <section className="hero">
          <span className="section-tag">About</span>
          <h1 className="hero-headline">
            보이지 않던 가치를,
            <br />
            만질 수 있는 경험으로
          </h1>
          <p className="hero-sub">
            브로큰에그는 반응형 3D 시뮬레이션과 XR 기술로 제품·교육·산업안전의 경험을
            바꿉니다. 우리가 걸어온 길과 함께한 사람들을 소개합니다.
          </p>
        </section>

        <CompanyOverview />
        <CompanyHistory />
        <Leadership />

        <section className="about-partners">
          <div className="about-section-head">
            <span className="section-tag">Partners</span>
            <h2>산학협력 &amp; 지원기관</h2>
            <p>정부·창업지원기관과 학교가 브로큰에그의 성장에 함께하고 있습니다.</p>
          </div>
          <PartnerMarquee />
        </section>

        <ContactCta />
        <SiteFooter />
      </div>
    </>
  );
}
