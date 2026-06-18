import Image from 'next/image';
import type { Testimonial } from '../model/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="testimonial-card">
      <div className="quote">{testimonial.quote}</div>
      <div className="quote-author">
        <div className="author-avatar">
          <Image src={testimonial.avatar} alt={testimonial.name} fill sizes="40px" />
        </div>
        <div className="author-info">
          <div>{testimonial.name}</div>
          <div>{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}
