import { useNavigate } from "react-router-dom";
import "./Hero.css";

function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth/register");
  };

  return (
    <section className="hero">
      <div className="hero-text">
        <h1 className="hero-title">YOUR TASK, SMARTER.</h1>
        <p className="hero-subtitle">
        From daily choreos to big projects, Tasky Keeps you focused and organized with powerful, easy-to-use tools.
        </p>
        <button className="hero-button" onClick={handleGetStarted}>
            Get Started
        </button>
      </div>
    </section>
  );
}

export default Hero;
