import React, { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  role: "admin" | "teacher" | "student" | "";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: string;
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

  const fetchUser = async (token: string) => {
    const res = await fetch("http://localhost:3003/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setUser(data);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      fetchUser(token)
        .catch(() => {
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
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
        await fetchUser(token);
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
