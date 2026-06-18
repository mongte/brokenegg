import Image from 'next/image';
import { Badge } from '@/shared/ui/badge';
import type { Service } from '../model/types';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="service-item">
      <Image
        src={service.image}
        alt={service.name}
        fill
        sizes="(max-width: 1024px) 100vw, 25vw"
      />
      <div className="service-overlay">
        <div className="service-meta">
          <Badge style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
            {service.code}
          </Badge>
          <span style={{ fontSize: '10px', fontWeight: 700 }}>{service.tag}</span>
        </div>
        <div className="service-info">
          <span>{service.category}</span>
          <h4>{service.name}</h4>
        </div>
      </div>
    </div>
  );
}
