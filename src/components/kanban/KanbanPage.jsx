import { useState, useEffect } from "react";
import { doc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../firebase/AuthContext";
import KanbanBoard from "./KanbanBoard";
import TaskModal from "../dashboard/TaskModal";
import "./KanbanPage.css";

export default function KanbanPage({ workspaceId = null }) {
  const { currentUser } = useAuth();

  const [selectedTask, setSelectedTask] = useState(null);

  /* ✅ workspace 이름 매핑 */
  const [workspaceMap, setWorkspaceMap] = useState({});

  /* =========================
     workspace 목록 로딩
  ========================= */
  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, "workspaces"), where("userId", "==", currentUser.uid));
      const snap = await getDocs(q);
      const map = {};

      snap.forEach((d) => {
        map[d.id] = d.data().name;
      });

      setWorkspaceMap(map);
    };

    load();
  }, []);

  /* =========================
     칸반 드롭 → status 변경
  ========================= */
  const handleDropTask = async (taskId, status) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), { status });
    } catch (e) {
      console.error(e);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="kanban-page">
      <div className="kanban-header">
        <h2>{workspaceId ? "📁 Workspace Board" : "🧑 Individual Board"}</h2>
      </div>

      <KanbanBoard
        workspaceId={workspaceId}
        onSelectTask={setSelectedTask}
        onDropTask={handleDropTask}
      />

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          currentUser={currentUser}
          /* ✅ ⭐ 여기 핵심 수정 */
          workspaceTitle={
            selectedTask.workspaceId
              ? workspaceMap[selectedTask.workspaceId] || "Workspace"
              : "Individual"
          }
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

