import { Button } from '@/shared/ui/button';
import { siteConfig } from '@/shared/config';
import { DemoRequestButton } from '@/features/demo-request';

export function Hero() {
  return (
    <section className="hero">
      <span className="section-tag">Intro</span>
      <h1 className="hero-headline">
        도면 속에 갇혀 있던 제품을,
        <br />
        손으로 만지듯 보여주세요
      </h1>
      <div className="hero-ctas">
        <DemoRequestButton variant="primary" />
        <Button href={siteConfig.servicesAnchor} variant="secondary">
          서비스 살펴보기
        </Button>
      </div>
    </section>
  );
}
