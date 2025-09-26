import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../helpers";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (location.pathname === "/dashboard") {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
