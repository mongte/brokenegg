import styles from './testimonials.module.css';
import { useTranslations } from 'next-intl';
import { TestimonialCard, testimonials } from '@/entities/testimonial';

export function Testimonials() {
  const t = useTranslations('testimonials');
  // 텍스트는 로케일 메시지에서, 아바타 이미지는 모델에서 가져와 순서대로 병합.
  const items = t.raw('items') as { quote: string; name: string; role: string }[];
  return (
    <section className={styles['testimonials']}>
      <div className={styles['testimonial-track']}>
        {testimonials.map((model, i) => (
          <TestimonialCard
            key={model.avatar}
            testimonial={{ ...items[i], avatar: model.avatar }}
          />
        ))}
      </div>
    </section>
  );
}
