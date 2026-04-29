import type { ServiceRequest } from "@/types";

export type NotificationAudience = "citizen" | "employee";

export interface AppNotification {
  id: string;
  audience: NotificationAudience;
  title: string;
  message: string;
  meta: string;
  href: string;
  createdAt: string;
  requestId: string;
  tone: "info" | "success" | "warning" | "urgent";
}

const READ_KEY_PREFIX = "civicflow.notifications.read";
const POPUP_KEY_PREFIX = "civicflow.notifications.popup-seen";

function getStorageKey(prefix: string, userId?: string | null) {
  return `${prefix}.${userId || "anonymous"}`;
}

function readIdSet(prefix: string, userId?: string | null) {
  if (typeof window === "undefined") return new Set<string>();

  const raw = window.localStorage.getItem(getStorageKey(prefix, userId));
  if (!raw) return new Set<string>();

  try {
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set<string>();
  }
}

function writeIdSet(prefix: string, userId: string | null | undefined, ids: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    getStorageKey(prefix, userId),
    JSON.stringify(Array.from(ids)),
  );
}

export function getReadNotificationIds(userId?: string | null) {
  return readIdSet(READ_KEY_PREFIX, userId);
}

export function markNotificationsRead(
  userId: string | null | undefined,
  notificationIds: string[],
) {
  const ids = readIdSet(READ_KEY_PREFIX, userId);
  notificationIds.forEach((id) => ids.add(id));
  writeIdSet(READ_KEY_PREFIX, userId, ids);
}

export function getPopupSeenNotificationIds(userId?: string | null) {
  return readIdSet(POPUP_KEY_PREFIX, userId);
}

export function markPopupNotificationsSeen(
  userId: string | null | undefined,
  notificationIds: string[],
) {
  const ids = readIdSet(POPUP_KEY_PREFIX, userId);
  notificationIds.forEach((id) => ids.add(id));
  writeIdSet(POPUP_KEY_PREFIX, userId, ids);
}

function getCitizenTone(status: ServiceRequest["status"]): AppNotification["tone"] {
  if (["Completed", "Final Approval", "Department Approved"].includes(status)) {
    return "success";
  }
  if (status === "Pending Documents") return "warning";
  if (status === "Rejected" || status === "Escalated") return "urgent";
  return "info";
}

function getCitizenMessage(request: ServiceRequest) {
  switch (request.status) {
    case "Submitted":
      return "Your request was received and is waiting for municipal review.";
    case "Under Review":
      return "Your request is being reviewed by the municipality.";
    case "Pending Documents":
      return "The municipality needs additional documents from you.";
    case "Escalated":
      return "Your request was escalated for higher-level attention.";
    case "Department Approved":
      return "Your request was approved by the department.";
    case "Final Approval":
      return "Your request reached final approval.";
    case "Completed":
      return "Your request has been completed.";
    case "Rejected":
      return "Your request was rejected. Open it to review the latest note.";
    default:
      return "Your request status changed.";
  }
}

export function buildCitizenNotifications(
  requests: ServiceRequest[],
): AppNotification[] {
  return requests.map((request) => ({
    id: `citizen:${request.id}:${request.status}:${request.updatedAt}`,
    audience: "citizen",
    title: `${request.reference} is ${request.status}`,
    message: getCitizenMessage(request),
    meta: `${request.department} • Updated ${request.updatedAt}`,
    href: `/citizen/request/${request.id}`,
    createdAt: request.updatedAt,
    requestId: request.id,
    tone: getCitizenTone(request.status),
  }));
}

function getEmployeeTone(request: ServiceRequest): AppNotification["tone"] {
  if (request.status === "Escalated" || request.priority === "High") {
    return "urgent";
  }
  if (request.status === "Pending Documents") return "warning";
  return "info";
}

function getEmployeeTitle(request: ServiceRequest) {
  if (request.status === "Escalated") {
    return `Escalated request: ${request.reference}`;
  }
  if (request.priority === "High") {
    return `High-priority request: ${request.reference}`;
  }
  return `New request received: ${request.reference}`;
}

export function buildEmployeeNotifications(
  requests: ServiceRequest[],
  isAdmin: boolean,
): AppNotification[] {
  return requests
    .filter((request) => {
      if (isAdmin) {
        return (
          request.status === "Escalated" ||
          request.priority === "High" ||
          request.status === "Pending Documents" ||
          request.status === "Submitted"
        );
      }

      return ["Submitted", "Under Review", "Pending Documents"].includes(
        request.status,
      );
    })
    .map((request) => ({
      id: `employee:${request.id}:${request.status}:${request.updatedAt}`,
      audience: "employee",
      title: getEmployeeTitle(request),
      message: `${request.title} needs attention in ${request.department}.`,
      meta: `${request.priority} priority • Updated ${request.updatedAt}`,
      href: `/employee/reviews/${request.id}`,
      createdAt: request.updatedAt,
      requestId: request.id,
      tone: getEmployeeTone(request),
    }));
}
