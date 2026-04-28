"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, ShieldAlert } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RequestSummaryCard } from "@/components/requests/request-summary-card";
import { RequestTimeline } from "@/components/requests/request-timeline";
import { RequestActivityFeed } from "@/components/requests/request-activity-feed";
import { getRequestById, updateRequestStatus } from "@/lib/request-api";
import { getAccessToken } from "@/lib/auth";
import { useAuth } from "@/context/auth-context";
import type { RequestStatus, ServiceRequest } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function EmployeeReviewPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const token = getAccessToken();
  const requestId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!requestId) return;

    let isMounted = true;

    async function loadRequest() {
      try {
        const result = await getRequestById(requestId);
        if (isMounted) {
          setRequest(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load request.",
          );
        }
      }
    }

    loadRequest();

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  async function handleAction(status: RequestStatus, note: string) {
    if (!request || !user) return;

    try {
      setIsUpdating(true);
      setError("");

      const updated = await updateRequestStatus({
        id: request.id,
        status,
        actor: user.full_name,
        role: user.role
          .replace("_", " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
        note,
        assignedReviewer:
          request.assignedReviewer &&
          request.assignedReviewer !== "Not assigned yet"
            ? request.assignedReviewer
            : user.full_name,
      });

      setRequest(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update request.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  if (!request) {
    return (
      <DashboardShell
        roleLabel="Municipal Employee Workspace"
        title="Request Review Workspace"
        subtitle="Validate documents, assess status, and move the request through the workflow."
      >
        <div className="theme-surface rounded-[24px] border border-white/10 bg-slate-950/30 p-6">
          <div className="text-xl font-semibold text-white">
            {error || "Request not found"}
          </div>
          <p className="mt-2 text-sm text-slate-400">
            This request could not be loaded from the backend.
          </p>
        </div>
      </DashboardShell>
    );
  }

  const isAdmin =
    user?.role === "municipality_admin" || user?.role === "super_admin";

  return (
    <DashboardShell
      roleLabel={
        isAdmin
          ? "Municipality Admin Workspace"
          : "Municipal Employee Workspace"
      }
      title="Request Review Workspace"
      subtitle="Validate documents, assess status, and move the request through the workflow."
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href="/employee"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to employee dashboard
        </Link>
      </div>

      {request.status === "Escalated" ? (
        <div className="mb-6 rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-amber-200">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold text-amber-100">
                Escalated request
              </div>
              <p className="mt-2 text-sm leading-7 text-amber-100/90">
                This request has been escalated for higher-level visibility. It
                remains visible to employees and is surfaced first in the admin
                priority queue.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <RequestSummaryCard
            reference={request.reference}
            title={request.title}
            status={request.status}
            department={request.department}
            priority={request.priority}
            submittedAt={request.submittedAt}
            updatedAt={request.updatedAt}
            assignedReviewer={request.assignedReviewer}
          />

          <div className="theme-surface rounded-[24px] border border-white/10 bg-slate-950/30 p-6">
            <h3 className="text-lg font-semibold text-white">Review actions</h3>
            <p className="mt-1 text-sm text-slate-400">
              {isAdmin
                ? "Admin actions remain available for all municipality requests, especially escalated items."
                : "Employees can approve, request documents, reject, or forward to admin priority."}
            </p>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                disabled={isUpdating}
                onClick={() =>
                  handleAction(
                    "Department Approved",
                    "The request was approved by the department and moved to the next stage.",
                  )
                }
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:opacity-60"
              >
                Approve
              </button>

              <button
                disabled={isUpdating}
                onClick={() =>
                  handleAction(
                    "Pending Documents",
                    "Additional supporting documents are required before this request can proceed.",
                  )
                }
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
              >
                Request Documents
              </button>

              <button
                disabled={isUpdating}
                onClick={() =>
                  handleAction(
                    "Escalated",
                    "This request was escalated for higher-level municipal review.",
                  )
                }
                className="rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/15 disabled:opacity-60"
              >
                {isAdmin ? "Keep Escalated" : "Forward to Admin"}
              </button>

              <button
                disabled={isUpdating}
                onClick={() =>
                  handleAction(
                    "Rejected",
                    "The request was rejected after departmental review.",
                  )
                }
                className="rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/15 disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          </div>

          <div className="theme-surface rounded-[24px] border border-white/10 bg-slate-950/30 p-6">
            <h3 className="text-lg font-semibold text-white">
              Submitted documents
            </h3>
            <div className="mt-4 space-y-2">
              {request.documents && request.documents.length > 0 ? (
                request.documents.map((document: any) => (
                  <a
                    key={document.id}
                    href={`${API_BASE_URL}/documents/${document.id}/download?token=${encodeURIComponent(token || "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="theme-surface flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:bg-white/[0.06]"
                  >
                    <div>
                      <div className="font-medium text-white">
                        {document.name}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        {document.sizeLabel || "Unknown size"}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs text-blue-200">
                      Open
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </a>
                ))
              ) : (
                <div className="text-sm text-slate-400">
                  No uploaded documents.
                </div>
              )}
            </div>
          </div>

          <RequestActivityFeed
            title="Internal notes"
            items={request.activity || []}
          />
        </div>

        <RequestTimeline items={request.timeline || []} />
      </div>
    </DashboardShell>
  );
}
