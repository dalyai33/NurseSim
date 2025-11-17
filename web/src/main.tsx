import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/app";

import "./styles/globals.css";
import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/auth.css";
import "./styles/landing.css";
import "./styles/classroom.css";
import "./styles/profile.css";
import "./styles/sim.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
