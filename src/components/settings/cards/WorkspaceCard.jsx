import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebase";
import { useAuth } from "../../../firebase/AuthContext";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  addDoc,
  doc,
} from "firebase/firestore";

export default function WorkspaceCard() {
  const { currentUser } = useAuth();

  const [workspaces, setWorkspaces] = useState([]);
  const [newName, setNewName] = useState("");

  /* =========================
     실시간 로드
  ========================= */
  useEffect(() => {
    if (!currentUser) return;

    const unsub = onSnapshot(collection(db, "workspaces"), (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((w) => w.userId === currentUser.uid);

      setWorkspaces(data);
    });

    return unsub;
  }, [currentUser]);

  /* =========================
     이름 수정
  ========================= */
  const updateName = async (id, name) => {
    await updateDoc(doc(db, "workspaces", id), {
      name,
    });
  };

  /* =========================
     아이콘 수정
  ========================= */
  const updateIcon = async (id, icon) => {
    await updateDoc(doc(db, "workspaces", id), {
      icon,
    });
  };

  /* =========================
     핀 토글
  ========================= */
  const togglePin = async (ws) => {
    await updateDoc(doc(db, "workspaces", ws.id), {
      pinned: !ws.pinned,
    });
  };

  /* =========================
     삭제
  ========================= */
  const removeWorkspace = async (id) => {
    if (!window.confirm("Delete Workspace? 😈")) return;
    await deleteDoc(doc(db, "workspaces", id));
  };

  /* =========================
     생성
  ========================= */
  const createWorkspace = async () => {
    if (!newName.trim()) return;

    await addDoc(collection(db, "workspaces"), {
      name: newName,
      icon: "📁",
      pinned: false,
      userId: currentUser.uid,
      createdAt: new Date(),
    });

    setNewName("");
  };

  if (!currentUser) return null;

  return (
    <div className="settings-card">
      <h3>🗂 Workspace</h3>

      {/* =========================
         목록
      ========================= */}
      {workspaces.map((ws) => (
        <div
          key={ws.id}
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          {/* 아이콘 */}
          <input
            style={{ width: 50 }}
            value={ws.icon || "📁"}
            onChange={(e) => updateIcon(ws.id, e.target.value)}
          />

          {/* 이름 */}
          <input
            value={ws.name}
            onChange={(e) => updateName(ws.id, e.target.value)}
          />

          {/* 핀 */}
          <button
            className="btn-ghost"
            onClick={() => togglePin(ws)}
          >
            {ws.pinned ? "📌" : "📍"}
          </button>

          {/* 삭제 */}
          <button
            className="btn-danger"
            onClick={() => removeWorkspace(ws.id)}
          >
            Delete
          </button>
        </div>
      ))}

      {/* =========================
         생성
      ========================= */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          placeholder="New workspace name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <button
          className="btn-primary"
          onClick={createWorkspace}
        >
          Add
        </button>
      </div>
    </div>
  );
}
