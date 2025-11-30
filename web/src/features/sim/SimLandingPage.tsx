import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import simBg from "../../assets/DuckHospitalRoom.png";
import avatarIcon from "../../assets/GenericAvatar.png";
import "../../styles/sim.css";

const TUTORIAL_COMPLETED_KEY = "nursesim_tutorial_completed";

export const SimLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  useEffect(() => {
    // Check if tutorial has been completed
    const completed = localStorage.getItem(TUTORIAL_COMPLETED_KEY) === "true";
    setTutorialCompleted(completed);
  }, []);

  function handleTutorialClick() {
    navigate("/sim/tutorial");
  }

  function handleLevelClick(level: number) {
    // Navigate to the appropriate level
    navigate(`/sim/level-${level}`);
  }

  return (
    <div className="app-screen">
      <div
        className="app-screen-inner sim-root"
        style={{ backgroundImage: `url(${simBg})` }}
      >
        <button className="back-arrow sim-back" onClick={() => navigate(-1)} />
        
        <div className="sim-toolbar">
          <div className="sim-toolbar-card">
            <img
              src={avatarIcon}
              alt="Profile"
              className="classroom-icon-img"
            />
          </div>
        </div>

        <div className="sim-landing-container">
          <h1 className="sim-landing-title">NurseSim+ Curriculum</h1>
          
          <div className="sim-level-selection">
            {/* Tutorial - always available */}
            <button 
              className={`sim-level-button ${tutorialCompleted ? 'completed' : 'primary'}`}
              onClick={handleTutorialClick}
            >
              <div className="sim-level-header">
                <h2>Tutorial</h2>
                {tutorialCompleted && <span className="completed-badge">✓ Completed</span>}
              </div>
              <p>Learn how to use the NurseSim+ simulator</p>
            </button>

            {/* Level buttons - only available after tutorial */}
            <button
              className={`sim-level-button ${tutorialCompleted ? 'available' : 'locked'}`}
              onClick={() => tutorialCompleted && handleLevelClick(1)}
              disabled={!tutorialCompleted}
            >
              <div className="sim-level-header">
                <h2>Level 1 Curriculum</h2>
                {!tutorialCompleted && <span className="locked-badge">🔒 Locked</span>}
              </div>
              <p>Beginner level nursing scenarios</p>
            </button>

            <button
              className={`sim-level-button ${tutorialCompleted ? 'available' : 'locked'}`}
              onClick={() => tutorialCompleted && handleLevelClick(2)}
              disabled={!tutorialCompleted}
            >
              <div className="sim-level-header">
                <h2>Level 2 Curriculum</h2>
                {!tutorialCompleted && <span className="locked-badge">🔒 Locked</span>}
              </div>
              <p>Intermediate level nursing scenarios</p>
            </button>

            <button
              className={`sim-level-button ${tutorialCompleted ? 'available' : 'locked'}`}
              onClick={() => tutorialCompleted && handleLevelClick(3)}
              disabled={!tutorialCompleted}
            >
              <div className="sim-level-header">
                <h2>Level 3 Curriculum</h2>
                {!tutorialCompleted && <span className="locked-badge">🔒 Locked</span>}
              </div>
              <p>Advanced level nursing scenarios</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

