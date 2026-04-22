import { AlertTriangle, CheckCircle2, Clock3, FileWarning } from "lucide-react";
import { getStatusTone } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Escalated":
      return <AlertTriangle className="h-3.5 w-3.5" />;
    case "Pending Documents":
      return <FileWarning className="h-3.5 w-3.5" />;
    case "Department Approved":
    case "Final Approval":
    case "Completed":
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    default:
      return <Clock3 className="h-3.5 w-3.5" />;
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getStatusTone(
        status,
      )}`}
    >
      {getStatusIcon(status)}
      {status}
    </span>
  );
}
