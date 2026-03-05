import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyClass } from "../../hooks/useClasses";

type Props = {
  level: 1 | 2 | 3;
  children: React.ReactNode;
};

/**
 * Renders children only if the user's class curriculum_levels includes this level.
 * If no class, redirects to /landing. If level not allowed, redirects to /sim.
 */
export const SimLevelGuard: React.FC<Props> = ({ level, children }) => {
  const navigate = useNavigate();
  const { class: myClass, loading } = useMyClass();
  const allowedLevels = myClass?.curriculum_levels ?? [];

  useEffect(() => {
    if (loading) return;
    if (!myClass) {
      navigate("/landing", { replace: true });
      return;
    }
    if (!allowedLevels.includes(level)) {
      navigate("/sim", { replace: true });
    }
  }, [loading, myClass, level, navigate, allowedLevels]);

  if (loading) {
    return (
      <div className="app-screen" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        Loading…
      </div>
    );
  }
  if (!myClass || !allowedLevels.includes(level)) {
    return null;
  }
  return <>{children}</>;
};
