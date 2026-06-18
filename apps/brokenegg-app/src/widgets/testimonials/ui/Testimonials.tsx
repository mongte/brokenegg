import { TestimonialCard, testimonials } from '@/entities/testimonial';

export function Testimonials() {
  return (
    <section className="testimonials">
      <div className="testimonial-track">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
}
