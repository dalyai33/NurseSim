import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./app";
import LoginPage from "../features/auth/LoginPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import SignUpPage from "../features/auth/SignUpPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            // show the login page in the root directory of the website
            { index: true, element: <LoginPage /> },
            { path: "login", element: <LoginPage /> },
            { path: "signup", element: <SignUpPage /> },
            { path: "dashboard", element: <DashboardPage /> },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}