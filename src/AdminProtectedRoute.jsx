import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
    const isLoggedIn = !!localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = user.role === "admin";

    // Not logged in - redirect to login
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but not admin - redirect to user dashboard
    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    // Admin user - allow access
    return <Outlet />;
}
