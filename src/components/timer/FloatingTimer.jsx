// src/components/timer/FloatingTimer.jsx
import React from "react";
import { useTimer } from "../../context/TimerContext";
import "./FloatingTimer.css";

export default function FloatingTimer({ onClick }) {
  const { isRunning } = useTimer();

  if (!isRunning) return null;

  return (
    <div className="floating-timer" onClick={onClick}>
      ⏱️
    </div>
  );
}


