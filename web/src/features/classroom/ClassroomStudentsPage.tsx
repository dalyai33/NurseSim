import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClassroomShell } from "./ClassroomShell";
import { SoftCard } from "../../components/SoftCard";
import { getClass, getClassStudents } from "../../api/classes";
import type { Class, ClassStudent } from "../../api/classes";
import "../../styles/classroom.css";

const STUDENTS_REFETCH_MS = 8000;

export const ClassroomStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classIdParam = searchParams.get("id");
  const classId = classIdParam ? parseInt(classIdParam, 10) : null;

  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [loading, setLoading] = useState(!!classId);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(() => {
    if (!classId || isNaN(classId)) return Promise.resolve();
    return getClassStudents(classId).then((res) => {
      if (res.ok) setStudents(res.students ?? []);
    });
  }, [classId]);

  useEffect(() => {
    if (!classId || isNaN(classId)) {
      setLoading(false);
      setClassData(null);
      setStudents([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getClass(classId), getClassStudents(classId)])
      .then(([classRes, studentsRes]) => {
        if (cancelled) return;
        if (classRes.ok && classRes.class) setClassData(classRes.class);
        else setError("Class not found.");
        if (studentsRes.ok) setStudents(studentsRes.students ?? []);
      })
      .catch(() => { if (!cancelled) setError("Could not load class."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [classId]);

  useEffect(() => {
    if (!classId || isNaN(classId)) return;
    const interval = setInterval(fetchStudents, STUDENTS_REFETCH_MS);
    return () => clearInterval(interval);
  }, [classId, fetchStudents]);

  useEffect(() => {
    const onFocus = () => { fetchStudents(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchStudents]);

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

      <section className="classroom-students-body">
        <h2 className="students-title">Student list</h2>
        {loading && students.length === 0 ? (
          <p className="students-loading">Loading…</p>
        ) : (
          <ul className="students-list">
            {students.length === 0 ? (
              <li className="students-empty">No students have joined yet. Share the join code with your class.</li>
            ) : (
              students.map((s) => (
                <li key={s.id}>
                  {s.first_name} {s.last_name}
                  {s.email && <span className="students-email"> ({s.email})</span>}
                </li>
              ))
            )}
          </ul>
        )}

        <SoftCard className="classroom-code-pill">
          <span className="classroom-code-label">Classroom code (share with students):</span>
          <span className="classroom-code-value">{classData ? classData.join_code : "—"}</span>
        </SoftCard>
      </section>
    </ClassroomShell>
  );
};
