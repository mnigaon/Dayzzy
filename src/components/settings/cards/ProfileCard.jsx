import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../firebase/AuthContext";
import { auth } from "../../../firebase/firebase";
import {
  updateProfile,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

export default function ProfileCard() {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     초기 이름 세팅
  ========================= */
  useEffect(() => {
    if (currentUser?.displayName) {
      setName(currentUser.displayName);
    }
  }, [currentUser]);

  /* =========================
     이름 변경
  ========================= */
  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);

      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      alert("Name change completed 👍");
    } catch (err) {
      console.error(err);
      alert("Change failed 😢");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     비밀번호 변경 (메일 발송)
  ========================= */
  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      alert("Password reset email sent 📬");
    } catch (err) {
      console.error(err);
      alert("Email transmission failed");
    }
  };

  /* =========================
     로그아웃
  ========================= */
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };
  

  return (
    <div className="settings-card">
      <h3>👤 Profile</h3>

      {/* 이름 */}
      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />

      {/* 이메일 (읽기 전용) */}
      <label>Email</label>
      <input value={currentUser.email} disabled />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={loading}
        >
          Save
        </button>

        <button
          className="btn-ghost"
          onClick={handlePasswordReset}
        >
          Change Password
        </button>

        <button
          className="btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
