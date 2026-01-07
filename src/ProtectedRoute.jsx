import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const isLoggedIn = token && token.startsWith("student-token-");

  console.log('ProtectedRoute check:', { token, isLoggedIn });

  if (!isLoggedIn) {
    console.log('Redirecting to login - not authenticated');
    return <Navigate to="/login" replace />;
  }

  console.log('Authentication successful, showing protected content');
  return <Outlet />;
}
