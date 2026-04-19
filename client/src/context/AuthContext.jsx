import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("constructocalc_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem("constructocalc_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = (payload) => {
    localStorage.setItem("constructocalc_token", payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem("constructocalc_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
