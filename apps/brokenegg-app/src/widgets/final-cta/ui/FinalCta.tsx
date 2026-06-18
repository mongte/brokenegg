import { siteConfig } from '@/shared/config';
import { DemoRequestButton } from '@/features/demo-request';

export function FinalCta() {
  return (
    <section className="final-cta" id={siteConfig.demoAnchor.replace('#', '')}>
      <h2>
        지금 브로큰에그의
        <br />
        미래형 솔루션을 경험하세요.
      </h2>
      <DemoRequestButton
        variant="primary"
        style={{ padding: '20px 60px', fontSize: '18px' }}
      />
    </section>
  );
}
