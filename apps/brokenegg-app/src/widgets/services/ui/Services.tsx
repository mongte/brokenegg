import { siteConfig } from '@/shared/config';
import { ServiceCard, services } from '@/entities/service';

export function Services() {
  return (
    <section className="services-grid" id={siteConfig.servicesAnchor.replace('#', '')}>
      {services.map((service) => (
        <ServiceCard key={service.code} service={service} />
      ))}
    </section>
  );
}
