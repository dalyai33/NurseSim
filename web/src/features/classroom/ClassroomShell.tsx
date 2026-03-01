import React from "react";
import duckImg from "../../assets/Duck.png";
import "../../styles/classroom.css";

interface ClassroomShellProps {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

export const ClassroomShell: React.FC<ClassroomShellProps> = ({ children }) => {
  return (
    <div className="app-screen">
      <div className="app-screen-inner classroom-root">
        <div className="classroom-left">
          {children}
        </div>
        <aside className="classroom-right">
          <img src={duckImg} alt="Nurse duck" className="classroom-duck" />
        </aside>
      </div>
    </div>
  );
};