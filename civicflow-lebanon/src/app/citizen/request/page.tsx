"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, FileText } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { getAllRequests } from "@/lib/request-api";
import type { ServiceRequest } from "@/types";

export default function CitizenRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getAllRequests()
      .then((items) => {
        if (active) setRequests(items);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Failed to load requests.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardShell
      roleLabel="Citizen Portal"
      title="My Requests"
      subtitle="Review all requests you submitted to your municipality."
    >
      <div className="space-y-4">
        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {requests.map((request) => (
          <div
            key={request.id}
            className="theme-surface rounded-[24px] border border-white/10 bg-slate-950/30 p-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-sm text-slate-400">
                  {request.reference}
                </div>
                <div className="mt-2 text-xl font-semibold text-white">
                  {request.title}
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-300">
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
              <span className="rounded-full bg-white/5 px-3 py-1">
                Priority: {request.priority}
              </span>
            </div>

            <div className="mt-5">
              <Link
                href={`/citizen/request/${request.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                View Request <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}

        {!error && requests.length === 0 ? (
          <div className="theme-surface rounded-[24px] border border-white/10 bg-slate-950/30 p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-slate-400" />
            <h2 className="mt-4 text-lg font-semibold text-white">
              No requests yet
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Start a new municipal service request to see it here.
            </p>
            <Link
              href="/citizen/services"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Browse Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}
