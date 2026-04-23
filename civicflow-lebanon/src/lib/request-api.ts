const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

import { getAccessToken, clearSession, getStoredUser } from "@/lib/auth";
import { services } from "@/lib/mock-data";
import type {
  CreateRequestInput,
  RequestStatus,
  ServiceRequest,
} from "@/types";

interface BackendRequest {
  id: string;
  tenant_id: string;
  service_id: string;
  citizen_user_id: string;
  reference: string;
  title: string;
  status: string;
  priority: string;
  submitted_at: string;
  updated_at: string;
  department: string;
  assigned_reviewer_id?: string | null;
  summary: string;
  notes?: string | null;
  is_escalated?: boolean;
  escalated_at?: string | null;
}

interface BackendActivity {
  id: string;
  request_id: string;
  author_user_id?: string | null;
  author_name: string;
  role: string;
  activity_type: string;
  status?: string | null;
  message: string;
  created_at: string;
}

interface BackendDocument {
  id: string;
  request_id: string;
  file_name: string;
  mime_type?: string | null;
  size_label?: string | null;
  uploaded_at: string;
  download_path?: string;
}

interface BackendRequestDetailsResponse {
  request: BackendRequest;
  activity: BackendActivity[];
  documents: BackendDocument[];
}

interface BackendCreateRequestResponse {
  message: string;
  request: BackendRequest;
  activity: BackendActivity;
  documents: BackendDocument[];
}

function mapReviewerName(assignedReviewerId?: string | null) {
  if (!assignedReviewerId) return "Not assigned yet";
  if (assignedReviewerId === "user-2") return "Karim Nader";
  if (assignedReviewerId === "user-3") return "Rana Khoury";
  if (assignedReviewerId === "user-4") return "Platform Operator";
  return assignedReviewerId;
}

function mapCitizenProfile(citizenUserId: string) {
  const currentUser = getStoredUser();

  if (currentUser && currentUser.id === citizenUserId) {
    return {
      applicantName: currentUser.full_name,
      applicantPhone: "Not provided",
    };
  }

  if (citizenUserId === "user-1") {
    return {
      applicantName: "Maya Haddad",
      applicantPhone: "+961 70 123 456",
    };
  }

  return {
    applicantName: "Citizen user",
    applicantPhone: "Not provided",
  };
}

function mapRequestToFrontend(
  request: BackendRequest,
  activity: BackendActivity[] = [],
  documents: BackendDocument[] = [],
): ServiceRequest {
  const citizenProfile = mapCitizenProfile(request.citizen_user_id);

  const mappedActivity = activity.map((item) => ({
    id: item.id,
    author: item.author_name,
    role: item.role,
    time: item.created_at,
    message: item.message,
  }));

  const mappedTimeline =
    activity.length > 0
      ? activity.map((item) => ({
          id: `timeline-${item.id}`,
          status: item.status || request.status,
          actor: item.author_name,
          timestamp: item.created_at,
          note: item.message,
        }))
      : [
          {
            id: `timeline-${request.id}`,
            status: request.status,
            actor: mapReviewerName(request.assigned_reviewer_id),
            timestamp: request.updated_at,
            note: request.summary,
          },
        ];

  return {
    id: request.id,
    tenantId: request.tenant_id,
    reference: request.reference,
    title: request.title,
    serviceId: request.service_id,
    status: request.status as ServiceRequest["status"],
    priority: request.priority as ServiceRequest["priority"],
    submittedAt: request.submitted_at,
    updatedAt: request.updated_at,
    department: request.department,
    assignedReviewer: mapReviewerName(request.assigned_reviewer_id),
    summary: request.summary,
    applicantName: citizenProfile.applicantName,
    applicantPhone: citizenProfile.applicantPhone,
    notes: request.notes || "",
    documents: documents.map((doc) => ({
      id: doc.id,
      name: doc.file_name,
      uploadedAt: doc.uploaded_at,
      sizeLabel: doc.size_label || "Unknown",
      mimeType: doc.mime_type || "application/octet-stream",
      downloadPath: doc.download_path || undefined,
    })) as any,
    timeline: mappedTimeline,
    activity: mappedActivity,
  };
}

async function fetchWithAuth(input: string, init?: RequestInit) {
  const token = getAccessToken();

  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    clearSession();
  }

  return response;
}

export async function createRequest(
  input: CreateRequestInput,
): Promise<ServiceRequest> {
  const service = services.find((item) => item.id === input.serviceId);
  const formData = new FormData();

  formData.append("service_id", input.serviceId);
  formData.append(
    "title",
    service ? `${service.title} Request` : "New citizen request",
  );
  formData.append("priority", input.priority || "Medium");
  formData.append(
    "summary",
    input.notes.trim() ||
      `Citizen submitted a new request for ${service?.title || "a municipal service"}.`,
  );
  formData.append("notes", input.notes);

  (input.files as any[]).forEach((file) => {
    if (file instanceof File) {
      formData.append("files", file);
    }
  });

  const response = await fetchWithAuth(`${API_BASE_URL}/me/requests`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create request");
  }

  const data = (await response.json()) as BackendCreateRequestResponse;

  return mapRequestToFrontend(
    data.request,
    data.activity ? [data.activity] : [],
    data.documents || [],
  );
}

export async function getRequestById(
  id: string,
): Promise<ServiceRequest | null> {
  const response = await fetchWithAuth(`${API_BASE_URL}/me/requests/${id}`);

  if (response.status === 404) return null;

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch request");
  }

  const data = (await response.json()) as BackendRequestDetailsResponse;

  return mapRequestToFrontend(data.request, data.activity, data.documents);
}

export async function getAllRequests(): Promise<ServiceRequest[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/me/requests`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch requests");
  }

  const data = (await response.json()) as BackendRequest[];

  return data
    .map((request) => mapRequestToFrontend(request))
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

interface UpdateRequestStatusInput {
  id: string;
  status: RequestStatus;
  actor: string;
  role: string;
  note: string;
  assignedReviewer?: string;
}

function mapReviewerNameToId(name?: string) {
  if (!name) return null;
  if (name === "Karim Nader") return "user-2";
  if (name === "Rana Khoury") return "user-3";
  if (name === "Platform Operator") return "user-4";
  if (name === "Not assigned yet") return null;
  return null;
}

function inferActivityType(status: RequestStatus) {
  switch (status) {
    case "Department Approved":
    case "Final Approval":
    case "Completed":
      return "approval";
    case "Pending Documents":
      return "document_request";
    case "Escalated":
      return "escalation";
    case "Rejected":
      return "rejection";
    default:
      return "status_update";
  }
}

export async function updateRequestStatus({
  id,
  status,
  actor,
  role,
  note,
  assignedReviewer,
}: UpdateRequestStatusInput): Promise<ServiceRequest> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/me/requests/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        actor_name: actor,
        role,
        message: note,
        activity_type: inferActivityType(status),
        actor_user_id:
          actor === "Karim Nader"
            ? "user-2"
            : actor === "Rana Khoury"
              ? "user-3"
              : null,
        assigned_reviewer_id: mapReviewerNameToId(assignedReviewer),
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update request");
  }

  const refreshed = await getRequestById(id);

  if (!refreshed) {
    throw new Error("Request was updated but could not be reloaded");
  }

  return refreshed;
}
