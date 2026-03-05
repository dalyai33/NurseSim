// src/app/routes.tsx
import React from "react";
import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import SignUpPage from "../features/auth/SignUpPage";
import { LandingPage } from "../features/landing/LandingPage";
import { ClassroomStudentsPage } from "../features/classroom/ClassroomStudentsPage";
import { TeacherViewLandingPage } from "../features/classroom/TeacherViewLandingPage";
import { SimIntroductionPage } from "../features/sim/SimIntroductionPage";
import { SimLandingPage } from "../features/sim/SimLandingPage";
import { SimLevel1Page } from "../features/sim/SimLevel1Page";
import { SimLevel2Page } from "../features/sim/SimLevel2Page";
import { SimLevel3Page } from "../features/sim/SimLevel3Page";
import { SimLevelGuard } from "../features/sim/SimLevelGuard";
import { ProfilePage } from "../features/profile/ProfilePage";
import { SimPageTwo } from "../features/sim/SimPageTwo";

function PermissionsRedirect() {
  const [searchParams] = useSearchParams();
  return <Navigate to={`/classroom/students?${searchParams.toString()}`} replace />;
}

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* auth */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* after login */}
      <Route path="/landing" element={<LandingPage />} />

      {/* classroom views */}
      <Route path="/teacher" element={<TeacherViewLandingPage />} />
      <Route path="/classroom/permissions" element={<PermissionsRedirect />} />
      <Route path="/classroom/students" element={<ClassroomStudentsPage />} />

      {/* sim & profile */}
      <Route path="/sim" element={<SimLandingPage />} />
      <Route path="/sim/tutorial" element={<SimIntroductionPage />} />
      <Route path="/sim/level-1" element={<SimLevelGuard level={1}><SimLevel1Page /></SimLevelGuard>} />
      <Route path="/sim/level-2" element={<SimLevelGuard level={2}><SimLevel2Page /></SimLevelGuard>} />
      <Route path="/sim/level-3" element={<SimLevelGuard level={3}><SimLevel3Page /></SimLevelGuard>} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/sim/page-two" element={<SimPageTwo />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
