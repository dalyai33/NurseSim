import React from "react";
import { useNavigate } from "react-router-dom";
import simBg from "../../assets/DuckHospitalRoom.png";
// import folderImg from "../../assets/folder.png";
import avatarIcon from "../../assets/GenericAvatar.png";
// import duckImg from "../../assets/Duck.png";
import "../../styles/sim.css";

export const SimIntroductionPage: React.FC = () => {
  const navigate = useNavigate();

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

        {/* <img src={duckImg} alt="Nurse duck" className="sim-duck" /> */}
      </div>
    </div>
  );
};
