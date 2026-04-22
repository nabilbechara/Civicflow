"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearSession,
  getAccessToken,
  getStoredUser,
  saveSession,
  type AuthUser,
  type LoginResponse,
} from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface RegisterResponse extends LoginResponse {
  message: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (
    fullName: string,
    email: string,
    password: string,
    municipality: string,
  ) => Promise<AuthUser>;
  signOut: () => void;
  refreshMe: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
  }, []);

  const refreshMe = useCallback(async () => {
    const storedToken = getAccessToken();

    if (!storedToken) {
      setUser(null);
      setToken(null);
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      signOut();
      return null;
    }

    const currentUser = (await response.json()) as AuthUser;
    saveSession(storedToken, currentUser);
    setUser(currentUser);
    setToken(storedToken);
    return currentUser;
  }, [signOut]);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Login failed");
    }

    const data = (await response.json()) as LoginResponse;
    saveSession(data.access_token, data.user);
    setUser(data.user);
    setToken(data.access_token);
    return data.user;
  }, []);

  const signUp = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
      municipality: string,
    ) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          municipality,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Registration failed");
      }

      const data = (await response.json()) as RegisterResponse;
      saveSession(data.access_token, data.user);
      setUser(data.user);
      setToken(data.access_token);
      return data.user;
    },
    [],
  );

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getAccessToken();

    if (storedUser) setUser(storedUser);
    if (storedToken) setToken(storedToken);

    refreshMe()
      .catch(() => {
        signOut();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [refreshMe, signOut]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      signIn,
      signUp,
      signOut,
      refreshMe,
    }),
    [user, token, isLoading, signIn, signUp, signOut, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
