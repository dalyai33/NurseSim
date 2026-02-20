import React, {useMemo, useState} from "react";
import { useNavigate } from "react-router-dom";
import simBg from "../../assets/DuckHospitalRoom.png";
import avatarIcon from "../../assets/GenericAvatar.png";
import "../../styles/sim.css";

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

export const SimLevel3Page: React.FC = () => {
  const navigate = useNavigate();

  const [attemptId, setAttemptId] = useState<number | null>(null);

  const [step, setStep] = useState<SimStep | null>(null);
  const [pendingStep, setPendingStep] = useState<SimStep | null>(null);

  const [showIntro, setShowIntro] = useState(true);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupBody, setPopupBody] = useState("");
  const [popupMode, setPopupMode] = useState<"correct" | "incorrect" | "gameover" | "done">("correct");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [scorePercent, setScorePercent] = useState<number | null>(null);
  const [scoreBreakdown, setScoreBreakdown] = useState<{ correct: number; total: number } | null>(null);

  const choices = useMemo(() => step?.choices ?? [], [step]);

  async function startOrResumeLevel3(retake = false){
    setLoading(true);
    setErrorMsg(null);
    setScoreBreakdown(null);
    setPendingStep(null);

    try{
      const res = await fetch("http://localhost:5000/api/sim/level3/start",{
        method: "POST",
        credentials: "include",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({retake})
      });
      if(!res.ok) throw new Error("Failed to start level 3 attempt: " + res.statusText);
      const data: StartResponse = await res.json();
      setAttemptId(data.attempt_id);
      setStep(data.step);
    } catch(e){
      console.error(e);
      setErrorMsg("Could not start level 3. Is the backend running?");
    } finally{
      setLoading(false);
    }
  }

  async function submitAnswer(selectedIndex: number){
    if(!attemptId || !step) return;

    setSubmitting(true);
    setErrorMsg(null);

    try{
      const res = await fetch(`http://localhost:5000/api/sim/attempts/${attemptId}/answer`, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          step_id: step.step_id,
          selected_index: selectedIndex
      }),
    });
      if(!res.ok) throw new Error(`Answer failed (${res.status})`);

      const data: AnswerResponse = await res.json();

      if(data.game_over){
        setPopupMode("gameover");
        setPopupTitle("GAME OVER");
      }
      else if (data.completed){
        setPopupMode("done");
        setPopupTitle("Level 3 Complete 🎉");
      }
      else if(data.is_correct){
        setPopupMode("correct");
        setPopupTitle("Correct ✅");
      }
      else{
        setPopupMode("incorrect");
        setPopupTitle("Incorrect ❌");
      }

      setPopupBody(data.feedback || "");
      setPopupOpen(true);

      if(data.completed){
        setStep(null);
        setPendingStep(null);

        if(typeof data.score_percent === "number") setScorePercent(data.score_percent);
        if(typeof data.correct === "number" && typeof data.total === "number"){
          setScoreBreakdown({correct: data.correct, total: data.total});
        }
        return;
      }

      //Advance only if correct and backend has given the next step
      if(data.is_correct && data.next_step){
        setPendingStep(data.next_step);
      }else{
        setPendingStep(null);
      }
    }catch(e){
      console.error(e);
      setErrorMsg("Failed to submit answer. Check backend logs.");
    } finally{
      setSubmitting(false);
    }
  }

  function handleStart(){
    setShowIntro(false);
    startOrResumeLevel3(false);
  }

  function handleExit(){
    navigate("/sim");
  }

  function closePopup(){
    setPopupOpen(false);
    //Advance only after closing popup and only if next step exists
    if(pendingStep){
      setStep(pendingStep);
      setPendingStep(null);
    }
  }


  return (
    <div className="app-screen">
      <div
        className="app-screen-inner sim-root"
        style={{ backgroundImage: `url(${simBg})` }}
      >
        {/* Intro */}
        {showIntro && (
          <div className="popup-overlay">
            <div className="popup-box introduction-box">
              <h2>Level 3 - Running the Room, Running the System</h2>
              <p>This will show the full scenario narrative and track your score.</p>
              <button className="close-button" onClick={handleStart}>
                Start Level 3
              </button>
              <button className="close-button" onClick={handleExit}>
                Exit
              </button>
            </div>
          </div>
        )}

        {/* Feedback popup */}
        {popupOpen && (
          <div className="popup-overlay">
            <div
              className={`popup-box ${
              popupMode === "correct"
                ? "success-box"
                : popupMode === "incorrect"
                ? "incorrect-box"
                : "introduction-box"
              }`}
            >
              <h2>{popupTitle}</h2>
             
              {/* Preserve formatting */}
              <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>{popupBody}</pre>

              {popupMode === "gameover" ? (
                <button className="close-button" onClick={handleExit}>
                  Return to curriculum
                </button>
              ) : (
                <button className="close-button" onClick={closePopup}>
                  {popupMode === "done" ? "Close" : "Continue"}
                </button>
              )} 
            </div>
          </div>
        )}

        <button className="back-arrow sim-back" onClick={() => navigate("/sim")} />
        
        <div className="sim-toolbar">
          <div className="sim-toolbar-card">
            <img src={avatarIcon} alt="Profile" className="classroom-icon-img" />
          </div>
        </div>

        {!showIntro && (
          <div className="quiz-popup">
            {loading && <p>Loading Level 3...</p>}
            {errorMsg && <p style={{color:"red"}}>{errorMsg}</p>}

            {!loading && !errorMsg && step && (
              <>
                {/* Narrative */}
                {step.title && <h2 style={{marginTop:0}} >{step.title}</h2>}
                {step.body_text && ( 
                  <pre style={{whiteSpace:"pre-wrap", textAlign:"left", marginBottom:16}}>
                    {step.body_text}
                  </pre>
                )}

                {/* Prompt */}
                <h1 className="question">{`Step ${step.step_number}`}</h1>
                <p>{step.prompt_text}</p>

                <ol>
                  {choices.map((c, idx) => (
                    <li className="answer" key={`${step.step_id}-${idx}`}>
                      <button onClick={()=> submitAnswer(idx)} disabled={submitting || popupOpen}>
                        {c}
                      </button>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {!loading && !errorMsg && !step && (
              <div>
                <h1 className="sim-coming-soon-title">Level 3 Complete 🎉</h1>

                {scorePercent !== null ? (
                  <>
                    <p className="sim-coming-soon-message">Score: {scorePercent}%</p>
                    {scoreBreakdown && (
                      <p className="sim-coming-soon-message">
                        ({scoreBreakdown.correct} / {scoreBreakdown.total} correct)
                      </p>
                    )}
                    <button className="close-button" onClick={()=> startOrResumeLevel3(true)}>
                      Retake Level 3
                    </button>
                  </>
                ):(
                  <p className="sim-coming-soon-message"> Your progress has been saved.</p>
                )}

                <button className="close-button" onClick={handleExit}>
                  Return to curriculum
                </button>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

