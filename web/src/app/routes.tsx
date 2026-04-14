// src/app/routes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import LoginPage from "../features/auth/LoginPage";
import SignUpPage from "../features/auth/SignUpPage";
import { LandingPage } from "../features/landing/LandingPage";
import { ClassroomStudentsPage } from "../features/classroom/ClassroomStudentsPage";
import { ClassroomPermissionsPage } from "../features/classroom/ClassroomPermissionsPage";
import { TeacherViewLandingPage } from "../features/classroom/TeacherViewLandingPage";
import { SimIntroductionPage } from "../features/sim/SimIntroductionPage";
import { SimLandingPage } from "../features/sim/SimLandingPage";
import { SimLevel1Page } from "../features/sim/SimLevel1Page";
import { SimLevel2Page } from "../features/sim/SimLevel2Page";
import { SimLevel3Page } from "../features/sim/SimLevel3Page";
import { ProfilePage } from "../features/profile/ProfilePage";
import {SimPageTwo} from "../features/sim/SimPageTwo";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* auth — redirect to /landing if already signed in */}
      <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />

      {/* after login — require session so /api/sim/* and other APIs work */}
      <Route path="/landing" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />

      {/* classroom views */}
      <Route path="/teacher" element={<ProtectedRoute><TeacherViewLandingPage /></ProtectedRoute>} />
      <Route path="/classroom/permissions" element={<ProtectedRoute><ClassroomPermissionsPage /></ProtectedRoute>} />
      <Route path="/classroom/students" element={<ProtectedRoute><ClassroomStudentsPage /></ProtectedRoute>} />

      {/* sim & profile */}
      <Route path="/sim" element={<ProtectedRoute><SimLandingPage /></ProtectedRoute>} />
      <Route path="/sim/tutorial" element={<ProtectedRoute><SimIntroductionPage /></ProtectedRoute>} />
      <Route path="/sim/level-1" element={<ProtectedRoute><SimLevel1Page /></ProtectedRoute>} />
      <Route path="/sim/level-2" element={<ProtectedRoute><SimLevel2Page /></ProtectedRoute>} />
      <Route path="/sim/level-3" element={<ProtectedRoute><SimLevel3Page /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/sim/page-two" element={<ProtectedRoute><SimPageTwo /></ProtectedRoute>} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
