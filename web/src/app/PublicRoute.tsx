import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

type Props = { children: React.ReactNode };

/**
 * Renders children only if the user is NOT authenticated.
 * If they already have a valid session, redirects to /landing.
 */
export const PublicRoute: React.FC<Props> = ({ children }) => {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch(`${API_BASE}/api/me`, { credentials: "include" });
        const data = res.ok ? await res.json().catch(() => ({})) : {};
        if (cancelled) return;
        if (res.ok && data.ok && (data.user_id != null || (data.user && data.user.id != null))) {
          setStatus("authenticated");
        } else {
          setStatus("unauthenticated");
        }
      } catch {
        if (!cancelled) setStatus("unauthenticated");
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="app-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        Loading…
      </div>
    );
  }

  if (status === "authenticated") {
    return <Navigate to="/landing" replace />;
  }

  return <>{children}</>;
};
