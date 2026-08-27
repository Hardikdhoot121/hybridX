import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Not logged in → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user.isProfileComplete === false) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <Outlet />;
}
