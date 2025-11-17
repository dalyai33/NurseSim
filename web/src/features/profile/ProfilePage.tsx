import React from "react";
import { useNavigate } from "react-router-dom";
import { SoftCard } from "../../components/SoftCard";
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
            </ul>
          </SoftCard>
        </div>
      </div>
    </div>
  );
};
