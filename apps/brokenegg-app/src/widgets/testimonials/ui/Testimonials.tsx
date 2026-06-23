import styles from './testimonials.module.css';
import { TestimonialCard, testimonials } from '@/entities/testimonial';

export function Testimonials() {
  return (
    <section className={styles['testimonials']}>
      <div className={styles['testimonial-track']}>
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
}
