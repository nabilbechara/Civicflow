"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Download, ArrowLeft } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RequestSummaryCard } from "@/components/requests/request-summary-card";
import { RequestTimeline } from "@/components/requests/request-timeline";
import { RequestActivityFeed } from "@/components/requests/request-activity-feed";
import { getRequestById } from "@/lib/request-api";
import type { ServiceRequest } from "@/types";

export default function CitizenRequestDetailsPage() {
  const params = useParams<{ id: string }>();
  const requestId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [error, setError] = useState("");

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

  if (!request) {
    return (
      <DashboardShell
        roleLabel="Citizen Portal"
        title="Request Tracking"
        subtitle="Follow every stage of your request with a transparent review history."
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

  return (
    <DashboardShell
      roleLabel="Citizen Portal"
      title="Request Tracking"
      subtitle="Follow every stage of your request with a transparent review history."
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href="/citizen"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
          <Download className="h-4 w-4" />
          Download summary
        </button>
      </div>

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
            <h3 className="text-lg font-semibold text-white">
              Applicant details
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-sm text-slate-400">Applicant name</div>
                <div className="mt-2 text-sm font-medium text-white">
                  {request.applicantName || "Not available"}
                </div>
              </div>

              <div className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-sm text-slate-400">Phone</div>
                <div className="mt-2 text-sm font-medium text-white">
                  {request.applicantPhone || "Not available"}
                </div>
              </div>
            </div>

            <div className="theme-surface mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-sm text-slate-400">Notes</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">
                {request.notes || "No additional notes provided."}
              </div>
            </div>

            <div className="theme-surface mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-sm text-slate-400">Uploaded documents</div>
              <div className="mt-3 space-y-2">
                {request.documents && request.documents.length > 0 ? (
                  request.documents.map((document) => (
                    <div
                      key={document.id}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
                    >
                      {document.name}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-400">
                    No documents uploaded.
                  </div>
                )}
              </div>
            </div>
          </div>

          <RequestActivityFeed items={request.activity || []} />
        </div>

        <RequestTimeline items={request.timeline || []} />
      </div>
    </DashboardShell>
  );
}
