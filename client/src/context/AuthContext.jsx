import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../services/authService";
import { setOnline, setOffline } from "../firebase/presenceService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => {
        setUser(res.data.data);
        setOnline(res.data.data._id);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = (logoutFn) => async () => {
    if (user) setOffline(user._id);
    await logoutFn();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
