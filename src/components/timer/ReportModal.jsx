// src/components/timer/ReportModal.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useTimer } from "../../context/TimerContext";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./ReportModal.css";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
} from "recharts";

export default function ReportModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("summary");
  const [filter, setFilter] = useState("week");
  const [rankingData, setRankingData] = useState([]);
  const { getSummaryStats, getAllFocusData, getRankingAllTime } = useTimer();

  const { totalHours, daysAccessed, streak } = getSummaryStats();
  const allData = getAllFocusData();

  const isDark = document.body.classList.contains("dark");
  const barColor = isDark ? "#F0B6B6" : "#800000";

  // =================
  // Focus Hours 차트
  // =================
  const chartData = useMemo(() => {
    const today = new Date();
    const filtered = [];

    if (filter === "week") {
      const startOfWeek = new Date();
      startOfWeek.setDate(today.getDate() - 6);
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        const dateStr = d.toISOString().slice(0, 10);
        const dataItem = allData.find(item => item.date === dateStr);
        filtered.push({
          date: d.toLocaleDateString("en-US", { weekday: "short" }),
          hours: dataItem ? (dataItem.seconds / 3600).toFixed(2) : 0,
        });
      }
    } else if (filter === "month") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      for (let i = 0; i < daysInMonth; i++) {
        const d = new Date(startOfMonth);
        d.setDate(startOfMonth.getDate() + i);
        const dateStr = d.toISOString().slice(0, 10);
        const dataItem = allData.find(item => item.date === dateStr);
        filtered.push({
          date: d.getDate().toString(),
          hours: dataItem ? (dataItem.seconds / 3600).toFixed(2) : 0,
        });
      }
    } else if (filter === "year") {
      for (let m = 0; m < 12; m++) {
        const monthStart = new Date(today.getFullYear(), m, 1);
        const monthEnd = new Date(today.getFullYear(), m + 1, 0);
        const monthStr = monthStart.toLocaleString("default", { month: "short" });
        const totalSeconds = allData
          .filter(item => {
            const d = new Date(item.date);
            return d >= monthStart && d <= monthEnd;
          })
          .reduce((sum, item) => sum + item.seconds, 0);
        filtered.push({ date: monthStr, hours: (totalSeconds / 3600).toFixed(2) });
      }
    }

    return filtered;
  }, [filter, allData]);

  // =================
  // 전체 Ranking 불러오기 (hh:mm:ss)
  // =================
  useEffect(() => {
    if (activeTab !== "ranking") return;

    const fetchRanking = async () => {
      const data = await getRankingAllTime();

      // 초 -> hh:mm:ss 변환
      const formatTime = totalSeconds => {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
        const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
      };

      const enriched = data.map(item => ({
        ...item,
        formattedTime: formatTime(item.seconds)
      }));

      setRankingData(enriched);
    };

    fetchRanking();
  }, [activeTab, getRankingAllTime]);

  return (
    <div className="report-overlay">
      <div className="report-modal">
        <div className="report-header">
          <h3>📊 Report</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>


      {/*
        <div className="report-tabs">
          <button
            className={activeTab === "summary" ? "active" : ""}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
          <button
            className={activeTab === "ranking" ? "active" : ""}
            onClick={() => setActiveTab("ranking")}
          >
            Ranking
          </button>
        </div>
      */}



        <div className="report-content">
          {activeTab === "summary" && (
            <>
              <h4>🔥 Active Summary</h4>
              <div className="summary-cards">
                <div className="summary-card">🔥 {totalHours} hrs focused</div>
                <div className="summary-card">📅 {daysAccessed} days accessed</div>
                <div className="summary-card">⚡ {streak} day streak</div>
              </div>

              <h4 style={{ marginTop: "1.5rem" }}>📈 Focus Hours</h4>
              <div className="report-filter" style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <button className={filter === "week" ? "active" : ""} onClick={() => setFilter("week")}>Week</button>
                <button className={filter === "month" ? "active" : ""} onClick={() => setFilter("month")}>Month</button>
                <button className={filter === "year" ? "active" : ""} onClick={() => setFilter("year")}>Year</button>
              </div>

              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid stroke="#eee" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="hours"
                      fill={barColor}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}



          {/*
          {activeTab === "ranking" && (
            <div className="ranking-section">
              <h4>🏆 Total Focus Time</h4>
              <ul className="ranking-list">
                {rankingData.map((item, idx) => (
                  <li key={item.userId}>
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}.`} 
                    {item.displayName} – {item.formattedTime}
                  </li>
                ))}
              </ul>
            </div>
          )}
          */}


        </div>
      </div>
    </div>
  );
}
