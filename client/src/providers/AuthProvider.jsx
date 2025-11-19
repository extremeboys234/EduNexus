import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  // ✅ Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setAuth(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, [auth]);

  const login = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setAuth(user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
