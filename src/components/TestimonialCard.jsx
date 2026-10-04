import { Quote, Star } from "lucide-react";

function TestimonialCard({ quote, name, context }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-quote-icon">
        <Quote />
      </div>

      <div className="testimonial-stars">
        {[...Array(5)].map((_, index) => (
          <Star key={index} />
        ))}
      </div>

      <p className="testimonial-text">
        “{quote}”
      </p>

      <div className="testimonial-person">
        <h3>{name}</h3>
        <span>{context}</span>
      </div>
    </div>
  );
}

export default TestimonialCard;