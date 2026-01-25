import "./FeatureRows.css";
import feature1 from "../assets/hero-bg.jpg";
import feature2 from "../assets/hero-bg.jpg";

function FeatureRows() {
    return (
      <section className="feature-rows">
        <div className="feature-row">
          <div className="feature-block feature-text">
            <h2>Organize Your Tasks</h2>
            <p>Drag and drop tasks easily and stay on top of your schedule.</p>
            <button className="feature-button">Get Started</button>
          </div>
          <div className="feature-block feature-image">
            <img src={feature1} alt="Feature 1" />
          </div>
        </div>
  
        <div className="feature-row">
          <div className="feature-block feature-image">
            <img src={feature2} alt="Feature 2" />
          </div>
          <div className="feature-block feature-text">
            <h2>Collaborate With Your Team</h2>
            <p>Assign roles, share tasks, and track progress in real time.</p>
            <button className="feature-button">Learn More</button>
          </div>
        </div>
      </section>
    );
  }
  
  export default FeatureRows;