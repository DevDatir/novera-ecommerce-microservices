import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AuthUser } from "../types/auth";

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(
  null
);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<AuthUser | null>(
    null
  );

  useEffect(() => {
    const stored = localStorage.getItem("auth");

    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (auth: AuthUser) => {
    localStorage.setItem(
      "auth",
      JSON.stringify(auth)
    );

    localStorage.setItem("token", auth.token);

    setUser(auth);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext)!;
};