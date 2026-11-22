import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
