// src/context/TimerContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../firebase/AuthContext";

const TimerContext = createContext();

const MODE_CONFIG = {
  pomodoro: { seconds: 1500, label: "Time to focus! 🔥" },
  short: { seconds: 300, label: "Time to break! ☕" },
  long: { seconds: 900, label: "Time to break! 🛋️" },
};

export const TimerProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [mode, setMode] = useState("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState(MODE_CONFIG.pomodoro.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);

  // =========================
  // Timer 인터벌
  // =========================
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          audioRef.current?.play();

          if (mode === "pomodoro" && currentUser) {
            const today = new Date().toISOString().slice(0, 10);
            const prevTime = Number(localStorage.getItem(`focusTime_${today}`)) || 0;
            const newTime = prevTime + MODE_CONFIG.pomodoro.seconds;
            localStorage.setItem(`focusTime_${today}`, newTime);

            // Firestore 기록
            setTimeout(async () => {
              const docRef = doc(db, "focusTimes", `${currentUser.uid}_${today}`);
              await setDoc(docRef, {
                userId: currentUser.uid,
                date: today,
                seconds: newTime
              }, { merge: true });

              const userRef = doc(db, "users", currentUser.uid);
              await setDoc(userRef, {
                displayName: currentUser.displayName || currentUser.email,
                email: currentUser.email,
                lastUpdated: new Date()
              }, { merge: true });
            }, 0);
          }

          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, mode, currentUser]);

  // =========================
  // Mode 변경
  // =========================
  const changeMode = (newMode) => {
    setMode(newMode);
    setSecondsLeft(MODE_CONFIG[newMode].seconds);
    setIsRunning(false);
  };

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => setSecondsLeft(MODE_CONFIG[mode].seconds);

  // =========================
  // Today Focus Time
  // =========================
  const getTodayFocusTime = () => {
    const today = new Date().toISOString().slice(0, 10);
    return Number(localStorage.getItem(`focusTime_${today}`)) || 0;
  };

  // =========================
  // Summary Stats
  // =========================
  const getSummaryStats = () => {
    let totalSeconds = 0;
    let daysAccessed = 0;
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const seconds = Number(localStorage.getItem(`focusTime_${dateStr}`)) || 0;
      if (seconds > 0) {
        totalSeconds += seconds;
        daysAccessed += 1;
        if (streak === i) streak += 1;
      }
    }

    return {
      totalHours: (totalSeconds / 3600).toFixed(1),
      daysAccessed,
      streak,
    };
  };

  // =========================
  // All Focus Data (차트용)
  // =========================
  const getAllFocusData = () => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const seconds = Number(localStorage.getItem(`focusTime_${dateStr}`)) || 0;
      data.push({ date: dateStr, seconds });
    }
    return data;
  };

  // =========================
  // 전체 누적 Focus Time Ranking
  // =========================
  const getRankingAllTime = async () => {
    try {
      const snapshot = await getDocs(collection(db, "focusTimes"));
      const userMap = {};

      snapshot.forEach(doc => {
        const { userId, seconds } = doc.data();
        if (!userMap[userId]) userMap[userId] = 0;
        userMap[userId] += seconds;
      });

      const rankingArray = await Promise.all(
        Object.entries(userMap).map(async ([userId, seconds]) => {
          const userSnap = await getDoc(doc(db, "users", userId));
          const displayName = userSnap.exists()
            ? userSnap.data().displayName || userSnap.data().email
            : userId;
          return { userId, displayName, seconds };
        })
      );

      return rankingArray.sort((a, b) => b.seconds - a.seconds);
    } catch (err) {
      console.error("Ranking fetch failed:", err);
      return [];
    }
  };

  // =========================
  // 기존 이번 주 Ranking도 유지
  // =========================
  const getRankingThisWeek = async () => {
    try {
      const today = new Date();
      const startOfWeek = new Date();
      startOfWeek.setDate(today.getDate() - 6);

      const snapshot = await getDocs(collection(db, "focusTimes"));
      const userMap = {};

      snapshot.forEach(doc => {
        const { date, seconds, userId } = doc.data();
        const d = new Date(date);
        if (d >= startOfWeek && d <= today) {
          if (!userMap[userId]) userMap[userId] = 0;
          userMap[userId] += seconds;
        }
      });

      const rankingArray = await Promise.all(
        Object.entries(userMap).map(async ([userId, seconds]) => {
          const userSnap = await getDoc(doc(db, "users", userId));
          const displayName = userSnap.exists() ? userSnap.data().displayName : userId;
          return { userId, displayName, seconds };
        })
      );

      return rankingArray.sort((a, b) => b.seconds - a.seconds).slice(0, 100);
    } catch (err) {
      console.error("Ranking fetch failed:", err);
      return [];
    }
  };

  return (
    <TimerContext.Provider
      value={{
        mode,
        secondsLeft,
        isRunning,
        start,
        pause,
        reset,
        changeMode,
        modeLabel: MODE_CONFIG[mode].label,
        getTodayFocusTime,
        getSummaryStats,
        getAllFocusData,
        getRankingThisWeek,
        getRankingAllTime,
      }}
    >
      {children}
      <audio ref={audioRef} src="/alarm.mp3" preload="auto" />
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
