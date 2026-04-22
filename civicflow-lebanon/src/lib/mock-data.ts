import { Service, ServiceRequest, Tenant, User } from "@/types";

export const tenants: Tenant[] = [
  {
    id: "tenant-beirut",
    slug: "beirut-municipality",
    name: "Beirut Municipality",
    region: "Beirut",
  },
  {
    id: "tenant-jounieh",
    slug: "jounieh-municipality",
    name: "Jounieh Municipality",
    region: "Keserwan",
  },
  {
    id: "tenant-zahle",
    slug: "zahle-municipality",
    name: "Zahle Municipality",
    region: "Bekaa",
  },
];

export const demoUsers: User[] = [
  {
    id: "user-1",
    tenantId: "tenant-beirut",
    fullName: "Maya Haddad",
    email: "maya.haddad@example.com",
    role: "citizen",
    municipality: "Beirut Municipality",
  },
  {
    id: "user-2",
    tenantId: "tenant-beirut",
    fullName: "Karim Nader",
    email: "karim.nader@beirut.gov.lb",
    role: "employee",
    municipality: "Beirut Municipality",
  },
  {
    id: "user-3",
    tenantId: "tenant-beirut",
    fullName: "Rana Khoury",
    email: "rana.khoury@beirut.gov.lb",
    role: "municipality_admin",
    municipality: "Beirut Municipality",
  },
  {
    id: "user-4",
    tenantId: null,
    fullName: "Platform Operator",
    email: "platform@civicflow.io",
    role: "super_admin",
    municipality: "Platform",
  },
];

export const services: Service[] = [
  {
    id: "service-1",
    tenantId: "tenant-beirut",
    title: "Residency Certificate",
    category: "Civil Records",
    description: "Issue an official municipal residency certificate.",
    estimatedDays: 3,
  },
  {
    id: "service-2",
    tenantId: "tenant-beirut",
    title: "Business Permit",
    category: "Licensing",
    description: "Apply for a new municipal business permit.",
    estimatedDays: 10,
  },
  {
    id: "service-3",
    tenantId: "tenant-beirut",
    title: "Building Complaint",
    category: "Urban Management",
    description: "Submit a complaint related to construction or zoning.",
    estimatedDays: 5,
  },
];

export const serviceRequests: ServiceRequest[] = [
  {
    id: "req-1",
    tenantId: "tenant-beirut",
    reference: "BRT-2026-00124",
    title: "Residency Certificate for University Registration",
    status: "Under Review",
    priority: "Medium",
    submittedAt: "2026-04-02 09:20",
    updatedAt: "2026-04-05 14:10",
    department: "Civil Records",
    assignedReviewer: "Karim Nader",
    summary:
      "Certificate requested for academic enrollment and scholarship file.",
  },
  {
    id: "req-2",
    tenantId: "tenant-beirut",
    reference: "BRT-2026-00091",
    title: "Coffee Shop Permit Renewal",
    status: "Pending Documents",
    priority: "High",
    submittedAt: "2026-03-28 11:45",
    updatedAt: "2026-04-04 10:30",
    department: "Licensing",
    assignedReviewer: "Rana Khoury",
    summary: "Renewal request awaiting updated lease agreement.",
  },
  {
    id: "req-3",
    tenantId: "tenant-beirut",
    reference: "BRT-2026-00065",
    title: "Noise and Construction Complaint",
    status: "Completed",
    priority: "Low",
    submittedAt: "2026-03-15 08:15",
    updatedAt: "2026-03-21 16:40",
    department: "Urban Management",
    assignedReviewer: "Karim Nader",
    summary:
      "Complaint investigated and closed with municipal inspection report.",
  },
];
