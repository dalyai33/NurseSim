import React from "react";
import "../styles/classroom.css";

interface SoftCardProps {
  children: React.ReactNode;
  className?: string;
}

export const SoftCard: React.FC<SoftCardProps> = ({ children, className }) => {
  return <div className={`soft-card ${className ?? ""}`}>{children}</div>;
};