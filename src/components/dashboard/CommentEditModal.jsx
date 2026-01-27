// src/components/dashboard/CommentEditModal.jsx

import { useState } from "react";
import ReactDOM from "react-dom";
import { db, storage } from "../../firebase/firebase";
import {
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./TaskModal.css";

export default function CommentEditModal({
  taskId,
  comment,
  currentUser,
  onClose,
}) {
  const [text, setText] = useState(comment.text);

  /* ⭐ 파일 상태 */
  const [file, setFile] = useState(null);
  const [removeOldFile, setRemoveOldFile] = useState(false);

  /* =========================
     저장
  ========================= */
  const handleSave = async () => {
    let fileUrl = comment.attachmentUrl || "";
    let fileName = comment.attachmentName || "";

    /* ⭐ 기존 파일 삭제 체크 */
    if (removeOldFile) {
      fileUrl = "";
      fileName = "";
    }

    /* ⭐ 새 파일 업로드 시 교체 */
    if (file) {
      const r = ref(
        storage,
        `comments/${currentUser.uid}/${Date.now()}_${file.name}`
      );

      await uploadBytes(r, file);
      fileUrl = await getDownloadURL(r);
      fileName = file.name;
    }

    await updateDoc(
      doc(db, "tasks", taskId, "comments", comment.id),
      {
        text,
        attachmentUrl: fileUrl,
        attachmentName: fileName,
      }
    );

    onClose();
  };

  /* =========================
     삭제
  ========================= */
  const handleDelete = async () => {
    if (!window.confirm("Would you like to delete this comment?")) return;

    await deleteDoc(doc(db, "tasks", taskId, "comments", comment.id));
    onClose();
  };

  /* =========================
     Enter = Save
  ========================= */
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Edit Comment</h3>

        {/* 텍스트 */}
        <textarea
          value={text}
          rows={4}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
        />

        {/* =========================
           기존 파일 표시
        ========================= */}
        {comment.attachmentUrl && !removeOldFile && (
          <div style={{ marginBottom: 8 }}>
            <a
              href={comment.attachmentUrl}
              target="_blank"
              rel="noreferrer"
            >
              📎 {comment.attachmentName}
            </a>

            {/* ⭐ 파일 제거 버튼 */}
            <button
              className="btn ghost"
              style={{ marginLeft: 8 }}
              onClick={() => setRemoveOldFile(true)}
            >
              Remove
            </button>
          </div>
        )}

        {/* =========================
           새 파일 선택
        ========================= */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* ⭐ 선택 파일 이름 표시 */}
        {file && (
          <div style={{ fontSize: 12, marginTop: 6 }}>
            Selected: {file.name}
          </div>
        )}

        {/* =========================
           버튼
        ========================= */}
        <div className="modal-actions">
          <button className="btn primary" onClick={handleSave}>
            Save
          </button>

          <button className="btn danger" onClick={handleDelete}>
            Delete
          </button>

          <button className="btn ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
