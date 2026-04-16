import React, { useState } from "react";
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

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

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
              <span className="profile-avatar-icon" />
              <button className="profile-edit-badge" aria-label="Edit profile">
                ✎
              </button>
            </div>
            <div className="profile-name-block">
              <div className="profile-name">Kiana Shim</div>
              <div className="profile-handle">@KianShim</div>
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
