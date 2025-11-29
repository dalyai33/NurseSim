// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "../features/auth/LoginPage";
// import SignUpPage from "../features/auth/SignUpPage";
// import { LandingPage } from "../features/landing/LandingPage";
// import { ClassroomPermissionsPage } from "../features/classroom/ClassroomPermissionsPage";
// import { ClassroomStudentsPage } from "../features/classroom/ClassroomStudentsPage";
// import { SimIntroductionPage } from "../features/sim/SimIntroductionPage";
// import { ProfilePage } from "../features/profile/ProfilePage";
// import "../styles/login.css";

// export const AppRoutes: React.FC = () => {
//   return (
//     <Routes>
//       {/* default route */}
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignUpPage />} />
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/classroom/permissions" element={<ClassroomPermissionsPage />} />
//         <Route path="/classroom/students" element={<ClassroomStudentsPage />} />
//         <Route path="/sim" element={<SimIntroductionPage />} />
//         <Route path="/profile" element={<ProfilePage />} />
//       {/* anything else goes back to login */}
//       <Route path="*" element={<Navigate to="/login" />} />
//     </Routes>
//   );
// };

// src/app/routes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import SignUpPage from "../features/auth/SignUpPage";
import { LandingPage } from "../features/landing/LandingPage";
import { ClassroomStudentsPage } from "../features/classroom/ClassroomStudentsPage";
import { ClassroomPermissionsPage } from "../features/classroom/ClassroomPermissionsPage";
import { SimIntroductionPage } from "../features/sim/SimIntroductionPage";
import { ProfilePage } from "../features/profile/ProfilePage";
import {SimPageTwo} from "../features/sim/SimPageTwo"; 

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
      <Route path="/classroom/permissions" element={<ClassroomPermissionsPage />} />
      <Route path="/classroom/students" element={<ClassroomStudentsPage />} />

      {/* sim & profile */}
      <Route path="/sim" element={<SimIntroductionPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/sim/page-two" element={<SimPageTwo />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
