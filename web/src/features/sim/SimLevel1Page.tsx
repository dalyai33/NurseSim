import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import simBg from "../../assets/DuckHospitalRoom.png";
import avatarIcon from "../../assets/GenericAvatar.png";
import duckIcon from "../../assets/Duck.png";
import "../../styles/sim.css";
import ChatbotComponent from "../../components/Chatbot";

type SimStep = {
  step_id: number;
  scenario_id: number;
  step_number: number;

  title?: string;
  body_text?: string;

  prompt_text: string;
  choices: string[];
};

type StartResponse = {
  attempt_id: number;
  step: SimStep | null;
};

type AnswerResponse = {
  ok: boolean;
  completed: boolean;
  game_over: boolean;
  is_correct: boolean;
  feedback: string;

  score_percent?: number;
  correct?: number;
  total?: number;

  next_step: SimStep | null;
};

export const SimLevel1Page: React.FC = () => {
  const navigate = useNavigate();

  const [attemptId, setAttemptId] = useState<number | null>(null);

  const [step, setStep] = useState<SimStep | null>(null);
  const [pendingStep, setPendingStep] = useState<SimStep | null>(null);

  const [showIntro, setShowIntro] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupBody, setPopupBody] = useState("");
  const [popupMode, setPopupMode] = useState<
    "correct" | "incorrect" | "gameover" | "done"
  >("correct");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [scorePercent, setScorePercent] = useState<number | null>(null);
  const [scoreBreakdown, setScoreBreakdown] = useState<{
    correct: number;
    total: number;
  } | null>(null);

  const choices = useMemo(() => step?.choices ?? [], [step]);

  /* ---------- helpers ---------- */

  function cleanFeedback(raw: string): string {
    return raw.replace(/\\n/g, "\n");
  }

  function popupBoxClass(): string {
    switch (popupMode) {
      case "correct":
      case "done":
        return "popup-box success-box";
      case "incorrect":
        return "popup-box incorrect-box";
      case "gameover":
        return "popup-box gameover-box";
      default:
        return "popup-box introduction-box";
    }
  }

  function buildPopupTitle(mode: string): string {
    switch (mode) {
      case "correct":
        return "Correct!";
      case "incorrect":
        return "Hmm... Not quite, try again!";
      case "gameover":
        return "Game Over";
      case "done":
        return "Level 1 Complete!";
      default:
        return "";
    }
  }

  /** Button label for the popup */
  function popupButtonLabel(): string {
    switch (popupMode) {
      case "gameover":
        return "Return to Curriculum";
      case "done":
        return "Close";
      case "incorrect":
        return "Close and try again";
      default:
        return "Continue";
    }
  }

  /* ---------- API calls ---------- */

  async function startOrResumeLevel1(retake = false) {
    setLoading(true);
    setErrorMsg(null);
    setScorePercent(null);
    setScoreBreakdown(null);
    setPendingStep(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/sim/level1/start", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retake }),
      });

      if (!res.ok) throw new Error(`Start failed (${res.status})`);

      const data: StartResponse = await res.json();
      setAttemptId(data.attempt_id);
      setStep(data.step);
    } catch (e) {
      console.error(e);
      setErrorMsg("Could not start Level 1. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer(selectedIndex: number) {
    if (!attemptId || !step) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/sim/attempts/${attemptId}/answer`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            step_id: step.step_id,
            selected_index: selectedIndex,
          }),
        }
      );

      if (!res.ok) throw new Error(`Answer failed (${res.status})`);

      const data: AnswerResponse = await res.json();

      /* --- determine popup mode --- */
      let mode: "correct" | "incorrect" | "gameover" | "done";
      if (data.game_over) mode = "gameover";
      else if (data.completed) mode = "done";
      else if (data.is_correct) mode = "correct";
      else mode = "incorrect";

      setPopupMode(mode);
      setPopupTitle(buildPopupTitle(mode));
      setPopupBody(cleanFeedback(data.feedback || ""));
      setPopupOpen(true);

      /* --- completion scoring --- */
      if (data.completed) {
        setStep(null);
        setPendingStep(null);
        if (typeof data.score_percent === "number")
          setScorePercent(data.score_percent);
        if (
          typeof data.correct === "number" &&
          typeof data.total === "number"
        ) {
          setScoreBreakdown({ correct: data.correct, total: data.total });
        }
        return;
      }

      /* --- queue next step (advance on close) --- */
      if (data.is_correct && data.next_step) {
        setPendingStep(data.next_step);
      } else {
        setPendingStep(null);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to submit answer. Check backend logs.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------- handlers ---------- */

  function handleStart() {
    setShowIntro(false);
    startOrResumeLevel1(false);
  }

  function handleExit() {
    navigate("/sim");
  }

  function closePopup() {
    setPopupOpen(false);

    if (popupMode === "gameover") {
      handleExit();
      return;
    }

    if (pendingStep) {
      setStep(pendingStep);
      setPendingStep(null);
    }
  }

  /* ---------- render ---------- */

  return (
    <div className="app-screen">
      <div
        className="app-screen-inner sim-root"
        style={{ backgroundImage: `url(${simBg})` }}
      >
        {/* ========== Intro overlay ========== */}
        {showIntro && (
          <div className="popup-overlay">
            <div className="popup-box introduction-box">
              <h2>Level 1 — Something Doesn't Feel Right</h2>
              <p>
                This will show the full scenario narrative and track your score.
              </p>
              <button className="close-button" onClick={handleStart}>
                Start Level 1
              </button>
              <button
                className="close-button"
                onClick={handleExit}
                style={{ marginLeft: 12 }}
              >
                Exit
              </button>
            </div>
          </div>
        )}

        {/* ========== Feedback popup (correct / incorrect / done / gameover) ========== */}
        {popupOpen && (
          <div className="popup-overlay">
            <div className={popupBoxClass()}>
              <h2>{popupTitle}</h2>

              {popupBody && <p className="popup-feedback">{popupBody}</p>}

              {/* Score on completion */}
              {popupMode === "done" && scorePercent !== null && (
                <p className="popup-feedback" style={{ fontWeight: 700 }}>
                  Score: {scorePercent}%
                  {scoreBreakdown &&
                    ` (${scoreBreakdown.correct} / ${scoreBreakdown.total} correct)`}
                </p>
              )}

              <button className="close-button" onClick={closePopup}>
                {popupButtonLabel()}
              </button>
            </div>
          </div>
        )}

        {/* ========== Top-left back arrow ========== */}
        <button
          className="back-arrow sim-back"
          onClick={() => navigate("/sim")}
        />

        {/* ========== Top-right avatar card ========== */}
        <div className="sim-toolbar">
          <div className="sim-toolbar-card">
            <img
              src={avatarIcon}
              alt="Profile"
              className="classroom-icon-img"
            />
          </div>
        </div>

        {/* ========== Bottom quiz card ========== */}
        {!showIntro && (
          <div className="quiz-popup">
            {loading && <p>Loading Level 1...</p>}
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

            {!loading && !errorMsg && step && (
              <>
                {/* Narrative (title + body) */}
                {step.title && (
                  <h2 style={{ margin: "0 0 8px", color: "#5a3000" }}>
                    {step.title}
                  </h2>
                )}
                {step.body_text && (
                  <div className="quiz-narrative">{step.body_text}</div>
                )}

                <h1 className="question">{step.prompt_text}</h1>

                {/* Choices */}
                <ol>
                  {choices.map((c, idx) => (
                    <li className="answer" key={`${step.step_id}-${idx}`}>
                      <button
                        onClick={() => submitAnswer(idx)}
                        disabled={submitting || popupOpen}
                      >
                        {c}
                      </button>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {/* Completed state (no more steps) */}
            {!loading && !errorMsg && !step && (
              <div style={{ textAlign: "center" }}>
                <h1 className="question">Level 1 Complete!</h1>

                {scorePercent !== null ? (
                  <>
                    <p
                      style={{
                        fontSize: 36,
                        fontWeight: 700,
                        color: "#e3a538",
                        margin: "0 0 8px",
                      }}
                    >
                      Score: {scorePercent}%
                    </p>
                    {scoreBreakdown && (
                      <p
                        style={{
                          fontSize: 20,
                          color: "#7e410f",
                          margin: "0 0 24px",
                        }}
                      >
                        ({scoreBreakdown.correct} / {scoreBreakdown.total}{" "}
                        correct)
                      </p>
                    )}
                    <button
                      className="close-button"
                      onClick={() => startOrResumeLevel1(true)}
                    >
                      Retake Level 1
                    </button>
                  </>
                ) : (
                  <p style={{ fontSize: 20, color: "#7e410f" }}>
                    Your progress has been saved.
                  </p>
                )}

                <button
                  className="close-button"
                  onClick={handleExit}
                  style={{ marginLeft: 12 }}
                >
                  Return to Curriculum
                </button>
              </div>
            )}
          </div>
        )}
        {/* ========== Duck chatbot toggle ========== */}
        <button
          className="duck-chat-toggle"
          onClick={() => setShowChatbot(!showChatbot)}
          aria-label="Toggle help chat"
        >
          <img src={duckIcon} alt="Help" className="duck-chat-icon" />
        </button>

        {showChatbot && (
          <div className="chatbot-float">
            <ChatbotComponent />
          </div>
        )}
      </div>
    </div>
  );
};
