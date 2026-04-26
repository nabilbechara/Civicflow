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
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Under Review":
    case "Submitted":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "Pending Documents":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "Escalated":
      return "bg-violet-50 text-violet-700 border border-violet-200";
    case "Rejected":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "Draft":
      return "bg-slate-100 text-slate-700 border border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
}
