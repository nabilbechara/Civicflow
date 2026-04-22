import { demoUsers } from "@/lib/mock-data";
import { User } from "@/types";

export interface DemoAuthResult {
  user: User | null;
  redirectTo: string | null;
}

export function findDemoUserByEmail(email: string): User | null {
  const normalized = email.trim().toLowerCase();
  return (
    demoUsers.find((user) => user.email.trim().toLowerCase() === normalized) ||
    null
  );
}

export function getRedirectPathForRole(role: User["role"]) {
  switch (role) {
    case "citizen":
      return "/citizen";
    case "employee":
      return "/employee";
    case "municipality_admin":
      return "/admin";
    case "super_admin":
      return "/admin";
    default:
      return "/login";
  }
}

export function authenticateDemoUser(email: string): DemoAuthResult {
  const user = findDemoUserByEmail(email);

  if (!user) {
    return {
      user: null,
      redirectTo: null,
    };
  }

  return {
    user,
    redirectTo: getRedirectPathForRole(user.role),
  };
}
