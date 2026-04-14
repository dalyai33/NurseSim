import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../lib/api";
import "../styles/appLayout.css";

interface UserInfo {
  first_name: string;
  last_name: string;
}

interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [initials, setInitials] = useState("");

  useEffect(() => {
    apiFetch<{ ok: boolean; user: UserInfo }>("/api/me")
      .then(({ data }) => {
        const { first_name, last_name } = data.user;
        const f = first_name?.charAt(0) ?? "";
        const l = last_name?.charAt(0) ?? "";
        setInitials((f + l).toUpperCase());
      })
      .catch(() => {});
  }, []);

  const onProfile = location.pathname === "/profile";

  return (
    <>
      {!onProfile && (
        <button
          className="top-avatar-btn"
          onClick={() => navigate("/profile")}
          aria-label="Go to profile"
        >
          {initials || "?"}
        </button>
      )}
      {children}
    </>
  );
};
