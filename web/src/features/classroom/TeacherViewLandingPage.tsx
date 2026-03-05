import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import simBg from "../../assets/DuckHospitalRoom.png";
import avatarIcon from "../../assets/GenericAvatar.png";
import { useClasses } from "../../hooks/useClasses";
import { createClass } from "../../api/classes";
import type { Class } from "../../api/classes";
import "../../styles/sim.css";
import "../../styles/classroom.css";

export const TeacherViewLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { classes: classrooms, loading: classesLoading, refetch } = useClasses();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classroomName, setClassroomName] = useState("");
  const [curriculumLevels, setCurriculumLevels] = useState<number[]>([1]);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createdClass, setCreatedClass] = useState<Class | null>(null);

  function toggleLevel(level: number) {
    setCurriculumLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level].sort((a, b) => a - b)
    );
  }

  function handleCreateClassroom() {
    setShowCreateModal(true);
    setCreatedClass(null);
    setCreateError(null);
  }

  function handleCloseModal() {
    setShowCreateModal(false);
    setClassroomName("");
    setCurriculumLevels([1]);
    setCreateError(null);
    setCreatedClass(null);
  }

  async function handleSubmitClassroom(e: React.FormEvent) {
    e.preventDefault();
    if (!classroomName.trim()) return;
    if (curriculumLevels.length === 0) return;
    setCreateLoading(true);
    setCreateError(null);
    try {
      const res = await createClass({
        name: classroomName.trim(),
        curriculum_levels: curriculumLevels,
      });
      if (res.ok && res.class) {
        setCreatedClass(res.class);
        await refetch();
      } else {
        setCreateError((res as { error?: string }).error ?? "Failed to create classroom.");
      }
    } catch {
      setCreateError("Could not reach the server.");
    } finally {
      setCreateLoading(false);
    }
  }

  function handleOpenClassroom(c: Class) {
    handleCloseModal();
    navigate(`/classroom/students?id=${c.id}`);
  }

  function handleClassroomClick(c: Class) {
    navigate(`/classroom/students?id=${c.id}`);
  }

  return (
    <div className="app-screen">
      <div
        className="app-screen-inner sim-root"
        style={{ backgroundImage: `url(${simBg})` }}
      >
        <button
          className="back-arrow sim-back"
          aria-label="Back"
          onClick={() => navigate("/landing")}
        />

        <div className="sim-toolbar">
          <div className="sim-toolbar-card">
            <img
              src={avatarIcon}
              alt="Profile"
              className="classroom-icon-img"
            />
          </div>
        </div>

        <div className="sim-landing-container">
          <h1 className="sim-landing-title">Teacher View</h1>

          <div className="sim-level-selection">
            <button
              className="sim-level-button primary create-classroom-button"
              onClick={handleCreateClassroom}
            >
              <div className="sim-level-header">
                <h2>+ New Classroom</h2>
              </div>
              <p>Create a new classroom</p>
            </button>

            {classesLoading && (
              <p className="classroom-loading">Loading classrooms…</p>
            )}
            {classrooms.map((c) => (
              <button
                key={c.id}
                className="sim-level-button available classroom-card"
                onClick={() => handleClassroomClick(c)}
              >
                <div className="sim-level-header">
                  <h2>{c.name}</h2>
                </div>
                <p className="classroom-card-code">Code: <strong>{c.join_code}</strong></p>
                <p>Levels {c.curriculum_levels.join(", ")} · View details</p>
              </button>
            ))}
          </div>
        </div>

        {showCreateModal && (
          <div className="popup-overlay" onClick={handleCloseModal}>
            <div
              className="popup-box introduction-box"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Create New Classroom</h2>
              {createdClass ? (
                <div className="classroom-created">
                  <p className="classroom-created-msg">Classroom created.</p>
                  <p className="classroom-created-code">
                    Share this code with students: <strong>{createdClass.join_code}</strong>
                  </p>
                  <button
                    type="button"
                    className="close-button"
                    onClick={() => handleOpenClassroom(createdClass)}
                  >
                    Open classroom
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitClassroom}>
                  <div style={{ marginBottom: "16px" }}>
                    <label htmlFor="classroom-name" className="classroom-modal-label">
                      Classroom name
                    </label>
                    <input
                      id="classroom-name"
                      type="text"
                      value={classroomName}
                      onChange={(e) => setClassroomName(e.target.value)}
                      placeholder="e.g. Nursing 101"
                      className="classroom-input"
                      autoFocus
                    />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <span className="classroom-modal-label">Curriculum levels</span>
                    <div className="classroom-levels-checkboxes">
                      {[1, 2, 3].map((level) => (
                        <label key={level} className="classroom-level-check">
                          <input
                            type="checkbox"
                            checked={curriculumLevels.includes(level)}
                            onChange={() => toggleLevel(level)}
                          />
                          Level {level}
                        </label>
                      ))}
                    </div>
                    <p className="classroom-levels-hint">Select at least one level students can access.</p>
                  </div>
                  {createError && <p className="classroom-modal-error" role="alert">{createError}</p>}
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <button type="button" className="close-button" onClick={handleCloseModal}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="close-button"
                      disabled={!classroomName.trim() || curriculumLevels.length === 0 || createLoading}
                    >
                      {createLoading ? "Creating…" : "Create"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
