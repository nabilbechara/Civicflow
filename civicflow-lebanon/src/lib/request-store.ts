import { serviceRequests, services } from "@/lib/mock-data";
import type {
  CreateRequestInput,
  RequestActivityItem,
  RequestDocument,
  RequestStatus,
  RequestTimelineItem,
  ServiceRequest,
} from "@/types";

const STORAGE_KEY = "civicflow.requests.v1";

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createTimestamp(date = new Date()) {
  const iso = date.toISOString();
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)}`;
}

function normalizeSeedRequest(request: ServiceRequest): ServiceRequest {
  const fallbackTimeline: RequestTimelineItem[] = [
    {
      id: createId("timeline"),
      status: request.status,
      actor: request.assignedReviewer || "Municipality Workflow",
      timestamp: request.updatedAt,
      note: `Demo request currently marked as ${request.status}.`,
    },
  ];

  const fallbackActivity: RequestActivityItem[] = [
    {
      id: createId("activity"),
      author: request.assignedReviewer || "System",
      role: "Demo Data",
      time: request.updatedAt,
      message: request.summary,
      status: request.status,
      activityType: "status_update",
    },
  ];

  return {
    ...request,
    applicantName: request.applicantName || "Maya Haddad",
    applicantPhone: request.applicantPhone || "+961 70 123 456",
    notes: request.notes || request.summary,
    documents: request.documents || [],
    timeline: request.timeline?.length ? request.timeline : fallbackTimeline,
    activity: request.activity?.length ? request.activity : fallbackActivity,
  };
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function ensureSeeded() {
  if (!canUseStorage()) return;

  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return;

  const seeded = serviceRequests.map(normalizeSeedRequest);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
}

function readRequests(): ServiceRequest[] {
  if (!canUseStorage()) {
    return serviceRequests.map(normalizeSeedRequest);
  }

  ensureSeeded();

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return serviceRequests.map(normalizeSeedRequest);

  try {
    const parsed = JSON.parse(raw) as ServiceRequest[];
    return parsed;
  } catch {
    return serviceRequests.map(normalizeSeedRequest);
  }
}

function writeRequests(requests: ServiceRequest[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

function buildReference(currentCount: number) {
  const nextSequence = String(141 + currentCount).padStart(5, "0");
  return `BRT-2026-${nextSequence}`;
}

export function getAllRequests() {
  return readRequests().sort((a, b) =>
    b.submittedAt.localeCompare(a.submittedAt),
  );
}

export function getRequestById(id: string) {
  return readRequests().find((request) => request.id === id) || null;
}

export function createRequest(input: CreateRequestInput) {
  const service = services.find((item) => item.id === input.serviceId);

  if (!service) {
    throw new Error("Service not found while creating request.");
  }

  const currentRequests = readRequests();
  const now = createTimestamp();

  const documents: RequestDocument[] = input.files.map((fileName) => ({
    id: createId("doc"),
    name: fileName,
    uploadedAt: now,
    sizeLabel: "Demo file",
    mimeType: "application/pdf",
  }));

  const created: ServiceRequest = {
    id: createId("req"),
    tenantId: input.tenantId,
    reference: buildReference(currentRequests.length),
    title: `${service.title} Request`,
    serviceId: service.id,
    status: "Submitted",
    priority: input.priority || "Medium",
    submittedAt: now,
    updatedAt: now,
    department: service.category,
    assignedReviewer: "Not assigned yet",
    summary:
      input.notes.trim() ||
      `New ${service.title.toLowerCase()} request submitted by ${input.applicantName}.`,
    applicantName: input.applicantName,
    applicantPhone: input.applicantPhone,
    notes: input.notes,
    documents,
    timeline: [
      {
        id: createId("timeline"),
        status: "Submitted",
        actor: "Citizen Portal",
        timestamp: now,
        note: "Request created and submitted successfully.",
      },
    ],
    activity: [
        {
          id: createId("activity"),
          author: input.applicantName,
          role: "Citizen",
          time: now,
          message:
            input.notes.trim() ||
            `Submitted a new ${service.title.toLowerCase()} request through the portal.`,
          status: "Submitted",
          activityType: "submission",
        },
    ],
  };

  const updated = [created, ...currentRequests];
  writeRequests(updated);

  return created;
}

interface UpdateRequestStatusInput {
  id: string;
  status: RequestStatus;
  actor: string;
  role: string;
  note: string;
  assignedReviewer?: string;
}

export function updateRequestStatus({
  id,
  status,
  actor,
  role,
  note,
  assignedReviewer,
}: UpdateRequestStatusInput) {
  const requests = readRequests();
  const now = createTimestamp();

  let updatedRequest: ServiceRequest | null = null;

  const updatedRequests = requests.map((request) => {
    if (request.id !== id) return request;

    const nextRequest: ServiceRequest = {
      ...request,
      status,
      updatedAt: now,
      assignedReviewer: assignedReviewer || request.assignedReviewer,
      timeline: [
        ...(request.timeline || []),
        {
          id: createId("timeline"),
          status,
          actor,
          timestamp: now,
          note,
        },
      ],
      activity: [
        ...(request.activity || []),
        {
          id: createId("activity"),
          author: actor,
          role,
          time: now,
          message: note,
          status,
          activityType: "status_update",
        },
      ],
    };

    updatedRequest = nextRequest;
    return nextRequest;
  });

  writeRequests(updatedRequests);
  return updatedRequest;
}
