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

        {/* 🔥 개인용 톤으로 변경 */}
        <span className="eyebrow-text">
          Simple. Personal. Focused.
        </span>

        <h2 className="hero-gradient-title">
          Organize your day and get things done with Tasky
        </h2>

        <div className="hero-gradient-buttons">
          <button className="hero-button" onClick={handleGetStarted}>
            Start Free
          </button>
        </div>

      </div>
    </section>
  );
}

export default HeroGradient;

