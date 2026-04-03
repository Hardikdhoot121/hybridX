import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const isNewUser = searchParams.get("newUser") === "true";

    if (!token) {
      // No token → something went wrong, send back to login
      navigate("/login?error=no_token");
      return;
    }

    // Decode the JWT payload (no verification needed — server already verified)
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Build a minimal user object from the token payload
    const user = {
      id: payload.id,
      role: payload.role,
    };

    // Save token & user the same way the local login does
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("currentStudent", JSON.stringify(user));

    // Notify any listeners (e.g. attendance components)
    window.dispatchEvent(
      new CustomEvent("studentLoggedIn", { detail: { student: user } })
    );

    // Route: new Google user → complete profile, returning user → dashboard
    if (isNewUser) {
      navigate("/complete-profile");
    } else {
      const redirectPath = user.role === "admin" ? "/admin" : "/dashboard";
      navigate(redirectPath);
    }
  }, []);

  // Brief loading screen while the redirect happens
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-300 text-lg font-medium">Signing you in…</p>
      </div>
    </div>
  );
}

export default AuthSuccess;
