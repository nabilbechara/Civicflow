"use client";

import { Settings2, UserCircle2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/context/auth-context";

export default function EmployeeSettingsPage() {
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
      title="Settings"
      subtitle="Review your workspace identity and account information."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-6">
          <div className="flex items-center gap-3">
            <UserCircle2 className="h-6 w-6 text-slate-300" />
            <h2 className="text-lg font-semibold text-white">Account</h2>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="rounded-2xl bg-white/[0.03] px-4 py-3">
              <div className="text-slate-400">Full name</div>
              <div className="mt-1 text-white">{user?.full_name || "-"}</div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] px-4 py-3">
              <div className="text-slate-400">Email</div>
              <div className="mt-1 text-white">{user?.email || "-"}</div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] px-4 py-3">
              <div className="text-slate-400">Role</div>
              <div className="mt-1 text-white">{user?.role || "-"}</div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] px-4 py-3">
              <div className="text-slate-400">Municipality</div>
              <div className="mt-1 text-white">{user?.municipality || "-"}</div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-6">
          <div className="flex items-center gap-3">
            <Settings2 className="h-6 w-6 text-slate-300" />
            <h2 className="text-lg font-semibold text-white">Workspace</h2>
          </div>

          <p className="mt-6 text-sm leading-7 text-slate-400">
            This page is ready for future settings such as notification rules,
            queue preferences, and workspace configuration.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
