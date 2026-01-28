import "./TestimonialWall.css";

const testimonials = [
  {
    title: "Finally Organized",
    content: "Tasky helps me keep all my daily tasks in one place without feeling overwhelmed.",
    author: "Alice"
  },
  {
    title: "Focus Booster",
    content: "The timer keeps me focused and stops me from procrastinating.",
    author: "Bob"
  },
  {
    title: "Super Simple",
    content: "Clean design, no clutter. Exactly what a personal task app should be.",
    author: "Charlie"
  },
  {
    title: "Great for Study",
    content: "I use it every day to manage my assignments and study sessions.",
    author: "Diana"
  },
  {
    title: "My Daily Companion",
    content: "I start every morning with Tasky. It keeps my day structured.",
    author: "Ethan"
  },
  {
    title: "Love the Kanban Board",
    content: "Dragging tasks across columns feels satisfying and keeps me organized.",
    author: "Fiona"
  },
  {
    title: "Lightweight & Fast",
    content: "No complicated setup. It just works instantly.",
    author: "George"
  },
  {
    title: "Perfect for Personal Use",
    content: "Exactly what I needed to manage my life and personal goals.",
    author: "Hannah"
  }
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
    </section>
  );
}

export default TestimonialWall;
