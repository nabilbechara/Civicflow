import { StatusBadge } from "@/components/shared/status-badge";

interface RequestSummaryCardProps {
  reference: string;
  title: string;
  status: string;
  department: string;
  priority: string;
  submittedAt: string;
  updatedAt: string;
  assignedReviewer?: string;
}

export function RequestSummaryCard({
  reference,
  title,
  status,
  department,
  priority,
  submittedAt,
  updatedAt,
  assignedReviewer,
}: RequestSummaryCardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-6">
      <div className="text-sm text-slate-400">{reference}</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>

      <div className="mt-4">
        <StatusBadge status={status} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-sm text-slate-400">Department</div>
          <div className="mt-2 text-sm font-medium text-white">
            {department}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-sm text-slate-400">Priority</div>
          <div className="mt-2 text-sm font-medium text-white">{priority}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-sm text-slate-400">Submitted</div>
          <div className="mt-2 text-sm font-medium text-white">
            {submittedAt}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-sm text-slate-400">Last updated</div>
          <div className="mt-2 text-sm font-medium text-white">{updatedAt}</div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="text-sm text-slate-400">Assigned reviewer</div>
        <div className="mt-2 text-sm font-medium text-white">
          {assignedReviewer || "Not assigned yet"}
        </div>
      </div>
    </div>
  );
}
