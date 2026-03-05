import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMyClass } from "../../hooks/useClasses";
import { useMe } from "../../hooks/useMe";

type Props = {
  level: 1 | 2 | 3;
  children: React.ReactNode;
};

/**
 * Teachers: can access any level. Students: only if their class's curriculum_levels includes this level.
 * Students with no class are redirected to /landing.
 */
export const SimLevelGuard: React.FC<Props> = ({ level, children }) => {
  const navigate = useNavigate();
  const { user: me, loading: meLoading } = useMe();
  const { class: myClass, loading: classLoading } = useMyClass();
  const loading = meLoading || classLoading;
  const isTeacher = Boolean(me?.teacher);
  const allowedLevels = useMemo(
    () => (isTeacher ? [1, 2, 3] : (myClass?.curriculum_levels ?? [])),
    [isTeacher, myClass]
  );

  useEffect(() => {
    if (loading) return;
    if (isTeacher) return;
    if (!myClass) {
      navigate("/landing", { replace: true });
      return;
    }
    if (!allowedLevels.includes(level)) {
      navigate("/sim", { replace: true });
    }
  }, [loading, isTeacher, myClass, level, navigate, allowedLevels]);

  if (loading) {
    return (
      <div className="app-screen" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        Loading…
      </div>
    );
  }
  if (isTeacher) return <>{children}</>;
  if (!myClass || !allowedLevels.includes(level)) return null;
  return <>{children}</>;
};
