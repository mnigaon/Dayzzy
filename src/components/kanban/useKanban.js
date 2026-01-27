// src/components/kanban/KanbanPage.jsx

import { useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import KanbanBoard from "./KanbanBoard";
import TaskModal from "../dashboard/TaskModal";
import "./KanbanPage.css";

export default function KanbanPage({ workspaceId = null }) {
  const { currentUser } = useAuth();

  // 선택된 카드 → 기존 TaskModal 재사용
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div className="kanban-page">
      {/* =========================
         Header
      ========================= */}
      <div className="kanban-header">
        <h2>
          {workspaceId ? "📁 Workspace Board" : "🧑 Individual Board"}
        </h2>
      </div>

      {/* =========================
         Board
      ========================= */}
      <KanbanBoard
        workspaceId={workspaceId}
        onSelectTask={(task) => setSelectedTask(task)}
      />

      {/* =========================
         Task Modal (재사용 ⭐)
      ========================= */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          currentUser={currentUser}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
