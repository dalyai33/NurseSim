import { Outlet } from "react-router-dom";
import "../styles/login.css";

export default function App() {
    return (
        <div className="app-shell">
            <Outlet />
        </div>
    );
}