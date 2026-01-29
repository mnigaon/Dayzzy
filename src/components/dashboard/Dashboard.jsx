// src/components/dashboard/Dashboard.jsx
import { useAuth } from "../../firebase/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import "./Dashboard.css";

import DashboardHome from "./DashboardHome"; // 메인 카드 화면
import WorkspaceList from "./WorkspaceList";
import Tasks from "./Tasks";
import TimerPage from "../timer/TimerPage"; // Timer 탭
import FloatingTimer from "../timer/FloatingTimer";
// TimerProvider 제거됨
import Settings from "../settings/Settings";

import KanbanPage from "../kanban/KanbanPage"; // ⭐ 칸반




export default function Dashboard() {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  /* 🔄 탭 상태 유지 (LocalStorage) */
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("dashboard_activeTab") || "home");
  const [activeWorkspace, setActiveWorkspace] = useState(null); // 선택된 워크스페이스

  useEffect(() => {
    localStorage.setItem("dashboard_activeTab", activeTab);
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/", { replace: true });  // ⭐ 여기 추가
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };


  const renderContent = () => {
    if (activeTab === "workspace") {
      if (activeWorkspace) {
        console.log(activeWorkspace);

        return (
          <Tasks
            workspaceId={activeWorkspace.id}
            workspaceTitle={activeWorkspace.name}
          />
        );
      } else {
        return (
          <WorkspaceList
            onSelectWorkspace={(ws) => setActiveWorkspace(ws)}
          />
        );
      }
    } else if (activeTab === "tasks") {
      return <Tasks />; // Individual 자동
    } else if (activeTab === "kanban") {
      return <KanbanPage />; // ⭐ 칸반 연결
    } else if (activeTab === "timer") {
      return <TimerPage />;
    } else if (activeTab === "settings") {
      return <Settings />;
    } else if (activeTab === "home") {
      return (
        <DashboardHome
          setActiveTab={setActiveTab}
          setActiveWorkspace={setActiveWorkspace}
        />
      );
    }
    else {
      return null;
    }
  };


  return (

    <div className="dashboard">
      <aside className="sidebar">
        <h2
          className="logo"
          onClick={() => {
            setActiveTab("home");
            setActiveWorkspace(null);
          }}
        >
          TASKY
        </h2>

        <ul>
          <li
            className={activeTab === "tasks" ? "active" : ""}
            onClick={() => {
              setActiveTab("tasks");
              setActiveWorkspace(null);
            }}
          >
            Tasks
          </li>
          <li
            className={activeTab === "kanban" ? "active" : ""}
            onClick={() => {
              setActiveTab("kanban");
              setActiveWorkspace(null);
            }}
          >
            Kanban
          </li>
          <li
            className={activeTab === "workspace" ? "active" : ""}
            onClick={() => {
              setActiveTab("workspace");
              setActiveWorkspace(null);
            }}
          >
            Work Space
          </li>
          <li
            className={activeTab === "timer" ? "active" : ""}
            onClick={() => {
              setActiveTab("timer");
              setActiveWorkspace(null);
            }}
          >
            Timer
          </li>
          <li
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </li>
          <li onClick={handleLogout} className="logout-btn">
            Logout
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <h1>Welcome, {currentUser?.displayName || currentUser?.email}!</h1>
        {renderContent()}
      </main>

      {/* Timer가 실행 중이면 FloatingTimer 표시 */}
      <FloatingTimer onClick={() => setActiveTab("timer")} />
    </div>
  );

}
