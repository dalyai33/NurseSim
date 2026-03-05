import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClassroomShell } from "./ClassroomShell";
import { SoftCard } from "../../components/SoftCard";
import { getClass } from "../../api/classes";
import type { Class } from "../../api/classes";
import "../../styles/classroom.css";

export const ClassroomPermissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classIdParam = searchParams.get("id");
  const classId = classIdParam ? parseInt(classIdParam, 10) : null;

  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState(!!classId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classId || isNaN(classId)) {
      setLoading(false);
      setClassData(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getClass(classId)
      .then((res) => {
        if (cancelled) return;
        if (res.ok && res.class) setClassData(res.class);
        else setError("Class not found.");
      })
      .catch(() => { if (!cancelled) setError("Could not load class."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [classId]);

  if (!classIdParam || isNaN(classId as number)) {
    return (
      <ClassroomShell>
        <header className="classroom-header">
          <button className="back-arrow" onClick={() => navigate("/teacher")} aria-label="Back" />
          <p className="classroom-error">Missing class. Go back and open a classroom.</p>
        </header>
      </ClassroomShell>
    );
  }

  return (
    <ClassroomShell>
      <header className="classroom-header">
        <button className="back-arrow" onClick={() => navigate("/teacher")} aria-label="Back" />
        <span className="classroom-label">Classroom:</span>
        <div className="classroom-name-pill">{loading ? "…" : error ? error : classData?.name ?? "—"}</div>
        {classData && (
          <div className="classroom-join-code-pill">
            Join code: <strong>{classData.join_code}</strong>
          </div>
        )}
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
            onClick={() => navigate(`/classroom/students?id=${classId}`)}
          >
            View students
          </button>
        </div>
      </SoftCard>
    </ClassroomShell>
  );
};
