import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./app/routes";

// to tell react where to render the root file
ReactDOM.createRoot(document.getElementById("root")!).render(
    // to catch erros and mistakes
  <React.StrictMode>
    {/* // to go to the router */}
    <AppRouter />
  </React.StrictMode>
);
