import "./FeatureCards.css";
import Img1 from "../assets/Featurecard-1.png";
import Img2 from "../assets/Featurecard-2.png";
import Img3 from "../assets/Featurecard-3.png";

function FeatureCard() {
  const cards = [
    {
      img: Img1,
      title: "SIMPLE",
      description:
        "Clean and distraction-free design so you can focus on what matters.",
    },
    {
      img: Img2,
      title: "PERSONAL",
      description:
        "Built for individuals who want a lightweight daily task manager.",
    },
    {
      img: Img3,
      title: "DISTRACTION-FREE",
      description:
        "Stay focused with a clutter-free workspace that helps you get things done faster.",
    },
  ];

  return (
    <section className="callout">

      <h1 className="callout-header">
        Designed for focus. Built for everyday life.
      </h1>

      <p className="callout-sub">
        Tasky keeps things simple so you can plan your day, stay organized,
        and get more done without distractions.
      </p>

      <div className="callout-container">
        {cards.map((card, index) => (
          <div className="callout-card" key={index}>
            <div className="card-image">
              <img src={card.img} alt={card.title} />
            </div>
            <h3 className="card-title">{card.title}</h3>
            <p className="card-description">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureCard;
