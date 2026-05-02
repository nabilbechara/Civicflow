"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Bell,
  FileText,
  Home,
  Landmark,
  LogOut,
  Newspaper,
  Settings,
  UserCircle2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/branding/logo";
import { CitizenChatbot } from "@/components/chatbot/citizen-chatbot";
import { CitizenNotificationPopup } from "@/components/notifications/citizen-notification-popup";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuth } from "@/context/auth-context";
import {
  buildCitizenNotifications,
  getPopupSeenNotificationIds,
  markNotificationsRead,
  markPopupNotificationsSeen,
  type AppNotification,
} from "@/lib/notifications";
import { getAllRequests } from "@/lib/request-api";
import type { ServiceRequest } from "@/types";

interface DashboardShellProps {
  title: string;
  subtitle: string;
  roleLabel: string;
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: typeof Home;
}

function getNavItems(role?: string | null): NavItem[] {
  if (role === "citizen") {
    return [
      { label: "Public Home", href: "/", icon: Landmark },
      { label: "Overview", href: "/citizen", icon: Home },
      { label: "News", href: "/citizen/news", icon: Newspaper },
      { label: "Requests", href: "/citizen/request", icon: FileText },
      { label: "Services", href: "/citizen/services", icon: FileText },
      { label: "Notifications", href: "/citizen/notifications", icon: Bell },
      { label: "Settings", href: "/citizen/settings", icon: Settings },
    ];
  }

  if (role === "municipality_admin" || role === "super_admin") {
    return [
      { label: "Public Home", href: "/", icon: Landmark },
      { label: "Overview", href: "/employee", icon: Home },
      { label: "Manage News", href: "/admin/news", icon: Newspaper },
      { label: "Priority Queue", href: "/employee/requests", icon: FileText },
      { label: "Notifications", href: "/employee/notifications", icon: Bell },
      { label: "Settings", href: "/employee/settings", icon: Settings },
    ];
  }

  return [
    { label: "Public Home", href: "/", icon: Landmark },
    { label: "Overview", href: "/employee", icon: Home },
    { label: "Requests", href: "/employee/requests", icon: FileText },
    { label: "Notifications", href: "/employee/notifications", icon: Bell },
    { label: "Settings", href: "/employee/settings", icon: Settings },
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
  const [notificationRequests, setNotificationRequests] = useState<
    ServiceRequest[]
  >([]);
  const [popupSeenIds, setPopupSeenIds] = useState<Set<string>>(new Set());
  const [isPopupDismissed, setIsPopupDismissed] = useState(false);

  const navItems = getNavItems(user?.role);
  const workspaceName = getWorkspaceName(user?.role);
  const citizenPopupNotifications = useMemo(() => {
    if (user?.role !== "citizen" || isPopupDismissed) return [];

    return buildCitizenNotifications(notificationRequests)
      .filter((notification) => !popupSeenIds.has(notification.id))
      .slice(0, 3);
  }, [isPopupDismissed, notificationRequests, popupSeenIds, user?.role]);

  useEffect(() => {
    if (user?.role !== "citizen") return;

    window.requestAnimationFrame(() => {
      setPopupSeenIds(getPopupSeenNotificationIds(user.id));
      setIsPopupDismissed(false);
    });

    getAllRequests()
      .then(setNotificationRequests)
      .catch(() => {
        setNotificationRequests([]);
      });
  }, [user?.id, user?.role]);

  function handleLogout() {
    signOut();
    router.push("/login");
  }

  function markPopupSeen(notifications: AppNotification[]) {
    markPopupNotificationsSeen(
      user?.id,
      notifications.map((notification) => notification.id),
    );
    setPopupSeenIds(getPopupSeenNotificationIds(user?.id));
    setIsPopupDismissed(true);
  }

  function handlePopupClose() {
    markPopupSeen(citizenPopupNotifications);
  }

  function handleOpenPopupNotification(notification: AppNotification) {
    markNotificationsRead(user?.id, [notification.id]);
    markPopupSeen([notification]);
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <Link href="/">
            <Logo />
          </Link>

          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase text-slate-500">
              Workspace
            </div>
            <div className="mt-2 text-base font-semibold text-slate-950">
              {workspaceName}
            </div>
            <div className="mt-1 text-sm text-slate-400">
              {user?.municipality || "CivicFlow Lebanon"}
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-[#e8f2f8] font-semibold text-[#174767]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="border-b border-slate-200 bg-white">
            <div className="container-shell flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase text-slate-500">
                  {roleLabel}
                </div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {title}
                </h1>
                <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <ThemeToggle />

                <Link
                  href={
                    user?.role === "citizen"
                      ? "/citizen/notifications"
                      : "/employee/notifications"
                  }
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  <Bell className="h-4 w-4" />
                </Link>

                <Link
                  href={
                    user?.role === "citizen"
                      ? "/citizen/settings"
                      : "/employee/settings"
                  }
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  <Settings className="h-4 w-4" />
                </Link>

                <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                  <UserCircle2 className="h-4 w-4" />
                  {user?.full_name || "Signed-in user"}
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
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

      <CitizenNotificationPopup
        notifications={citizenPopupNotifications}
        onClose={handlePopupClose}
        onOpenNotification={handleOpenPopupNotification}
      />
      {user ? <CitizenChatbot /> : null}
    </main>
  );
}
