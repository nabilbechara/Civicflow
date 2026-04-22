import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeRoleFromToken(token: string | undefined) {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    const parsed = JSON.parse(decoded) as { role?: string };

    return parsed.role || null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("civicflow_token")?.value;
  const role = decodeRoleFromToken(token);
  const { pathname } = request.nextUrl;

  const isCitizenRoute = pathname.startsWith("/citizen");
  const isEmployeeRoute = pathname.startsWith("/employee");
  const isLoginRoute = pathname === "/login" || pathname === "/admin-login";

  if ((isCitizenRoute || isEmployeeRoute) && !token) {
    const loginUrl = new URL(
      isEmployeeRoute ? "/admin-login" : "/login",
      request.url,
    );
    return NextResponse.redirect(loginUrl);
  }

  if (isEmployeeRoute && role === "citizen") {
    return NextResponse.redirect(new URL("/citizen", request.url));
  }

  if (isLoginRoute && token) {
    if (role === "citizen") {
      return NextResponse.redirect(new URL("/citizen", request.url));
    }

    if (
      role === "employee" ||
      role === "municipality_admin" ||
      role === "super_admin"
    ) {
      return NextResponse.redirect(new URL("/employee", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/citizen/:path*", "/employee/:path*", "/login", "/admin-login"],
};
