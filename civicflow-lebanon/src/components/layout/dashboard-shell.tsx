"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Bell, LogOut, Settings, UserCircle2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/branding/logo";
import { useAuth } from "@/context/auth-context";
import { getDefaultRedirectForRole } from "@/lib/auth";

interface DashboardShellProps {
  title: string;
  subtitle: string;
  roleLabel: string;
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
}

function getNavItems(role?: string | null): NavItem[] {
  if (role === "citizen") {
    return [
      { label: "Overview", href: "/citizen" },
      { label: "Requests", href: "/citizen/request" },
      { label: "Services", href: "/citizen/services" },
      { label: "Notifications", href: "/citizen/notifications" },
      { label: "Settings", href: "/citizen/settings" },
    ];
  }

  if (role === "municipality_admin" || role === "super_admin") {
    return [
      { label: "Overview", href: "/employee" },
      { label: "Priority Queue", href: "/employee/requests" },
      { label: "Notifications", href: "/employee/notifications" },
      { label: "Settings", href: "/employee/settings" },
    ];
  }

  return [
    { label: "Overview", href: "/employee" },
    { label: "Requests", href: "/employee/requests" },
    { label: "Notifications", href: "/employee/notifications" },
    { label: "Settings", href: "/employee/settings" },
  ];
}

function getWorkspaceName(role?: string | null) {
  if (role === "citizen") return "Citizen Portal";
  if (role === "municipality_admin") return "Municipality Admin Workspace";
  if (role === "super_admin") return "Platform Admin Workspace";
  return "Municipal Employee Workspace";
}

export function DashboardShell({
  title,
  subtitle,
  roleLabel,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const navItems = getNavItems(user?.role);
  const workspaceName = getWorkspaceName(user?.role);

  function handleLogout() {
    signOut();
    router.push("/login");
  }

  const homeHref = user ? getDefaultRedirectForRole(user.role) : "/";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_26%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08101d_0%,#0a1323_40%,#0c1729_100%)] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-[#08101d]/80 px-6 py-6 backdrop-blur-xl lg:block">
          <Link href={homeHref}>
            <Logo />
          </Link>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Workspace
            </div>
            <div className="mt-2 text-lg font-semibold text-white">
              {workspaceName}
            </div>
            <div className="mt-1 text-sm text-slate-400">
              {user?.municipality || "CivicFlow Lebanon"}
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-2xl px-4 py-3 text-sm transition ${
                    isActive
                      ? "border border-white/10 bg-white/[0.08] font-semibold text-white"
                      : "border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="border-b border-white/10 bg-[#08101d]/70 backdrop-blur-xl">
            <div className="container-shell flex items-center justify-between py-5">
              <div>
                <div className="text-sm text-slate-400">{roleLabel}</div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {title}
                </h1>
                <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white">
                  <Bell className="h-4 w-4" />
                </button>

                <Link
                  href={
                    user?.role === "citizen"
                      ? "/citizen/settings"
                      : "/employee/settings"
                  }
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                </Link>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white">
                  <UserCircle2 className="h-4 w-4" />
                  {user?.full_name || "Signed-in user"}
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          </header>

          <section className="container-shell py-8">{children}</section>
        </div>
      </div>
    </main>
  );
}
