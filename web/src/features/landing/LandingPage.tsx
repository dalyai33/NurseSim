import React from "react";
import { useNavigate } from "react-router-dom";
import landingBg from "../../assets/MainBackground.png";
import { GradientButton } from "../../components/GradientButton";
import "../../styles/landing.css";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

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
            <GradientButton onClick={() => navigate("/classroom/permissions")}>
              Teacher View
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  );
};