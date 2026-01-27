//src/components/dashboard/TaskModal.jsx
// src/components/dashboard/TaskModal.jsx
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { db, storage } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./TaskModal.css";
import CommentEditModal from "./CommentEditModal";
import { formatDate } from "../../utils/dateFormat";


export default function TaskModal({ task, onClose, currentUser, workspaceMap, }) {
  const header = task.workspaceId
  ? workspaceMap?.[task.workspaceId] || "Workspace"
  : "Individual";
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");

  /* ⭐⭐⭐ Task 첨부파일 상태 추가 */
  const [taskFile, setTaskFile] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [file, setFile] = useState(null);
  const [editingComment, setEditingComment] = useState(null);

  /* ========================= */
  useEffect(() => {
    if (!task) return;

    setTitle(task.title || "");
    setDesc(task.description || "");
    setStatus(task.status || "pending");

    const d = task.dueDate?.toDate?.();
    if (d) setDueDate(d.toISOString().slice(0, 10));
  }, [task]);

  /* =========================
     댓글 실시간
  ========================= */
  useEffect(() => {
    if (!task) return;

    const q = query(
      collection(db, "tasks", task.id, "comments"),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snap) => {
      setComments(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.(),
        }))
      );
    });
  }, [task]);

  /* =========================
     ⭐ Task 저장 (파일 교체 포함)
  ========================= */
  const handleSave = async () => {
    let fileUrl = task.attachmentUrl || "";
    let fileName = task.attachmentName || "";

    if (taskFile) {
      const r = ref(
        storage,
        `tasks/${currentUser.uid}/${Date.now()}_${taskFile.name}`
      );

      await uploadBytes(r, taskFile);
      fileUrl = await getDownloadURL(r);
      fileName = taskFile.name;
    }

    await updateDoc(doc(db, "tasks", task.id), {
      title,
      description: desc,
      status,
      dueDate: dueDate ? Timestamp.fromDate(new Date(dueDate)) : null,
      attachmentUrl: fileUrl,
      attachmentName: fileName,
    });

    onClose();
  };

  const handleDeleteTask = async () => {
    if (!window.confirm("삭제하면 복구 없음 😈")) return;
    await deleteDoc(doc(db, "tasks", task.id));
    onClose();
  };

  /* =========================
     댓글 추가
  ========================= */
  const addComment = async () => {
    if (!newComment && !file) return;

    let fileUrl = "";
    let fileName = "";

    if (file) {
      const r = ref(
        storage,
        `comments/${currentUser.uid}/${Date.now()}_${file.name}`
      );

      await uploadBytes(r, file);
      fileUrl = await getDownloadURL(r);
      fileName = file.name;
    }

    await addDoc(collection(db, "tasks", task.id, "comments"), {
      text: newComment,
      userId: currentUser.uid,
      attachmentUrl: fileUrl,
      attachmentName: fileName,
      createdAt: serverTimestamp(),
    });

    setNewComment("");
    setFile(null);
  };

  const deleteComment = async (id) => {
    await deleteDoc(doc(db, "tasks", task.id, "comments", id));
  };

  const formatTime = (d) => (d ? d.toLocaleString() : "");
  const avatar = currentUser?.email?.[0]?.toUpperCase() || "U";

  if (!task) return null;

  return (
    <>
      {ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-x" onClick={onClose}>✕</button>
            <h2 className="modal-workspace-header">
              📁 {header}
            </h2>

            {/* =========================
               Task 영역
            ========================= */}
            <div className="task-section">
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />

              {/* ⭐ 기존 파일 표시 */}
              {task.attachmentUrl && (
                <a href={task.attachmentUrl} target="_blank" rel="noreferrer">
                  📎 {task.attachmentName}
                </a>
              )}

              {/* ⭐ 파일 교체 */}
              <input
                type="file"
                onChange={(e) => setTaskFile(e.target.files[0])}
              />

              <div className="task-actions">
                <button className="btn primary" onClick={handleSave}>Save</button>
                <button className="btn danger" onClick={handleDeleteTask}>Delete</button>
              </div>
            </div>

            <hr />

            {/* =========================
               댓글
            ========================= */}
            <h3>Comments</h3>

            <ul className="comments-list">
              {comments.map((c) => (
                <li key={c.id}>
                  <div className="avatar">{avatar}</div>

                  <div className="comment-body">
                    <div className="comment-meta">
                      {formatTime(c.createdAt)}
                    </div>

                    <p>{c.text}</p>

                    {c.attachmentUrl && (
                      <a href={c.attachmentUrl} target="_blank" rel="noreferrer">
                        📎 {c.attachmentName}
                      </a>
                    )}

                    {c.userId === currentUser.uid && (
                      <div className="comment-actions">
                        <button onClick={() => setEditingComment(c)}>✏️</button>
                        <button onClick={() => deleteComment(c.id)}>🗑</button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="add-comment">
              <input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button onClick={addComment}>Send</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {editingComment && (
        <CommentEditModal
          taskId={task.id}
          comment={editingComment}
          currentUser={currentUser}
          onClose={() => setEditingComment(null)}
        />
      )}
    </>
  );
}


