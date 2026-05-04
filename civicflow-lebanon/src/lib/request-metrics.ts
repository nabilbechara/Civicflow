import type { RequestStatus, ServiceRequest } from "@/types";

const pendingStatuses: RequestStatus[] = [
  "Submitted",
  "Under Review",
  "Pending Documents",
  "Escalated",
];

const approvedStatuses: RequestStatus[] = [
  "Department Approved",
  "Final Approval",
  "Completed",
];

export function isPendingRequest(request: ServiceRequest) {
  return pendingStatuses.includes(request.status);
}

export function isApprovedRequest(request: ServiceRequest) {
  return approvedStatuses.includes(request.status);
}

export function summarizeRequestMetrics(requests: ServiceRequest[]) {
  const total = requests.length;
  const pending = requests.filter(isPendingRequest).length;
  const approved = requests.filter(isApprovedRequest).length;
  const rejected = requests.filter((request) => request.status === "Rejected")
    .length;

  return { total, pending, approved, rejected };
}
