import React from "react";
import { useNavigate } from "react-router-dom";
import { ClassroomShell } from "./ClassroomShell";
import { SoftCard } from "../../components/SoftCard";
import "../../styles/classroom.css";

const STUDENTS = [
  "Kiana Shim",
  "Ian Hale",
  "Aidan Daly",
  "Nadir Isweesi",
  "Fransisco Martinez",
];

export const ClassroomStudentsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ClassroomShell>
      {/* top header */}
      <header className="classroom-header">
          {/* back arrow */}
        <button
          className="back-arrow"
          onClick={() => navigate(-1)}
          aria-label="Back"
        />
        <span className="classroom-label">Classroom Name:</span>
        <div className="classroom-name-pill">KIRSTEN</div>
      </header>

      {/* main content */}
      <section className="classroom-students-body">
        <h2 className="students-title">Student List:</h2>

        <ul className="students-list">
          {STUDENTS.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>

        {/* classroom code pill at the bottom */}
        <SoftCard className="classroom-code-pill">
          <span className="classroom-code-label">Classroom Code:</span>
          <span className="classroom-code-value">
            https://loremipsumidor
          </span>
        </SoftCard>
      </section>
    </ClassroomShell>
  );
};
