"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "./api";
import { logout as apiLogout } from "./auth";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  username: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = async () => {
    try {
      if (api.tokenStore.get()) {
        const user = await api.me();
        setIsLoggedIn(true);
        setUserId(user.id);
        setUsername(user.username);
      }
    } catch (e) {
      console.error("Failed to fetch user data:", e);
      apiLogout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = (token: string) => {
    api.tokenStore.set(token);
    fetchMe();
  };

  const logout = () => {
    apiLogout();
    setIsLoggedIn(false);
    setUserId(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userId, username, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
