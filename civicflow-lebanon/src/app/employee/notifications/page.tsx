"use client";

import { BellRing } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/context/auth-context";

export default function EmployeeNotificationsPage() {
  const { user } = useAuth();
  const isAdmin =
    user?.role === "municipality_admin" || user?.role === "super_admin";

  return (
    <DashboardShell
      roleLabel={
        isAdmin
          ? "Municipality Admin Workspace"
          : "Municipal Employee Workspace"
      }
      title="Notifications"
      subtitle="Operational alerts and workflow updates will appear here."
    >
      <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-10 text-center">
        <BellRing className="mx-auto h-10 w-10 text-slate-400" />
        <h2 className="mt-4 text-lg font-semibold text-white">
          Internal notifications
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          This page is ready for future alerts such as escalations, new request
          assignments, and pending approvals.
        </p>
      </div>
    </DashboardShell>
  );
}
