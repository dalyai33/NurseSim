import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import simBg from "../../assets/DuckHospitalRoom.png";
import avatarIcon from "../../assets/GenericAvatar.png";
import "../../styles/sim.css";
import "../../styles/classroom.css";
import { useClasses } from "../../hooks/useClasses";
import { createClass } from "../../api/classes";
import type { Class } from "../../api/classes";

export const TeacherViewLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { classes: classrooms, loading, error, refetch } = useClasses();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classroomName, setClassroomName] = useState("");
  const [curriculumLevel, setCurriculumLevel] = useState(1);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  /** After create, show this class's join code before closing. */
  const [createdClass, setCreatedClass] = useState<Class | null>(null);

  function handleCreateClassroom() {
    setShowCreateModal(true);
    setCreateError(null);
    setCreatedClass(null);
  }

  function handleCloseModal() {
    setShowCreateModal(false);
    setClassroomName("");
    setCurriculumLevel(1);
    setCreateError(null);
    setCreatedClass(null);
  }

  async function handleSubmitClassroom(e: React.FormEvent) {
    e.preventDefault();
    if (!classroomName.trim()) return;
    setCreateLoading(true);
    setCreateError(null);
    try {
      const res = await createClass({
        name: classroomName.trim(),
        curriculum_level: curriculumLevel,
      });
      if (res.ok && res.class) {
        setCreatedClass(res.class);
      } else {
        setCreateError((res as { error?: string }).error ?? "Could not create class.");
      }
    } catch {
      setCreateError("Could not reach the server.");
    } finally {
      setCreateLoading(false);
    }
  }

  function handleDoneWithJoinCode() {
    refetch();
    handleCloseModal();
    if (createdClass) {
      navigate(`/classroom/permissions?name=${encodeURIComponent(createdClass.name)}`);
    }
    setCreatedClass(null);
  }

  function copyJoinCode() {
    if (!createdClass?.join_code) return;
    navigator.clipboard.writeText(createdClass.join_code);
  }

  function handleClassroomClick(c: Class) {
    navigate(`/classroom/permissions?name=${encodeURIComponent(c.name)}`);
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

          {error && <p className="error" style={{ marginBottom: "1rem" }}>{error}</p>}
          {loading ? (
            <p>Loading classes…</p>
          ) : (
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

              {classrooms.map((c) => (
                <button
                  key={c.id}
                  className="sim-level-button available classroom-card"
                  onClick={() => handleClassroomClick(c)}
                >
                  <div className="sim-level-header">
                    <h2>{c.name}</h2>
                  </div>
                  <p>Level {c.curriculum_level} · View classroom details</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Create Classroom Modal */}
        {showCreateModal && (
          <div className="popup-overlay" onClick={createdClass ? undefined : handleCloseModal}>
            <div
              className="popup-box introduction-box"
              onClick={(e) => e.stopPropagation()}
            >
              {createdClass ? (
                <>
                  <h2>Class created</h2>
                  <p style={{ marginBottom: "8px" }}>Share this code with students to join:</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "0.1em", marginBottom: "12px" }}>
                    {createdClass.join_code}
                  </p>
                  <button
                    type="button"
                    className="close-button"
                    onClick={copyJoinCode}
                    style={{ marginBottom: "12px" }}
                  >
                    Copy code
                  </button>
                  <button
                    type="button"
                    className="close-button"
                    onClick={handleDoneWithJoinCode}
                    style={{ marginTop: "0" }}
                  >
                    Done
                  </button>
                </>
              ) : (
                <>
                  <h2>Create New Classroom</h2>
                  {createError && <p className="error" style={{ marginBottom: "12px" }}>{createError}</p>}
                  <form onSubmit={handleSubmitClassroom}>
                    <div style={{ marginBottom: "16px" }}>
                      <label htmlFor="classroom-name" style={{ display: "block", marginBottom: "8px", fontSize: "16px", color: "#333" }}>
                        Classroom name
                      </label>
                      <input
                        id="classroom-name"
                        type="text"
                        value={classroomName}
                        onChange={(e) => setClassroomName(e.target.value)}
                        placeholder="Enter classroom name"
                        className="classroom-input"
                        autoFocus
                      />
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      <label htmlFor="curriculum-level" style={{ display: "block", marginBottom: "8px", fontSize: "16px", color: "#333" }}>
                        Curriculum level
                      </label>
                      <select
                        id="curriculum-level"
                        value={curriculumLevel}
                        onChange={(e) => setCurriculumLevel(Number(e.target.value))}
                        className="classroom-input"
                        style={{ width: "100%", padding: "8px" }}
                      >
                        <option value={1}>Level 1</option>
                        <option value={2}>Level 2</option>
                        <option value={3}>Level 3</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                      <button type="button" className="close-button" onClick={handleCloseModal} style={{ marginTop: "0" }}>
                        Cancel
                      </button>
                      <button type="submit" className="close-button" style={{ marginTop: "0" }} disabled={!classroomName.trim() || createLoading}>
                        {createLoading ? "Creating…" : "Create"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
