import "./TestimonialWall.css";

const testimonials = [
  { title: "Amazing App", content: "Tasky helped me organize my life perfectly.", author: "Alice" },
  { title: "Time Saver", content: "I can track all my projects effortlessly.", author: "Bob" },
  { title: "Great for Teams", content: "Collaboration has never been easier.", author: "Charlie" },
  { title: "User Friendly", content: "The interface is intuitive and clean.", author: "Diana" },
  { title: "Highly Recommend", content: "My productivity increased dramatically.", author: "Ethan" },
  { title: "Simple & Effective", content: "Just what I needed for my tasks.", author: "Fiona" },
  { title: "Organized Life", content: "Everything in one place, amazing!", author: "George" },
  { title: "Perfect Tool", content: "It fits perfectly for both work and personal tasks.", author: "Hannah" }
];

function TestimonialWall() {
  return (
    <section className="testimonial-wall">
    <h2 className="testimonial-header">Certified User Testimonials</h2>
      <div className="testimonial-grid">
        {testimonials.map((t, index) => (
          <div className="testimonial-card" key={index}>
            <h3>{t.title}</h3>
            <p>{t.content}</p>
            <span className="author">- {t.author}</span>
          </div>
        ))}
      </div>
      <div className="see-more">
        <button>See More</button>
      </div>
    </section>
  );
}

export default TestimonialWall;
