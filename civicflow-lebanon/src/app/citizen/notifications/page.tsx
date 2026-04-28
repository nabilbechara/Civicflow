"use client";

import { BellRing } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function CitizenNotificationsPage() {
  return (
    <DashboardShell
      roleLabel="Citizen Portal"
      title="Notifications"
      subtitle="Status changes and document requests will appear here."
    >
      <div className="theme-surface rounded-[24px] border border-white/10 bg-slate-950/30 p-10 text-center">
        <BellRing className="mx-auto h-10 w-10 text-slate-400" />
        <h2 className="mt-4 text-lg font-semibold text-white">
          Notifications center
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          This page is ready for future alerts such as pending document
          requests, approvals, and final status updates.
        </p>
      </div>
    </DashboardShell>
  );
}
