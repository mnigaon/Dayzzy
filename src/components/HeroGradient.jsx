import { useNavigate } from "react-router-dom";
import "./HeroGradient.css";

function HeroGradient() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth/register");
  };

  return (
    <section className="hero-gradient">
      <div className="hero-gradient-content">
        <span className="eyebrow-text">Join over 100,000 companies</span>
        <h2 className="hero-gradient-title">Take Your Productivity to the Next Level</h2>
        <div className="hero-gradient-buttons">
          <button className="hero-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroGradient;
