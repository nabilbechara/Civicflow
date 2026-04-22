"use client";

const TOKEN_KEY = "civicflow.token";
const USER_KEY = "civicflow.user";

export interface AuthUser {
  id: string;
  tenant_id: string | null;
  full_name: string;
  email: string;
  role: string;
  municipality: string;
  is_active: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export function saveSession(accessToken: string, user: AuthUser) {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  document.cookie = `civicflow_token=${accessToken}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
}

export function clearSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "civicflow_token=; path=/; max-age=0; SameSite=Lax";
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getDefaultRedirectForRole(role?: string | null) {
  if (role === "citizen") return "/citizen";
  if (
    role === "employee" ||
    role === "municipality_admin" ||
    role === "super_admin"
  ) {
    return "/employee";
  }
  return "/login";
}
