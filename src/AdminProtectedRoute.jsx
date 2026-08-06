// // Decode JWT payload (Signature can't be tampered by user! rather than using user.role)
import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        
        const isLoggedIn = !!localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isAdmin = payload.role === "admin";

        if (!isAdmin) {
            return <Navigate to="/dashboard" replace />;
        }

        return <Outlet />;
    } catch (e) {
        return <Navigate to="/login" replace />;
    }
}
