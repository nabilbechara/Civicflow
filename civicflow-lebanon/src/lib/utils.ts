import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusTone(status: string) {
  switch (status) {
    case "Completed":
    case "Final Approval":
    case "Department Approved":
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20";
    case "Under Review":
    case "Submitted":
      return "bg-blue-500/15 text-blue-300 border border-blue-400/20";
    case "Pending Documents":
      return "bg-amber-500/15 text-amber-300 border border-amber-400/20";
    case "Escalated":
      return "bg-violet-500/15 text-violet-300 border border-violet-400/20";
    case "Rejected":
      return "bg-rose-500/15 text-rose-300 border border-rose-400/20";
    case "Draft":
      return "bg-white/10 text-slate-300 border border-white/10";
    default:
      return "bg-white/10 text-slate-300 border border-white/10";
  }
}
