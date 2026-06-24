'use client';

import styles from './services.module.css';
import { useState } from 'react';
import { siteConfig } from '@/shared/config';
import { ServiceCard, services } from '@/entities/service';
import { ServicePreview } from '@/features/service-preview';
import { useMediaQuery } from '@/shared/lib';

export function Services() {
  const [openCode, setOpenCode] = useState<string | null>(null);
  const activeService = services.find((s) => s.code === openCode && s.demoUrl);

  // ≤1024px: 카드가 직접 뒤집혀 콘텐츠를 노출(인라인 플립). 그 외: 하단 슬라이드 패널.
  const compact = useMediaQuery('(max-width: 1024px)');

  const toggle = (code: string) =>
    setOpenCode((prev) => (prev === code ? null : code));

  return (
    <>
      <section
        className={styles['services-grid']}
        id={siteConfig.servicesAnchor.replace('#', '')}
      >
        {services.map((service) => (
          <ServiceCard
            key={service.code}
            service={service}
            compact={compact}
            active={openCode === service.code}
            onSelect={service.demoUrl ? () => toggle(service.code) : undefined}
            onClose={() => setOpenCode(null)}
          />
        ))}
      </section>

      {!compact && (
        <ServicePreview
          open={Boolean(activeService)}
          url={activeService?.demoUrl ?? null}
          title={activeService?.name}
          kind={activeService?.previewKind}
          onClose={() => setOpenCode(null)}
        />
      )}
    </>
  );
}
