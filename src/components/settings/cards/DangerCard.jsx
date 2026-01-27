import { db, auth } from "../../../firebase/firebase";
import { useAuth } from "../../../firebase/AuthContext";
import {
  collection,
  getDocs,
  writeBatch,
  doc,
} from "firebase/firestore";
import { deleteUser } from "firebase/auth";

export default function DangerCard() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  /* =========================
     🔥 전체 Tasks 삭제
  ========================= */
  const deleteAllTasks = async () => {
    const ok = window.confirm(
      "Delete all Tasks.\nIrreversible 😈 Continue?"
    );
    if (!ok) return;

    try {
      const snap = await getDocs(collection(db, "tasks"));

      const batch = writeBatch(db);

      snap.docs.forEach((d) => {
        const data = d.data();
        if (data.userId === currentUser.uid) {
          batch.delete(doc(db, "tasks", d.id));
        }
      });

      await batch.commit();

      alert("All tasks deleted successfully 💀");
    } catch (err) {
      console.error(err);
      alert("Deletion failed");
    }
  };

  /* =========================
     🔥 계정 삭제 (전체 wipe)
  ========================= */
  const deleteAccount = async () => {
    const ok = window.confirm(
      "⚠️ Deleting your account will erase all your data.\nAre you sure you want to leave?"
    );
    if (!ok) return;

    try {
      /* 1️⃣ tasks 삭제 */
      const tasksSnap = await getDocs(collection(db, "tasks"));
      const batch = writeBatch(db);

      tasksSnap.docs.forEach((d) => {
        const data = d.data();
        if (data.userId === currentUser.uid) {
          batch.delete(doc(db, "tasks", d.id));
        }
      });

      /* 2️⃣ workspaces 삭제 */
      const wsSnap = await getDocs(collection(db, "workspaces"));

      wsSnap.docs.forEach((d) => {
        const data = d.data();
        if (data.userId === currentUser.uid) {
          batch.delete(doc(db, "workspaces", d.id));
        }
      });

      await batch.commit();

      /* 3️⃣ Firebase 계정 삭제 */
      await deleteUser(auth.currentUser);

      alert("Account deletion complete 👋");
    } catch (err) {
      console.error(err);

      if (err.code === "auth/requires-recent-login") {
        alert("For security reasons, please log in again and try once more. 🔐");
      } else {
        alert("Deletion failed");
      }
    }
  };

  return (
    <div className="settings-card" style={{ border: "1px solid #ff4d4f" }}>
      <h3 style={{ color: "#ff4d4f" }}>⚠️ Danger Zone</h3>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          className="btn-danger"
          onClick={deleteAllTasks}
        >
          Delete All Tasks
        </button>

        <button
          className="btn-danger"
          onClick={deleteAccount}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
