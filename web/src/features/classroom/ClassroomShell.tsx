import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import duckImg from "../../assets/Duck.png";
import "../../styles/classroom.css";

const USER_STORAGE_KEY = "nursesim_user";

function getStoredUser(): { teacher?: boolean } | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as { teacher?: boolean };
    return user ?? null;
  } catch {
    return null;
  }
}

interface ClassroomShellProps {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

export const ClassroomShell: React.FC<ClassroomShellProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getStoredUser();
    if (!user || !user.teacher) {
      navigate("/landing", { replace: true });
    }
  }, [navigate]);

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