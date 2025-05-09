import React, { createContext, useContext, useState, ReactNode } from "react";

export interface AuthContextType {
  user: { id: string; name: string; token: string } | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  const login = async (username: string) => {
    // Placeholder: simulate login
    setUser({ id: "1", name: username, token: "fake-jwt-token" });
  };

  const logout = () => {
    setUser(null);
  };

  const refresh = async () => {
    // Placeholder: simulate token refresh
    if (user) setUser({ ...user, token: "refreshed-jwt-token" });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuthContext must be used within an AuthProvider");
  return ctx;
};
