import React from "react";
import { useNavigate } from "react-router-dom";
import simBg from "../../assets/DuckHospitalRoom.png";
// import folderImg from "../../assets/folder.png";
import avatarIcon from "../../assets/GenericAvatar.png";
// import duckImg from "../../assets/Duck.png";
import "../../styles/sim.css";
import QuizComponent from "../../components/QuizPopUp";

export const SimIntroductionPage: React.FC = () => {
  const navigate = useNavigate();

  //Definitions for the questions and answers
  //TODO: add backend functionality to get these from database. 
  const quizQuestion: string = "What does the prefix 'hemo-' correlate with?";
  const wrongOne: string = "Liver";
  const wrongTwo: string = "Bone";
  const wrongThree: string = "Skin";
  const correctAnswer: string = "Blood";

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
            {/* <img
                src={avatarIcon}
                alt="Folder"
                className="classroom-icon-img"
            /> */}
          </div>
        </div>
        <QuizComponent question={quizQuestion} correctAnswer={correctAnswer} wrongOne = {wrongOne} wrongTwo ={wrongTwo} wrongThree = {wrongThree}/>
        {/* <img src={duckImg} alt="Nurse duck" className="sim-duck" /> */}
      </div>
    </div>

    
  );
};
