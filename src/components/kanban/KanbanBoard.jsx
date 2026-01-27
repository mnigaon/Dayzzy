import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../firebase/AuthContext";
import KanbanColumn from "./KanbanColumn";
import "./KanbanBoard.css";

const SYSTEM_COLUMNS = [
  { id: "pending", title: "To-Do" },
  { id: "progress", title: "In Progress" },
  { id: "completed", title: "Done" },
];

export default function KanbanBoard({
  workspaceId,
  onSelectTask,
}) {
  const { currentUser } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [customColumns, setCustomColumns] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    return onSnapshot(collection(db, "tasks"), (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    return onSnapshot(collection(db, "columns"), (snap) => {
      setCustomColumns(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [currentUser]);

  const addColumn = async () => {
    const title = prompt("컬럼 이름을 입력하세요");
  
    if (!title || !title.trim()) return;
  
    await addDoc(collection(db, "columns"), {
      title: title.trim(),
      userId: currentUser.uid,
    });
  };
  

  const deleteColumn = async (id) => {
    await deleteDoc(doc(db, "columns", id));
  };

  /* ⭐ 핵심: status 기준 필터 */
  const getTasks = (colId) =>
    tasks.filter((t) => (t.status || "pending") === colId);

  /* ⭐ 핵심: 드롭 시 status 업데이트 */
  const handleDropTask = async (taskId, status) => {
    await updateDoc(doc(db, "tasks", taskId), { status });
  };

  return (
    <div className="kanban-board">
      {SYSTEM_COLUMNS.map((col) => (
        <KanbanColumn
          key={col.id}
          title={col.title}
          status={col.id}
          tasks={getTasks(col.id)}
          onSelectTask={onSelectTask}
          onDropTask={handleDropTask}
          isSystem
        />
      ))}

      {customColumns.map((col) => (
        <KanbanColumn
          key={col.id}
          title={col.title}
          status={col.id}
          tasks={getTasks(col.id)}
          onSelectTask={onSelectTask}
          onDropTask={handleDropTask}
          onDeleteColumn={deleteColumn}
        />
      ))}

      <button className="add-column-btn" onClick={addColumn}>
        <span className="plus">＋</span>
        Add Column
      </button>
    </div>
  );
}

