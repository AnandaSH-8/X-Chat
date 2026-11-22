import { createContext, useContext, useState, useEffect } from "react";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { getMe } from "../services/authService";
import { setOnline, setOffline } from "../firebase/presenceService";
import { auth } from "../firebase/firebaseConfig";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signIntoFirebase = async () => {
    const res = await api.get("/users/firebase-token");
    await signInWithCustomToken(auth, res.data.data.firebaseToken);
  };

  useEffect(() => {
    getMe()
      .then((res) => {
        setUser(res.data.data);
        setOnline(res.data.data._id);
        signIntoFirebase().catch(() => {});
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = (logoutFn) => async () => {
    if (user) setOffline(user._id);
    await signOut(auth);
    await logoutFn();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, signIntoFirebase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
