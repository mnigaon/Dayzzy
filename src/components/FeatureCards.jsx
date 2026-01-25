import "./FeatureCards.css";
import taskImg from "../assets/hero-bg.jpg";
import teamImg from "../assets/hero-bg.jpg";
import analyticsImg from "../assets/hero-bg.jpg";

function FeatureCard() {
  const cards = [
    {
      img: taskImg,
      title: "MANAGE TASKS",
      description: "Easily create, track, and organize your daily tasks efficiently.",
    },
    {
      img: teamImg,
      title: "TEAM COLLABORATION",
      description: "Collaborate with your team seamlessly and stay on top of projects.",
    },
    {
      img: analyticsImg,
      title: "INSIGHTS & ANALYTICS",
      description: "Get actionable insights from your task and project data.",
    },
  ];

  return (
    <section className="callout">
      <div className="callout-container">
        {cards.map((card, index) => (
          <div className="callout-card" key={index}>
            <img src={card.img} alt={card.title} className="card-image" />
            <h3 className="card-title">{card.title}</h3>
            <p className="card-description">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureCard;