// src/components/dashboard/DashboardHome.jsx
import "./DashboardHome.css";
import { useTimer } from "../../context/TimerContext";
import { useState, useEffect } from "react";

export default function DashboardHome({ setActiveTab, setActiveWorkspace }) {
  const { getTodayFocusTime, mode, secondsLeft, isRunning } = useTimer();
  const [hoveredCard, setHoveredCard] = useState(null); // 'workspace' | 'focus' | null
  const [currentMinutes, setCurrentMinutes] = useState(0);
  const [currentSeconds, setCurrentSeconds] = useState(0);

  const todayFocusTime = Math.floor(getTodayFocusTime() / 60); // 분 단위
  const totalPomodoroTime = 25; // 기준 시간 (분)
  const progress = Math.min(todayFocusTime / totalPomodoroTime, 1); // 0~1

  // 타이머 카드 실시간 업데이트
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentMinutes(Math.floor(secondsLeft / 60));
        setCurrentSeconds(secondsLeft % 60);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setCurrentMinutes(Math.floor(secondsLeft / 60));
      setCurrentSeconds(secondsLeft % 60);
    }
  }, [secondsLeft, isRunning]);

  return (
    <div className="dashboard-home">
      <div className="cards">

        {/* 워크스페이스 카드 */}
        <div
          className="card workspace-card"
          onClick={() => {
            setActiveWorkspace(null);
            setActiveTab("workspace");
          }}
          onMouseEnter={() => setHoveredCard("workspace")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {hoveredCard === "workspace" ? (
            <div className="hover-text">Go to your workspace</div>
          ) : (
            <h3 className="workspace-title">👥 My Workspaces</h3>
          )}
        </div>

        {/* 오늘 집중 시간 카드 */}
        <div
          className="card focus-card"
          onClick={() => setActiveTab("timer")}
          onMouseEnter={() => setHoveredCard("focus")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {hoveredCard === "focus" ? (
            <div className="hover-text">Go to timer</div>
          ) : (
            <>
              <h3>⏱️ Today's Focus Time</h3>
              <div className="progress-ring">
                <svg viewBox="0 0 36 36">
                  <path
                    className="circle-bg"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${progress * 100}, 100`}
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="focus-time">
                  {isRunning
                    ? `${currentMinutes.toString().padStart(2, "0")}:${currentSeconds
                        .toString()
                        .padStart(2, "0")}`
                    : `${todayFocusTime} min`}
                </div>
              </div>
              <p className="mode">{mode === "work" ? "Focus Mode" : "Rest Mode"}</p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

