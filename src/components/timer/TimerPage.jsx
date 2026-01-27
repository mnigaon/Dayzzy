// src/components/timer/TimerPage.jsx
import React, { useEffect, useState } from "react";
import { useTimer } from "../../context/TimerContext";
import ReportModal from "./ReportModal";
import "./TimerPage.css";

export default function TimerPage() {
  const {
    mode,
    changeMode,
    secondsLeft,
    isRunning,
    start,
    pause,
    reset,
    modeLabel,
  } = useTimer();

  const [showReport, setShowReport] = useState(false);
  const [progressDeg, setProgressDeg] = useState(360);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  useEffect(() => {
    const totalSeconds =
      mode === "pomodoro" ? 1500 : mode === "short" ? 300 : 900;
    setProgressDeg((secondsLeft / totalSeconds) * 360);
  }, [secondsLeft, mode]);

  return (
    <div className="timer-page-container">
      {/* Header */}
      <div className="timer-header">
        <h2>🍅 Pomodoro Timer 🍅</h2>
        <button className="report-btn" onClick={() => setShowReport(true)}>
          📊 Report
        </button>

        <div className="timer-modes">
          <button
            className={mode === "pomodoro" ? "active" : ""}
            onClick={() => changeMode("pomodoro")}
          >
            Pomodoro
          </button>
          <button
            className={mode === "short" ? "active" : ""}
            onClick={() => changeMode("short")}
          >
            Short Break
          </button>
          <button
            className={mode === "long" ? "active" : ""}
            onClick={() => changeMode("long")}
          >
            Long Break
          </button>
        </div>
      </div>

      {/* Timer Circle */}
      <div
        className="timer-circle"
        style={{ "--progress": `${progressDeg}deg` }}
      >
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </div>

      {/* Label */}
      <p className="timer-label">{modeLabel}</p>

      {/* Controls */}
      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={start}>Start</button>
        ) : (
          <button onClick={pause}>Pause</button>
        )}
        <button onClick={reset}>Reset</button>
      </div>

      {/* Description */}
      <p className="pomodoro-sentence">
        Work quickly and efficiently.
        <br />
        Activate your brain with proven methods to <br />
        become the ultimate master of schedule management.
      </p>

      {/* Report Modal */}
      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
    </div>
  );
}
