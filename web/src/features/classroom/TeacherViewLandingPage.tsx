import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import simBg from "../../assets/DuckHospitalRoom.png";
import avatarIcon from "../../assets/GenericAvatar.png";
import "../../styles/sim.css";
import "../../styles/classroom.css";

const CLASSROOMS_STORAGE_KEY = "nursesim_classrooms";
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

// Initial default classroom
const DEFAULT_CLASSROOMS = [
  { id: "1", name: "Kirsten's Class" },
];

export const TeacherViewLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classroomName, setClassroomName] = useState("");
  const [classrooms, setClassrooms] = useState(DEFAULT_CLASSROOMS);

  // Redirect non-teachers to landing
  useEffect(() => {
    const user = getStoredUser();
    if (!user || !user.teacher) {
      navigate("/landing", { replace: true });
    }
  }, [navigate]);

  // Load classrooms from localStorage on mount
  useEffect(() => {
    const savedClassrooms = localStorage.getItem(CLASSROOMS_STORAGE_KEY);
    if (savedClassrooms) {
      try {
        const parsed = JSON.parse(savedClassrooms);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setClassrooms(parsed);
        } else {
          // If saved data is invalid, initialize with defaults
          localStorage.setItem(CLASSROOMS_STORAGE_KEY, JSON.stringify(DEFAULT_CLASSROOMS));
        }
      } catch (error) {
        console.error("Error loading classrooms from localStorage:", error);
        // Initialize with defaults on error
        localStorage.setItem(CLASSROOMS_STORAGE_KEY, JSON.stringify(DEFAULT_CLASSROOMS));
      }
    } else {
      // First time - initialize localStorage with default classroom
      localStorage.setItem(CLASSROOMS_STORAGE_KEY, JSON.stringify(DEFAULT_CLASSROOMS));
    }
  }, []);

  function handleCreateClassroom() {
    setShowCreateModal(true);
  }

  function handleCloseModal() {
    setShowCreateModal(false);
    setClassroomName("");
  }

  function handleSubmitClassroom(e: React.FormEvent) {
    e.preventDefault();
    if (classroomName.trim()) {
      // Create new classroom
      const newClassroom = {
        id: Date.now().toString(),
        name: classroomName.trim(),
      };
      const updatedClassrooms = [...classrooms, newClassroom];
      setClassrooms(updatedClassrooms);
      
      // Save to localStorage
      localStorage.setItem(CLASSROOMS_STORAGE_KEY, JSON.stringify(updatedClassrooms));
      
      handleCloseModal();
      // Navigate to permissions page for the new classroom
      navigate(`/classroom/permissions?name=${encodeURIComponent(newClassroom.name)}`);
    }
  }

  function handleClassroomClick(classroomName: string) {
    navigate(`/classroom/permissions?name=${encodeURIComponent(classroomName)}`);
  }

  function handleDeleteClassroom(e: React.MouseEvent, classroomId: string) {
    e.stopPropagation(); // Prevent card click from firing
    
    if (window.confirm("Are you sure you want to delete this classroom?")) {
      const updatedClassrooms = classrooms.filter((c) => c.id !== classroomId);
      setClassrooms(updatedClassrooms);
      
      // Update localStorage
      localStorage.setItem(CLASSROOMS_STORAGE_KEY, JSON.stringify(updatedClassrooms));
    }
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
            {/* Plus button to create new classroom */}
            <button
              className="sim-level-button primary create-classroom-button"
              onClick={handleCreateClassroom}
            >
              <div className="sim-level-header">
                <h2>+ New Classroom</h2>
              </div>
              <p>Create a new classroom</p>
            </button>

            {/* Existing classrooms */}
            {classrooms.map((classroom) => (
              <button
                key={classroom.id}
                className="sim-level-button available classroom-card"
                onClick={() => handleClassroomClick(classroom.name)}
                style={{ position: "relative" }}
              >
                <button
                  className="classroom-delete-button"
                  onClick={(e) => handleDeleteClassroom(e, classroom.id)}
                  aria-label="Delete classroom"
                  title="Delete classroom"
                >
                  <span className="delete-x">×</span>
                </button>
                <div className="sim-level-header">
                  <h2>{classroom.name}</h2>
                </div>
                <p>View classroom details</p>
              </button>
            ))}
          </div>
        </div>

        {/* Create Classroom Modal */}
        {showCreateModal && (
          <div className="popup-overlay" onClick={handleCloseModal}>
            <div
              className="popup-box introduction-box"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Create New Classroom</h2>
              <form onSubmit={handleSubmitClassroom}>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    htmlFor="classroom-name"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "16px",
                      color: "#333",
                    }}
                  >
                    Classroom Name:
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
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center",
                  }}
                >
                  <button
                    type="button"
                    className="close-button"
                    onClick={handleCloseModal}
                    style={{ marginTop: "0" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="close-button"
                    style={{ marginTop: "0" }}
                    disabled={!classroomName.trim()}
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
