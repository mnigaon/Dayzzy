import "./FeatureRows.css";
import feature1 from "../assets/FeatureRow-1.png";
import feature2 from "../assets/FeatureRow-2.png";
import feature3 from "../assets/FeatureRow-3.png";
import feature4 from "../assets/FeatureRow-4.png";

function FeatureRows() {
  return (
    <section className="feature-rows">

      {/* ================= Row 1 ================= */}
      <div className="feature-row">
        <div className="feature-block feature-text">
          <h2>Organize Your Tasks Clearly</h2>
          <p>
            Create tasks, group them into workspaces, and manage everything
            visually with an intuitive Kanban board. Stay organized without the clutter.
          </p>
        </div>
        <div className="feature-block feature-image">
          <img src={feature1} alt="Task organization" />
        </div>
      </div>


      {/* ================= Row 2 ================= */}
      <div className="feature-row">
        <div className="feature-block feature-image">
          <img src={feature2} alt="Focus timer" />
        </div>
        <div className="feature-block feature-text">
          <h2>Stay Focused with Built-in Timer</h2>
          <p>
            Use the Pomodoro timer to work in distraction-free sessions,
            track your time, and build productive habits every day.
          </p>
        </div>
      </div>


      {/* ================= Row 3 ================= */}
      <div className="feature-row">
        <div className="feature-block feature-text">
          <h2>Separate Workspaces for Better Structure</h2>
          <p>
            Keep personal, study, and side projects organized with dedicated
            workspaces so nothing gets mixed up.
          </p>
        </div>
        <div className="feature-block feature-image">
          <img src={feature3} alt="Workspaces" />
        </div>
      </div>


      {/* ================= Row 4 ================= */}
      <div className="feature-row">
        <div className="feature-block feature-image">
          <img src={feature4} alt="Reports and stats" />
        </div>
        <div className="feature-block feature-text">
          <h2>Track Your Progress Over Time</h2>
          <p>
            View simple reports and statistics to see how much you’ve completed
            and build consistent productivity habits.
          </p>
        </div>
      </div>

    </section>
  );
}

export default FeatureRows;
