import React from "react";
import { useNavigate } from "react-router-dom";
import simBg from "../../assets/DuckHospitalRoom.png";
// import folderImg from "../../assets/folder.png";
import avatarIcon from "../../assets/GenericAvatar.png";
// import duckImg from "../../assets/Duck.png";
import "../../styles/sim.css";
// import QuizComponent from "../../components/QuizPopUp";

import { useState } from "react";

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

  function handleWrong(){
      //show the incorrect popup
      setShowPopup(true);
  }  

  return (
    <div className="app-screen">
      <div
        className="app-screen-inner sim-root"
        style={{ backgroundImage: `url(${simBg})` }}
      >
        {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Hmm... Not quite try again!</h2>
                        <p>Psst its what flows through your veins</p>
                        <button className= "close-button" onClick={() => setShowPopup(false)}>
                            Close and try again
                        </button>
                    </div>
                </div>
            )}
        
        <button className="back-arrow sim-back" onClick={() => navigate(-1)} />
        
        <div className="sim-toolbar">
          <div className="sim-toolbar-card">
            <img
                src={avatarIcon}
                alt="Profile"
                className="classroom-icon-img"
            />
            {/* <img
                src={avatarIcon}
                alt="Folder"
                className="classroom-icon-img"
            /> */}
          </div>
        </div>
        <div className="quiz-popup">

            


            <h1 className="question">{quizQuestion}</h1>
            <ol>
                <li className="answer">
                    <button onClick={()=> navigate("/sim/page-two")}>{correctAnswer}</button>
                </li>
                <li className="answer">
                    <button onClick={handleWrong}>{wrongOne}</button>
                </li>
                <li className="answer">
                    <button onClick={handleWrong}>{wrongTwo}</button>
                </li>
                <li className="answer">
                    <button onClick={handleWrong}>{wrongThree}</button>
                </li>
            </ol>
        </div>
        {/* <img src={duckImg} alt="Nurse duck" className="sim-duck" /> */}
      </div>
    </div>

    
  );
};
