import { Navigate, useLocation } from "react-router-dom";

// Guards dashboard routes using the same localStorage token/role
// convention already used throughout the app (Login, Navbar, Booking).
export default function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const fallback =
      role === "ADMIN" ? "/admin" : role === "EXPERT" ? "/expert-dashboard" : "/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
