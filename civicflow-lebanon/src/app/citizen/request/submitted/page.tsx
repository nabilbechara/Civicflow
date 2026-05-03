"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, FileClock, ArrowRight } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getRequestById } from "@/lib/request-api";
import type { ServiceRequest } from "@/types";

export const dynamic = "force-dynamic";

function RequestSubmittedContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("id");
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!requestId) return;

    let isMounted = true;
    const currentRequestId = requestId;

    async function loadRequest() {
      try {
        const result = await getRequestById(currentRequestId);
        if (isMounted) {
          setRequest(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load submitted request.",
          );
        }
      }
    }

    loadRequest();

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  return (
    <DashboardShell
      roleLabel="Citizen Portal"
      title="Request Submitted Successfully"
      subtitle="Your municipality has received the request and it is now in the workflow."
    >
      <div className="mx-auto max-w-3xl">
        <div className="glass-panel rounded-[28px] p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/15 text-emerald-200">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight">
            Your request has been submitted
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            The request entered the municipality workflow successfully. You can
            now track progress, respond to missing document requests, and review
            status updates from your citizen dashboard.
          </p>

          {error ? (
            <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
              <div className="text-sm text-slate-400">Reference number</div>
              <div className="mt-2 text-lg font-semibold text-white">
                {request?.reference || "Loading..."}
              </div>
            </div>

            <div className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
              <div className="text-sm text-slate-400">Current status</div>
              <div className="mt-2 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                {request?.status || "Submitted"}
              </div>
            </div>
          </div>

          <div className="theme-surface mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
            <div className="text-sm text-slate-400">Request title</div>
            <div className="mt-2 text-base font-semibold text-white">
              {request?.title || "Loading request details..."}
            </div>
          </div>

          <div className="theme-surface mt-8 rounded-[24px] border border-white/10 bg-slate-950/30 p-5 text-left">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-blue-300">
                <FileClock className="h-5 w-5" />
              </div>

              <div>
                <div className="text-base font-semibold text-white">
                  What happens next
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Your municipality will review the request, validate documents,
                  and move it through the appropriate approval path. If anything
                  is missing, you will see a clear notification in your
                  dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={request ? `/citizen/request/${request.id}` : "/citizen"}
              className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              View Request Tracking
            </Link>

            <Link
              href="/citizen/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Browse More Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default function RequestSubmittedPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell
          roleLabel="Citizen Portal"
          title="Request Submitted Successfully"
          subtitle="Loading submitted request..."
        >
          <div className="glass-panel rounded-[24px] p-6 text-sm text-slate-400">
            Loading confirmation details.
          </div>
        </DashboardShell>
      }
    >
      <RequestSubmittedContent />
    </Suspense>
  );
}
