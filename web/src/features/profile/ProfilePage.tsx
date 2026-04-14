import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SoftCard } from "../../components/SoftCard";
import { apiFetch } from "../../lib/api";
import "../../styles/profile.css";

const SETTINGS_ITEMS = [
  "Devices",
  "Notifications",
  "Appearance",
  "Language",
  "Privacy & Security",
  "Storage",
];

interface UserInfo {
  first_name: string;
  last_name: string;
  student_id: string;
  email: string;
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    apiFetch<{ ok: boolean; user: UserInfo }>("/api/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => {/* silently fail; name stays empty */});
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await apiFetch("/api/logout", { method: "POST" });
    } catch {
      // session is cleared server-side regardless; proceed to login
    } finally {
      navigate("/login");
    }
  }

  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : "";
  const handle = user ? `@${user.email.split("@")[0]}` : "";
  const initials = user
    ? ((user.first_name?.charAt(0) ?? "") + (user.last_name?.charAt(0) ?? "")).toUpperCase()
    : "";

  return (
    <div className="app-screen">
      <div className="app-screen-inner profile-root">
        {/* back arrow */}
        <button
          className="back-arrow profile-back"
          onClick={() => navigate(-1)}
          aria-label="Back"
        />

        <div className="profile-content">
          {/* avatar */}
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              <span className="profile-avatar-initials">{initials}</span>
              <button className="profile-edit-badge" aria-label="Edit profile">
                ✎
              </button>
            </div>
            <div className="profile-name-block">
              <div className="profile-name">{fullName || "\u00A0"}</div>
              <div className="profile-handle">{handle || "\u00A0"}</div>
            </div>
          </div>

          {/* settings card */}
          <SoftCard className="profile-settings-card">
            <ul className="profile-settings-list">
              {SETTINGS_ITEMS.map((item) => (
                <li key={item} className="profile-settings-item">
                  <span>{item}</span>
                  <span className="profile-settings-chevron">›</span>
                </li>
              ))}
              <li className="profile-settings-item profile-settings-item--logout">
                <button
                  className="profile-logout-btn"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? "Logging out…" : "Log Out"}
                </button>
              </li>
            </ul>
          </SoftCard>
        </div>
      </div>
    </div>
  );
};
