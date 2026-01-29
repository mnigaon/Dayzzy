import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
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

  /* =========================
     🔥 Tasks 구독 (Query 적용)
  ========================= */
  useEffect(() => {
    if (!currentUser) return;

    let q;
    if (workspaceId) {
      // 워크스페이스 모드: 해당 워크스페이스의 태스크만
      q = query(collection(db, "tasks"), where("workspaceId", "==", workspaceId));
    } else {
      // 개인 모드: 내 태스크 중 워크스페이스에 속하지 않은 것 (또는 내 전체)
      // 여기서는 "개인 보드"의 정의에 따라 다를 수 있으나, 보통 내 ID로 생성된 것만 가져옴
      q = query(collection(db, "tasks"), where("userId", "==", currentUser.uid));
    }

    const unsubscribe = onSnapshot(q, (snap) => {
      // 개인 모드일 때 workspaceId가 있는(워크스페이스 태스크) 것은 제외하고 보여줄지 여부는 기획에 따라 다름.
      // 일단 userId로 1차 필터링된 것을 가져오되, 개인 보드라면 workspaceId가 없는 것만 보여주는 것이 깔끔함.
      let data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      if (!workspaceId) {
        data = data.filter(t => !t.workspaceId); // 워크스페이스 태스크 제외
      }

      setTasks(data);
    });

    return () => unsubscribe();
  }, [currentUser, workspaceId]);

  /* =========================
     🔥 Columns 구독 (Query 적용)
  ========================= */
  useEffect(() => {
    if (!currentUser) return;

    // 컬럼은 워크스페이스별로 따로 관리되지 않고 유저별로 관리되는 구조라면 userId로 쿼리
    // 만약 워크스페이스별 컬럼을 지원한다면 workspaceId 조건 추가 필요
    // 현재 구조상 columns엔 workspaceId 필드가 없어 보이나, userId는 있음.

    // 단순화를 위해 내 컬럼만 가져옴
    const q = query(
      collection(db, "columns"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setCustomColumns(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
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

