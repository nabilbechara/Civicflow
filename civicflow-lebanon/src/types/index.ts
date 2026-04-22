export type UserRole =
  | "citizen"
  | "employee"
  | "municipality_admin"
  | "super_admin";

export type RequestStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Pending Documents"
  | "Escalated"
  | "Department Approved"
  | "Final Approval"
  | "Rejected"
  | "Completed";

export type RequestPriority = "Low" | "Medium" | "High";

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  region: string;
}

export interface User {
  id: string;
  tenantId: string | null;
  fullName: string;
  email: string;
  role: UserRole;
  municipality: string;
}

export interface Service {
  id: string;
  tenantId: string;
  title: string;
  category: string;
  description: string;
  estimatedDays: number;
}

export interface RequestDocument {
  id: string;
  name: string;
  uploadedAt: string;
  sizeLabel?: string;
  mimeType?: string;
}

export interface RequestTimelineItem {
  id: string;
  status: RequestStatus;
  actor: string;
  timestamp: string;
  note?: string;
}

export interface RequestActivityItem {
  id: string;
  author: string;
  role: string;
  time: string;
  message: string;
}

export interface ServiceRequest {
  id: string;
  tenantId: string;
  reference: string;
  title: string;
  serviceId?: string;
  status: RequestStatus;
  priority: RequestPriority;
  submittedAt: string;
  updatedAt: string;
  department: string;
  assignedReviewer?: string;
  summary: string;

  applicantName?: string;
  applicantPhone?: string;
  notes?: string;

  documents?: RequestDocument[];
  timeline?: RequestTimelineItem[];
  activity?: RequestActivityItem[];
}

export interface CreateRequestInput {
  serviceId: string;
  tenantId: string;
  applicantName: string;
  applicantPhone: string;
  notes: string;
  files: string[];
  priority?: RequestPriority;
}
