import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const response = await api.get("/auth/me");
          setToken(storedToken);
          setUser(response.data);
        } catch {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  function login(newToken, newUser) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
