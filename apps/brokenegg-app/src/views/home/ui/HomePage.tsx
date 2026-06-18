import { SiteHeader } from '@/widgets/site-header';
import { Hero } from '@/widgets/hero';
import { Problems } from '@/widgets/problems';
import { Services } from '@/widgets/services';
import { Testimonials } from '@/widgets/testimonials';
import { FinalCta } from '@/widgets/final-cta';
import { SiteFooter } from '@/widgets/site-footer';

export function HomePage() {
  return (
    <>
      <div className="grid-bg" />

      <div className="canvas">
        <SiteHeader />
        <Hero />
        <Problems />
        <Services />
        <Testimonials />
        <FinalCta />
        <SiteFooter />
      </div>
    </>
  );
}
