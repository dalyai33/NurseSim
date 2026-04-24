import React from "react";
import { useNavigate } from "react-router-dom";

export const LandingFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="landing-footer">
      <p className="landing-footer__left">NurseSim+ · OSU Senior Capstone 013 · 2026</p>
      <p className="landing-footer__center" />
      <div className="landing-footer__actions">
        <button
          type="button"
          className="landing-btn landing-btn--outline landing-btn--sm"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
        <button
          type="button"
          className="landing-btn landing-btn--primary landing-btn--sm"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </button>
      </div>
    </footer>
  );
};
