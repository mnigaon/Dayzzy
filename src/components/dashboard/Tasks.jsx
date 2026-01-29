// src/components/dashboard/Tasks.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import { db, storage } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  getDocs,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../firebase/AuthContext";
import TaskModal from "./TaskModal";
import "./Tasks.css";
import { formatDate } from "../../utils/dateFormat";

export default function Tasks({ workspaceId = null }) {
  const { currentUser } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [workspaceMap, setWorkspaceMap] = useState({});

  /* =================================================
     ⭐ 필터/정렬 상태
  ================================================= */
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workspaceFilter, setWorkspaceFilter] = useState("all");
  const [sortType, setSortType] = useState("dueAsc");

  /* =================================================
     입력 상태
  ================================================= */
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [file, setFile] = useState(null);

  const titleRef = useRef(null); // ⭐ 자동 포커스용

  /* =================================================
     workspace 로딩
  ================================================= */
  /* =================================================
     workspace 로딩
  ================================================= */
  useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      const q = query(collection(db, "workspaces"), where("userId", "==", currentUser.uid));
      const snap = await getDocs(q);
      const map = {};
      snap.forEach((d) => (map[d.id] = d.data().name));
      setWorkspaceMap(map);
    };
    load();
  }, [currentUser]);

  /* =================================================
     실시간 tasks
  ================================================= */
  useEffect(() => {
    if (!currentUser) return;

    let q = query(
      collection(db, "tasks"),
      where("userId", "==", currentUser.uid),
      orderBy("order", "asc")
    );

    return onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((t) => (workspaceId ? t.workspaceId === workspaceId : true));

      setTasks(data);
    });
  }, [currentUser, workspaceId]);

  /* =================================================
     ⭐ 필터 + 정렬 계산 (핵심 로직)
  ================================================= */
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    /* 검색 */
    if (searchText) {
      result = result.filter((t) =>
        t.title?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    /* 상태 */
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    /* workspace */
    if (workspaceFilter !== "all") {
      if (workspaceFilter === "individual") {
        result = result.filter((t) => !t.workspaceId);
      } else {
        result = result.filter((t) => t.workspaceId === workspaceFilter);
      }
    }

    /* 정렬 */
    result.sort((a, b) => {
      const da = a.dueDate?.toDate?.()?.getTime?.() || 0;
      const db = b.dueDate?.toDate?.()?.getTime?.() || 0;

      if (sortType === "dueAsc") return da - db;
      if (sortType === "dueDesc") return db - da;
      return 0;
    });

    return result;
  }, [tasks, searchText, statusFilter, workspaceFilter, sortType]);

  /* =================================================
     Task 추가
  ================================================= */
  const handleAddTask = async () => {
    if (!newTask || !newDueDate) return;

    let fileUrl = "";
    let fileName = "";

    if (file) {
      const r = ref(
        storage,
        `tasks/${currentUser.uid}/${Date.now()}_${file.name}`
      );
      await uploadBytes(r, file);
      fileUrl = await getDownloadURL(r);
      fileName = file.name;
    }

    await addDoc(collection(db, "tasks"), {
      title: newTask,
      description: newDescription,
      dueDate: Timestamp.fromDate(new Date(newDueDate)),
      createdAt: serverTimestamp(),
      status: localStorage.getItem("tasky_defaultStatus") || "pending",
      order: Date.now(),
      userId: currentUser.uid,
      workspaceId,
      attachmentUrl: fileUrl,
      attachmentName: fileName,
    });

    /* 초기화 + 자동 포커스 */
    setNewTask("");
    setNewDescription("");
    setNewDueDate("");
    setFile(null);

    titleRef.current?.focus();
  };

  /* Enter 제출 */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (localStorage.getItem("tasky_enterSubmit") !== "false") {
      handleAddTask();
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteDoc(doc(db, "tasks", id));
  };

  /* =================================================
     UI
  ================================================= */
  return (
    <div className="tasks">

      {/* ================= 필터 바 ================= */}
      <div className="tasks-filter-bar">

        <input
          placeholder="🔍 Search title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">📝 To-do</option>
          <option value="progress">⏳ In Progress</option>
          <option value="completed">✅ Done</option>
        </select>

        <select value={workspaceFilter} onChange={(e) => setWorkspaceFilter(e.target.value)}>
          <option value="all">All Workspace</option>
          <option value="individual">👤 Individual</option>
          {Object.entries(workspaceMap).map(([id, name]) => (
            <option key={id} value={id}>📁 {name}</option>
          ))}
        </select>

        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="dueAsc">Due ↑</option>
          <option value="dueDesc">Due ↓</option>
        </select>

      </div>

      {/* ================= 입력 ================= */}
      <h3>Add New Tasks</h3>

      <form className="tasks-input" onSubmit={handleSubmit}>
        <input
          ref={titleRef}
          placeholder="Task title"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Add</button>
      </form>

      {/* ================= 리스트 ================= */}
      <h3>All Tasks</h3>

      <ul className="tasks-list">
        {filteredTasks.map((task) => {
          const header = task.workspaceId
            ? `📁 ${workspaceMap[task.workspaceId] || "Workspace"}`
            : "👤 Individual";

          return (
            <li key={task.id} onClick={() => setSelectedTask(task)}>
              <span>

                <div className="task-card-header">{header}</div>

                <div className="task-title-row">
                  <strong>{task.title}</strong>

                  <span className={`status-pill ${task.status}`}>
                    {task.status === "pending" && "Todo"}
                    {task.status === "progress" && "In Progress"}
                    {task.status === "completed" && "Done"}
                  </span>
                </div>

                {task.description && <p>{task.description}</p>}

                {formatDate(task.dueDate) && (
                  <small>Due: {formatDate(task.dueDate)}</small>
                )}

                {task.attachmentUrl && (
                  <a
                    href={task.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    📎 {task.attachmentName}
                  </a>
                )}

              </span>

              <div className="task-buttons">
                <button onClick={(e) => handleDelete(e, task.id)}>Delete</button>
              </div>
            </li>
          );
        })}
      </ul>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          currentUser={currentUser}
          workspaceMap={workspaceMap}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
