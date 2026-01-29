import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClassroomShell } from "./ClassroomShell";
import { SoftCard } from "../../components/SoftCard";
import "../../styles/classroom.css";

export const ClassroomPermissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classroomName = searchParams.get("name") || "KIRSTEN";

  return (
    <ClassroomShell>
      <header className="classroom-header">
          {/* back arrow */}
        <button
          className="back-arrow"
          onClick={() => navigate("/teacher")}
          aria-label="Back"
        />
        <span className="classroom-label">Classroom Name:</span>
        <div className="classroom-name-pill">{classroomName}</div>
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
            onClick={() => navigate(`/classroom/students?name=${encodeURIComponent(classroomName)}`)}
          >
            Save
          </button>
        </div>
      </SoftCard>
    </ClassroomShell>
  );
};