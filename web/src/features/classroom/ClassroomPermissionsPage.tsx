import React from "react";
import { useNavigate } from "react-router-dom";
import { ClassroomShell } from "./ClassroomShell";
import { SoftCard } from "../../components/SoftCard";
import "../../styles/classroom.css";

export const ClassroomPermissionsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ClassroomShell>
      <button className="back-arrow" onClick={() => navigate(-1)} aria-label="Back" />
      <header className="classroom-header">
        <span className="classroom-label">Classroom Name:</span>
        <div className="classroom-name-pill">KIRSTEN</div>
      </header>

      <SoftCard className="permissions-card">
        <h2 className="card-title">Permissions</h2>
        <ul className="permissions-list">
          <li>
            <label>
              <input type="checkbox" defaultChecked /> <span>First Year</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" defaultChecked /> <span>Second Year</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" defaultChecked /> <span>Third Year</span>
            </label>
          </li>
        </ul>
        <div className="permissions-actions">
          <button
            className="save-pill"
            type="button"
            onClick={() => navigate("/classroom/students")}
          >
            Save
          </button>
        </div>
      </SoftCard>
    </ClassroomShell>
  );
};