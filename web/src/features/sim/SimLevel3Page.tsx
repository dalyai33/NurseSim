import React from "react";
import { useNavigate } from "react-router-dom";
import simBg from "../../assets/DuckHospitalRoom.png";
import avatarIcon from "../../assets/GenericAvatar.png";
import "../../styles/sim.css";

export const SimLevel3Page: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="app-screen">
      <div
        className="app-screen-inner sim-root"
        style={{ backgroundImage: `url(${simBg})` }}
      >
        <button className="back-arrow sim-back" onClick={() => navigate("/sim")} />
        
        <div className="sim-toolbar">
          <div className="sim-toolbar-card">
            <img
              src={avatarIcon}
              alt="Profile"
              className="classroom-icon-img"
            />
          </div>
        </div>

        <div className="sim-coming-soon-container">
          <h1 className="sim-coming-soon-title">Level 3 Curriculum</h1>
          <p className="sim-coming-soon-message">Coming Soon</p>
          <p className="sim-coming-soon-description">
            Advanced level nursing scenarios are currently under development.
          </p>
          <button className="close-button" onClick={() => navigate("/sim")}>
            Return to Curriculum
          </button>
        </div>
      </div>
    </div>
  );
};

