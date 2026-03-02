import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import simBg from "../../assets/DuckHospitalRoom.png";
import "../../styles/sim.css";

export const SimLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  const [level1Score, setLevel1Score] = useState<number | null>(null);
  const [level1Completed, setLevel1Completed] = useState(false);
  const [level2Score, setLevel2Score] = useState<number | null>(null);
  const [level2Completed, setLevel2Completed] = useState(false);
  const [level3Score, setLevel3Score] = useState<number | null>(null);
  const [level3Completed, setLevel3Completed] = useState(false);

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch("http://localhost:5000/api/sim/progress", {
          credentials: "include",
        });

        if (!res.ok) {
          setTutorialCompleted(false);
          setLevel1Score(null);
          setLevel1Completed(false);
          setLevel2Score(null);
          setLevel2Completed(false);
          setLevel3Score(null);
          setLevel3Completed(false);
          return;
        }

        const data = await res.json();

        // tutorial (Sim v2 and old shape both use tutorialCompleted)
        setTutorialCompleted(Boolean(data.tutorialCompleted));

        // level1: support old (data.level1) and new (data.level1Completed)
        if (data.level1 && data.level1.completed) {
          setLevel1Completed(true);
          setLevel1Score(typeof data.level1.score === "number" ? data.level1.score : null);
        } else if (typeof data.level1Completed === "boolean") {
          setLevel1Completed(Boolean(data.level1Completed));
          setLevel1Score(typeof data.level1Score === "number" ? data.level1Score : null);
        } else {
          setLevel1Completed(false);
          setLevel1Score(null);
        }

         if (data.level2 && data.level2.completed) {
          setLevel2Completed(true);
          setLevel2Score(typeof data.level2.score === "number" ? data.level2.score : null);
        } else if (typeof data.level2Completed === "boolean") {
          setLevel2Completed(Boolean(data.level2Completed));
          setLevel2Score(typeof data.level2Score === "number" ? data.level2Score : null);
        } else {
          setLevel2Completed(false);
          setLevel2Score(null);
        }

         if (data.level3 && data.level3.completed) {
          setLevel3Completed(true);
          setLevel3Score(typeof data.level3.score === "number" ? data.level3.score : null);
        } else if (typeof data.level3Completed === "boolean") {
          setLevel3Completed(Boolean(data.level3Completed));
          setLevel3Score(typeof data.level3Score === "number" ? data.level3Score : null);
        } else {
          setLevel3Completed(false);
          setLevel3Score(null);
        }
      } catch {
        setTutorialCompleted(false);
        setLevel1Score(null);
        setLevel1Completed(false);
        setLevel2Score(null);
        setLevel2Completed(false);
        setLevel3Score(null);
        setLevel3Completed(false);
      }
    }

    loadProgress();
  }, [location.key]);

  function handleTutorialClick() {
    navigate("/sim/tutorial");
  }

  function handleLevelClick(level: number) {
    navigate(`/sim/level-${level}`);
  }

  const level1Perfect = level1Score === 100;
  const level2Perfect = level2Score === 100;
  const level3Perfect = level3Score === 100;

  return (
    <div className="app-screen">
      <div className="app-screen-inner sim-root" style={{ backgroundImage: `url(${simBg})` }}>
        <button className="back-arrow sim-back" aria-label="Back" onClick={() => navigate("/landing")} />

        <div className="sim-landing-container">
          <h1 className="sim-landing-title">NurseSim+ Curriculum</h1>

          <div className="sim-level-selection">
            <button
              className={`sim-level-button ${tutorialCompleted ? "completed" : "primary"}`}
              onClick={handleTutorialClick}
            >
              <div className="sim-level-header">
                <h2>Tutorial</h2>
                {tutorialCompleted && <span className="completed-badge">✓ Completed</span>}
              </div>
              <p>Learn how to use the NurseSim+ simulator</p>
            </button>

            <button
              className={`sim-level-button ${
                !tutorialCompleted ? "locked" : level1Completed ? (level1Perfect ? "completed" : "available") : "available"
              }`}
              onClick={() => tutorialCompleted && handleLevelClick(1)}
              disabled={!tutorialCompleted}
            >
              <div className="sim-level-header">
                <h2>Level 1 Curriculum</h2>

                {!tutorialCompleted && <span className="locked-badge">🔒 Locked</span>}

                {tutorialCompleted && level1Completed && level1Score !== null && (
                  <span className="completed-badge">
                    ✓ {level1Score}% {level1Perfect ? "🌟 Perfect!" : ""}
                  </span>
                )}
              </div>

              <p>Beginner level nursing scenarios</p>
            </button>

            <button
               className={`sim-level-button ${
                !tutorialCompleted ? "locked" : level2Completed ? (level2Perfect ? "completed" : "available") : "available"
              }`}
              onClick={() => tutorialCompleted && handleLevelClick(2)}
              disabled={!tutorialCompleted}
            >
              <div className="sim-level-header">
                <h2>Level 2 Curriculum</h2>
                {!tutorialCompleted && <span className="locked-badge">🔒 Locked</span>}
                {tutorialCompleted && level2Completed && level2Score !== null && (
                  <span className="completed-badge">
                    ✓ {level2Score}% {level2Perfect ? "🌟 Perfect!" : ""}
                  </span>
                )}
              </div>
              <p>Intermediate level nursing scenarios</p>
            </button>

            <button
               className={`sim-level-button ${
                !tutorialCompleted ? "locked" : level3Completed ? (level3Perfect ? "completed" : "available") : "available"
              }`}
              onClick={() => tutorialCompleted && handleLevelClick(3)}
              disabled={!tutorialCompleted}
            >
              <div className="sim-level-header">
                <h2>Level 3 Curriculum</h2>
                {!tutorialCompleted && <span className="locked-badge">🔒 Locked</span>}
                {tutorialCompleted && level3Completed && level3Score !== null && (
                  <span className="completed-badge">
                    ✓ {level3Score}% {level3Perfect ? "🌟 Perfect!" : ""}
                  </span>
                )}
              </div>
              <p>Advanced level nursing scenarios</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
