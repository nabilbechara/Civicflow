"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Inbox,
  AlertTriangle,
  BadgeCheck,
  ArrowRight,
  ShieldAlert,
  Clock3,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MetricCard } from "@/components/dashboards/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { getAllRequests } from "@/lib/request-api";
import { isApprovedRequest, isPendingRequest } from "@/lib/request-metrics";
import { useAuth } from "@/context/auth-context";
import type { ServiceRequest } from "@/types";

function isPriorityQueueItem(request: ServiceRequest) {
  return (
    request.status === "Escalated" ||
    request.priority === "High" ||
    request.status === "Pending Documents"
  );
}

function sortPriorityItems(requests: ServiceRequest[]) {
  return [...requests].sort((a, b) => {
    const score = (request: ServiceRequest) => {
      if (request.status === "Escalated") return 0;
      if (request.priority === "High") return 1;
      if (request.status === "Pending Documents") return 2;
      return 3;
    };

    return score(a) - score(b);
  });
}

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
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

  const metrics = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(isPendingRequest).length;

    const escalations = requests.filter(
      (request) => request.status === "Escalated",
    ).length;

    const approved = requests.filter(isApprovedRequest).length;

    const priorityQueue = requests.filter(isPriorityQueueItem).length;

    return { total, pending, escalations, approved, priorityQueue };
  }, [requests]);

  const priorityRequests = useMemo(
    () => sortPriorityItems(requests.filter(isPriorityQueueItem)),
    [requests],
  );

  const standardQueue = useMemo(
    () =>
      requests.filter(
        (request) =>
          !priorityRequests.some(
            (priorityItem) => priorityItem.id === request.id,
          ),
      ),
    [priorityRequests, requests],
  );

  const isAdmin =
    user?.role === "municipality_admin" || user?.role === "super_admin";

  const roleLabel = isAdmin
    ? "Municipality Admin Workspace"
    : "Municipal Employee Workspace";

  const title = isAdmin ? "Admin Priority Queue" : "Department Queue Overview";

  const subtitle = isAdmin
    ? "Escalated and high-priority requests are surfaced first so municipality leadership can intervene quickly."
    : "Review incoming requests, validate documents, and move cases through structured workflows.";

  return (
    <DashboardShell roleLabel={roleLabel} title={title} subtitle={subtitle}>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="All requests"
          value={String(metrics.total)}
          change="Live backend workload for your scope"
          icon={<Inbox className="h-5 w-5" />}
        />
        <MetricCard
          label="Pending requests"
          value={String(metrics.pending)}
          change="Submitted, review, pending docs, or escalated"
          icon={<ShieldAlert className="h-5 w-5" />}
        />
        <MetricCard
          label="Escalations"
          value={String(metrics.escalations)}
          change="Needs higher-level attention"
          icon={<AlertTriangle className="h-5 w-5" />}
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

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel rounded-[24px] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                {isAdmin ? "Admin priority queue" : "Priority queue"}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Escalated requests stay visible to employees and surface first
                for admins.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
              <Clock3 className="h-3.5 w-3.5" />
              Highest attention first
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {priorityRequests.map((request) => (
              <div
                key={request.id}
                className="theme-surface rounded-2xl border border-amber-400/20 bg-amber-500/5 p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
                      <span>{request.reference}</span>
                      {request.status === "Escalated" ? (
                        <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-200">
                          Escalated to admin
                        </span>
                      ) : null}
                      {request.priority === "High" ? (
                        <span className="rounded-full border border-rose-400/20 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-rose-200">
                          High priority
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 text-base font-semibold">
                      {request.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {request.summary}
                    </p>
                  </div>

                  <StatusBadge status={request.status} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                  <span className="rounded-full bg-white/5 px-3 py-1">
                    Department: {request.department}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1">
                    Reviewer: {request.assignedReviewer || "Unassigned"}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1">
                    Priority: {request.priority}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/employee/reviews/${request.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  >
                    Review Now <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href={`/citizen/request/${request.id}`}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Citizen View
                  </Link>
                </div>
              </div>
            ))}

            {priorityRequests.length === 0 ? (
              <div className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
                No escalated or high-priority requests right now.
              </div>
            ) : null}
          </div>
        </div>

        <div className="glass-panel rounded-[24px] p-6">
          <h2 className="text-xl font-semibold">Standard queue</h2>
          <p className="mt-1 text-sm text-slate-400">
            Remaining requests currently awaiting review or action.
          </p>

          <div className="mt-6 space-y-4">
            {standardQueue.map((request) => (
              <div
                key={request.id}
                className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
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
                    Reviewer: {request.assignedReviewer || "Unassigned"}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1">
                    Priority: {request.priority}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/employee/reviews/${request.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  >
                    Review <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href={`/citizen/request/${request.id}`}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Citizen View
                  </Link>
                </div>
              </div>
            ))}

            {standardQueue.length === 0 ? (
              <div className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
                No standard queue items found.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
