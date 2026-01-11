import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const isLoggedIn = token && token.length > 10; // JWT tokens are typically long strings

  console.log('ProtectedRoute check:', { token: token ? 'exists' : 'none', isLoggedIn });

  if (!isLoggedIn) {
    console.log('Redirecting to login - not authenticated');
    return <Navigate to="/login" replace />;
  }

  console.log('Authentication successful, showing protected content');
  return <Outlet />;
}
