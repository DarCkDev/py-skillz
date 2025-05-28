import { createContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: UserRole;
  loading: boolean;
  login: (data: {
    email: string;
    password: string;
  }) => Promise<string[] | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("userData");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData) as User;
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error al procesar los datos del usuario:", error);
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (data: {
    email: string;
    password: string;
  }): Promise<string[] | null> => {
    try {
      const response = await fetch("http://localhost:3003/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-custom-lang": localStorage.getItem("i18nextLng") ?? "es",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.status === 201) {
        const token = result.token;
        sessionStorage.setItem("token", token);
        
        // Crear usuario
        const userRole = (result.role ?? "") as UserRole;
        
        const newUser: User = {
          id: result.id ?? "unknown-id",
          info: {
            name: result.fullName ?? "Usuario",
            email: data.email ?? ""
          },
          isAuthenticated: true,
          role: userRole
        };
        
        // Guardar los datos del usuario en sessionStorage
        sessionStorage.setItem("userData", JSON.stringify(newUser));
        
        setUser(newUser);
        setIsAuthenticated(true);
        return null;
      } else {
        return Array.isArray(result.message)
          ? result.message
          : [String(result.message)];
      }
    } catch (error) {
      return ["Error de red o del servidor"];
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userData");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        role: user?.role ?? "",
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
