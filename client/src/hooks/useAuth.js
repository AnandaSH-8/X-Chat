import { useAuthContext } from "../context/AuthContext";
import { logout as logoutService } from "../services/authService";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const { user, setUser, loading, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(logoutService)();
    navigate("/login");
  };

  return { user, setUser, loading, handleLogout };
};

export default useAuth;
