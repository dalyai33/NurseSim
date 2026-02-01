import React from "react";
import { useNavigate } from "react-router-dom";
import landingBg from "../../assets/MainBackground.png";
import { GradientButton } from "../../components/GradientButton";
import "../../styles/landing.css";

const USER_STORAGE_KEY = "nursesim_user";

function getStoredUser(): { teacher?: boolean } | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as { teacher?: boolean };
    return user ?? null;
  } catch {
    return null;
  }
}

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const isTeacher = Boolean(user?.teacher);

  return (
    <div className="app-screen">
      <div
        className="app-screen-inner landing-root"
        style={{ backgroundImage: `url(${landingBg})` }}
      >
        <div className="landing-overlay">
          <h1 className="landing-title">OHSU NURSE SIM+</h1>
          <div className="landing-buttons">
            <GradientButton onClick={() => navigate("/sim")}>
              Enter
            </GradientButton>
            {isTeacher && (
              <GradientButton onClick={() => navigate("/teacher")}>
                Teacher View
              </GradientButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};