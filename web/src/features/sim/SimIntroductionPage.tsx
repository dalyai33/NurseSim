import React from "react";
import { useNavigate } from "react-router-dom";
import simBg from "../../assets/final_updated_hospital_bg.webp";
import duckIcon from "../../assets/full_duck.webp";
import "../../styles/sim.css";

import { useState } from "react";
import ChatbotComponent from "../../components/Chatbot";

const API_BASE = import.meta.env.VITE_API_URL;

export const SimIntroductionPage: React.FC = () => {
  const navigate = useNavigate();

  //Definitions for the questions and answers
  //TODO: add backend functionality to get these from database. 
  const quizQuestion: string = "What does the prefix 'hemo-' correlate with?";
  const wrongOne: string = "Liver";
  const wrongTwo: string = "Bone";
  const wrongThree: string = "Skin";
  const correctAnswer: string = "Blood";

   //States for the popup
  const [showPopup, setShowPopup] = useState(false);
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savingComplete, setSavingComplete] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);


  function handleWrong(){
      //show the incorrect popup
      setShowPopup(true);
  }

  async function handleCorrect() {
    setSavingComplete(true);
    setSaveError(false);

    try {
      const res = await fetch(`${API_BASE}/api/sim/tutorial/complete`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        setSaveError(true);
        setSavingComplete(false);
        return;
      }

      // Only show the success popup after the DB confirms completion
      setShowSuccess(true);
    } catch (err) {
      console.error("Tutorial complete request failed:", err);
      setSaveError(true);
    } finally {
      setSavingComplete(false);
    }
  }

  function handleStartQuiz(){
      //hide the introduction and show the quiz
      setShowIntroduction(false);
  }

  function handleExitTutorial(){
      //exit the tutorial and go back to landing page
      navigate("/sim");
  }  

  return (
    <div className="app-screen">
      <div
        className="app-screen-inner sim-root"
        style={{ backgroundImage: `url(${simBg})` }}
      >
        {showIntroduction && (
                <div className="popup-overlay">
                    <div className="popup-box introduction-box">
                        <h2>Welcome to the Nursing Sim+ Tutorial</h2>
                        <p>I'm Capstone, your own personal AI assistant!</p>
                        <p>It's time for me to teach you how to play the simulator.</p>
                        <p>Let's first start off with a question to test your knowledge!</p>
                        <button className="close-button" onClick={handleStartQuiz}>
                            Start Quiz
                        </button>
                    </div>
                </div>
            )}

        {showSuccess && (
                <div className="popup-overlay">
                    <div className="popup-box success-box">
                        <h2>Correct! 'Hemo-' relates to blood.</h2>
                        <p>Congrats! You are practically a pro now at using the NurseSim+ Simulator. We hope you enjoy your learning!</p>
                        <button className="close-button" onClick={handleExitTutorial}>
                            Back to Curriculum
                        </button>
                        <button className="close-button" onClick={() => navigate("/sim/level-1")} style={{ marginLeft: 12 }}>
                            Start Level 1
                        </button>
                    </div>
                </div>
            )}

        {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box incorrect-box">
                        <h2>Hmm... Not quite try again!</h2>
                        <p>Psst its what flows through your veins</p>
                        <button className= "close-button" onClick={() => setShowPopup(false)}>
                            Close and try again
                        </button>
                    </div>
                </div>
            )}
        
        <button className="back-arrow sim-back" aria-label="Back" onClick={() => navigate("/sim")} />

        {!showIntroduction && !showSuccess && (
        <div className="quiz-popup">

            


            <h1 className="question">{quizQuestion}</h1>
            {saveError && (
              <p style={{ color: "red", textAlign: "center" }}>
                Something went wrong saving your progress. Please try again.
              </p>
            )}
            <ol>
                <li className="answer">
                    <button onClick={handleCorrect} disabled={savingComplete}>{correctAnswer}</button>
                </li>
                <li className="answer">
                    <button onClick={handleWrong} disabled={savingComplete}>{wrongOne}</button>
                </li>
                <li className="answer">
                    <button onClick={handleWrong} disabled={savingComplete}>{wrongTwo}</button>
                </li>
                <li className="answer">
                    <button onClick={handleWrong} disabled={savingComplete}>{wrongThree}</button>
                </li>
            </ol>
            {savingComplete && <p style={{ textAlign: "center" }}>Saving your progress...</p>}
        </div>
        )}
      </div>
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
  );
};
