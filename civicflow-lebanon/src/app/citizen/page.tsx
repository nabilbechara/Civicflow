"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FileText, Clock3, CheckCircle2, ArrowRight } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MetricCard } from "@/components/dashboards/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { getAllRequests } from "@/lib/request-api";
import { services } from "@/lib/mock-data";
import { useAuth } from "@/context/auth-context";
import type { ServiceRequest } from "@/types";

export default function CitizenDashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [error, setError] = useState("");
  const displayName = user?.full_name?.trim() || "there";

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

  const metrics = useMemo(() => {
    const active = requests.filter((request) =>
      [
        "Submitted",
        "Under Review",
        "Pending Documents",
        "Escalated",
        "Department Approved",
      ].includes(request.status),
    ).length;

    const pending = requests.filter(
      (request) => request.status === "Pending Documents",
    ).length;

    const completed = requests.filter((request) =>
      ["Final Approval", "Completed"].includes(request.status),
    ).length;

    return { active, pending, completed };
  }, [requests]);

  return (
    <DashboardShell
      roleLabel="Citizen Portal"
      title={`Welcome back, ${displayName}`}
      subtitle="Track requests, browse services, and manage your municipal documents."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Active requests"
          value={String(metrics.active)}
          change="Live from backend"
          icon={<FileText className="h-5 w-5" />}
        />
        <MetricCard
          label="Pending actions"
          value={String(metrics.pending)}
          change="Requests waiting on citizen action"
          icon={<Clock3 className="h-5 w-5" />}
        />
        <MetricCard
          label="Completed requests"
          value={String(metrics.completed)}
          change="Approved or fully closed"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel rounded-[24px] p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">My recent requests</h2>
              <p className="mt-1 text-sm text-slate-400">
                Track progress across departments and review stages.
              </p>
            </div>

            <Link
              href="/citizen/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              New Request <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6 space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm text-slate-400">
                      {request.reference}
                    </div>
                    <div className="mt-1 text-base font-semibold">
                      {request.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {request.summary}
                    </p>
                  </div>

                  <StatusBadge status={request.status} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="rounded-full bg-white/5 px-3 py-1">
                    Department: {request.department}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1">
                    Updated: {request.updatedAt}
                  </span>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/citizen/request/${request.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  >
                    View Request <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}

            {requests.length === 0 ? (
              <div className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
                No requests found yet.
              </div>
            ) : null}
          </div>
        </div>

        <div className="glass-panel rounded-[24px] p-4 sm:p-6">
          <h2 className="text-xl font-semibold">Popular services</h2>
          <p className="mt-1 text-sm text-slate-400">
            Start a new request from your municipality service catalog.
          </p>

          <div className="mt-6 space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="text-sm text-slate-400">{service.category}</div>
                <div className="mt-1 text-base font-semibold">
                  {service.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {service.description}
                </p>
                <div className="mt-3 text-sm text-blue-200">
                  Estimated time: {service.estimatedDays} days
                </div>

                <div className="mt-4">
                  <Link
                    href={`/citizen/request/new?service=${service.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Start Request <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
