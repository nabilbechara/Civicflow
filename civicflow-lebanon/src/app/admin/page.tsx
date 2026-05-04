"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, BadgeCheck, Clock3 } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MetricCard } from "@/components/dashboards/metric-card";
import { getAllRequests } from "@/lib/request-api";
import { summarizeRequestMetrics } from "@/lib/request-metrics";
import { tenants } from "@/lib/mock-data";
import type { ServiceRequest } from "@/types";

export default function AdminDashboardPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadRequests() {
      try {
        const results = await getAllRequests();
        if (isMounted) {
          setRequests(results);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load requests.",
          );
        }
      }
    }

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = useMemo(
    () => summarizeRequestMetrics(requests),
    [requests],
  );

  return (
    <DashboardShell
      roleLabel="Municipality Admin Dashboard"
      title="Municipality Operations Overview"
      subtitle="Manage employees, services, workflows, and municipality-level performance."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="All requests"
          value={String(metrics.total)}
          change="Requests visible to this admin"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          label="Pending requests"
          value={String(metrics.pending)}
          change="Submitted, review, pending docs, or escalated"
          icon={<Clock3 className="h-5 w-5" />}
        />
        <MetricCard
          label="Accepted requests"
          value={String(metrics.approved)}
          change="Department approved, final approval, or completed"
          icon={<BadgeCheck className="h-5 w-5" />}
        />
      </div>

      {error ? (
        <div className="mt-8 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="glass-panel rounded-[24px] p-6">
          <h2 className="text-xl font-semibold">Municipality profile</h2>
          <p className="mt-1 text-sm text-slate-400">
            Tenant-aware configuration and identity.
          </p>

          <div className="mt-6 space-y-4">
            <div className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-sm text-slate-400">Active tenant</div>
              <div className="mt-1 text-lg font-semibold">
                {tenants[0].name}
              </div>
              <div className="mt-2 text-sm text-slate-400">
                Region: {tenants[0].region}
              </div>
            </div>

            <div className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-sm text-slate-400">Workflow governance</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">
                Approval chains, document rules, review stages, and escalation
                paths will be configurable here in later steps.
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[24px] p-6">
          <h2 className="text-xl font-semibold">Admin quick actions</h2>
          <p className="mt-1 text-sm text-slate-400">
            The next modules will extend these controls.
          </p>

          <div className="mt-6 grid gap-4">
            {[
              "Manage employees and roles",
              "Configure services and categories",
              "Define approval workflows",
              "Monitor analytics and escalations",
            ].map((item) => (
              <div
                key={item}
                className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
