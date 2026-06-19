'use client';

import { useState } from 'react';
import { siteConfig } from '@/shared/config';
import { ServiceCard, services } from '@/entities/service';
import { ServicePreview } from '@/features/service-preview';

export function Services() {
  const [openCode, setOpenCode] = useState<string | null>(null);
  const activeService = services.find((s) => s.code === openCode && s.demoUrl);

  const toggle = (code: string) =>
    setOpenCode((prev) => (prev === code ? null : code));

  return (
    <>
      <section
        className="services-grid"
        id={siteConfig.servicesAnchor.replace('#', '')}
      >
        {services.map((service) => (
          <ServiceCard
            key={service.code}
            service={service}
            active={openCode === service.code}
            onSelect={service.demoUrl ? () => toggle(service.code) : undefined}
          />
        ))}
      </section>

      <ServicePreview
        open={Boolean(activeService)}
        url={activeService?.demoUrl ?? null}
        title={activeService?.name}
        kind={activeService?.previewKind}
        onClose={() => setOpenCode(null)}
      />
    </>
  );
}
