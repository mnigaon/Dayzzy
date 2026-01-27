// src/components/dashboard/Tasks.jsx
import { useState, useEffect } from "react";
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
  getDocs, // ⭐ 추가
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

  const [workspaceMap, setWorkspaceMap] = useState({}); // ⭐⭐⭐ 핵심

  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [file, setFile] = useState(null);

  /* =========================
     ⭐ workspace 이름 한번만 로딩
  ========================= */
  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "workspaces"));

      const map = {};
      snap.forEach((d) => {
        map[d.id] = d.data().name; // ⭐ name 사용
      });

      setWorkspaceMap(map);
    };

    load();
  }, []);



  /* =========================
     실시간 tasks
  ========================= */
  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "tasks"), orderBy("order", "asc"));

    return onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((t) => t.userId === currentUser.uid)
        .filter((t) => (workspaceId ? t.workspaceId === workspaceId : true));

      setTasks(data);
    });
  }, [currentUser, workspaceId]);

  /* =========================
     추가
  ========================= */
  const handleAddTask = async () => {
    if (!newTask || !newDueDate) return;
  
    let fileUrl = "";
    let fileName = "";
  
    /* ⭐ 파일 업로드 복구 */
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
      status: "pending",
      order: Date.now(),
      userId: currentUser.uid,
      workspaceId,
  
      /* ⭐⭐⭐ 다시 추가 */
      attachmentUrl: fileUrl,
      attachmentName: fileName,
    });
  
    setNewTask("");
    setNewDescription("");
    setNewDueDate("");
    setFile(null);
  };
  

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteDoc(doc(db, "tasks", id));
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="tasks">
      {/* ⭐ 워크스페이스 헤드라인 */}
      {workspaceId && workspaceMap[workspaceId] && (
        <h2 className="workspace-page-header">
          📁 {workspaceMap[workspaceId]}
        </h2>
      )}
      <h3>Add New Tasks</h3>
      <div className="tasks-input">
        <input
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
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      <h3>All Tasks</h3>
      <ul className="tasks-list">
        {tasks.map((task) => {
          const header = task.workspaceId
            ? workspaceMap[task.workspaceId] || "Workspace"
            : "Individual";

          return (
            <li key={task.id} onClick={() => setSelectedTask(task)}>
              <span>
                <div className="task-card-header">{header}</div>

                <strong>{task.title}</strong>

                {formatDate(task.dueDate) && (
                  <small>Due: {formatDate(task.dueDate)}</small>
                )}

                <p>{task.description}</p>
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
                <button onClick={(e) => handleDelete(e, task.id)}>
                  Delete
                </button>
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

