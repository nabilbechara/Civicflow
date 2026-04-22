from auth import hash_password
from models import Tenant, Service, User, ServiceRequest, RequestActivity, RequestDocument

TENANT_SEED_DATA = [
    {
        "id": "tenant-beirut",
        "slug": "beirut-municipality",
        "name": "Beirut Municipality",
        "region": "Beirut",
    },
    {
        "id": "tenant-jounieh",
        "slug": "jounieh-municipality",
        "name": "Jounieh Municipality",
        "region": "Keserwan",
    },
    {
        "id": "tenant-zahle",
        "slug": "zahle-municipality",
        "name": "Zahle Municipality",
        "region": "Bekaa",
    },
]

SERVICE_SEED_DATA = [
    {
        "id": "service-1",
        "tenant_id": "tenant-beirut",
        "title": "Residency Certificate",
        "category": "Civil Records",
        "description": "Issue an official municipal residency certificate.",
        "estimated_days": 3,
    },
    {
        "id": "service-2",
        "tenant_id": "tenant-beirut",
        "title": "Business Permit",
        "category": "Licensing",
        "description": "Apply for a new municipal business permit.",
        "estimated_days": 10,
    },
    {
        "id": "service-3",
        "tenant_id": "tenant-beirut",
        "title": "Building Complaint",
        "category": "Urban Management",
        "description": "Submit a complaint related to construction or zoning.",
        "estimated_days": 5,
    },
]

USER_SEED_DATA = [
    {
        "id": "user-1",
        "tenant_id": "tenant-beirut",
        "full_name": "Maya Haddad",
        "email": "maya.haddad@example.com",
        "role": "citizen",
        "municipality": "Beirut Municipality",
        "password_hash": hash_password("citizen123"),
        "is_active": True,
    },
    {
        "id": "user-2",
        "tenant_id": "tenant-beirut",
        "full_name": "Karim Nader",
        "email": "karim.nader@beirut.gov.lb",
        "role": "employee",
        "municipality": "Beirut Municipality",
        "password_hash": hash_password("employee123"),
        "is_active": True,
    },
    {
        "id": "user-3",
        "tenant_id": "tenant-beirut",
        "full_name": "Rana Khoury",
        "email": "rana.khoury@beirut.gov.lb",
        "role": "municipality_admin",
        "municipality": "Beirut Municipality",
        "password_hash": hash_password("admin123"),
        "is_active": True,
    },
    {
        "id": "user-4",
        "tenant_id": None,
        "full_name": "Platform Operator",
        "email": "platform@civicflow.io",
        "role": "super_admin",
        "municipality": "Platform",
        "password_hash": hash_password("superadmin123"),
        "is_active": True,
    },
]

REQUEST_SEED_DATA = [
    {
        "id": "req-1",
        "tenant_id": "tenant-beirut",
        "service_id": "service-1",
        "citizen_user_id": "user-1",
        "reference": "BRT-2026-00124",
        "title": "Residency Certificate for University Registration",
        "status": "Under Review",
        "priority": "Medium",
        "submitted_at": "2026-04-02 09:20",
        "updated_at": "2026-04-05 14:10",
        "department": "Civil Records",
        "assigned_reviewer_id": "user-2",
        "summary": "Certificate requested for academic enrollment and scholarship file.",
        "notes": "Certificate needed for university registration process.",
        "is_escalated": False,
        "escalated_at": None,
    },
    {
        "id": "req-2",
        "tenant_id": "tenant-beirut",
        "service_id": "service-2",
        "citizen_user_id": "user-1",
        "reference": "BRT-2026-00091",
        "title": "Coffee Shop Permit Renewal",
        "status": "Pending Documents",
        "priority": "High",
        "submitted_at": "2026-03-28 11:45",
        "updated_at": "2026-04-04 10:30",
        "department": "Licensing",
        "assigned_reviewer_id": "user-3",
        "summary": "Renewal request awaiting updated lease agreement.",
        "notes": "Business permit renewal for coffee shop.",
        "is_escalated": True,
        "escalated_at": "2026-04-04 10:20",
    },
    {
        "id": "req-3",
        "tenant_id": "tenant-beirut",
        "service_id": "service-3",
        "citizen_user_id": "user-1",
        "reference": "BRT-2026-00065",
        "title": "Noise and Construction Complaint",
        "status": "Completed",
        "priority": "Low",
        "submitted_at": "2026-03-15 08:15",
        "updated_at": "2026-03-21 16:40",
        "department": "Urban Management",
        "assigned_reviewer_id": "user-2",
        "summary": "Complaint investigated and closed with municipal inspection report.",
        "notes": "Construction noise complaint submitted by resident.",
        "is_escalated": False,
        "escalated_at": None,
    },
]

REQUEST_ACTIVITY_SEED_DATA = [
    {
        "id": "activity-1",
        "request_id": "req-1",
        "author_user_id": "user-1",
        "author_name": "Maya Haddad",
        "role": "Citizen",
        "activity_type": "submission",
        "status": "Submitted",
        "message": "Submitted a residency certificate request through the citizen portal.",
        "created_at": "2026-04-02 09:20",
    },
    {
        "id": "activity-2",
        "request_id": "req-1",
        "author_user_id": "user-2",
        "author_name": "Karim Nader",
        "role": "Municipal Employee",
        "activity_type": "review",
        "status": "Under Review",
        "message": "Initial review completed. Request moved to active departmental review.",
        "created_at": "2026-04-03 11:12",
    },
    {
        "id": "activity-3",
        "request_id": "req-2",
        "author_user_id": "user-3",
        "author_name": "Rana Khoury",
        "role": "Municipality Admin",
        "activity_type": "document_request",
        "status": "Pending Documents",
        "message": "Updated lease agreement required before permit renewal can proceed.",
        "created_at": "2026-04-04 10:20",
    },
    {
        "id": "activity-4",
        "request_id": "req-3",
        "author_user_id": "user-2",
        "author_name": "Karim Nader",
        "role": "Municipal Employee",
        "activity_type": "completion",
        "status": "Completed",
        "message": "Complaint investigated and officially closed.",
        "created_at": "2026-03-21 16:40",
    },
]

REQUEST_DOCUMENT_SEED_DATA = [
    {
        "id": "doc-1",
        "request_id": "req-1",
        "file_name": "national-id-copy.pdf",
        "mime_type": "application/pdf",
        "size_label": "240 KB",
        "uploaded_at": "2026-04-02 09:18",
    },
    {
        "id": "doc-2",
        "request_id": "req-1",
        "file_name": "proof-of-residence.pdf",
        "mime_type": "application/pdf",
        "size_label": "310 KB",
        "uploaded_at": "2026-04-02 09:19",
    },
    {
        "id": "doc-3",
        "request_id": "req-2",
        "file_name": "lease-agreement.pdf",
        "mime_type": "application/pdf",
        "size_label": "420 KB",
        "uploaded_at": "2026-03-28 11:40",
    },
    {
        "id": "doc-4",
        "request_id": "req-3",
        "file_name": "complaint-photos.zip",
        "mime_type": "application/zip",
        "size_label": "1.8 MB",
        "uploaded_at": "2026-03-15 08:10",
    },
]


def seed_tenants(db):
    existing_count = db.query(Tenant).count()
    if existing_count > 0:
        return {"message": "Tenants already seeded", "count": existing_count}

    tenants = [Tenant(**tenant_data) for tenant_data in TENANT_SEED_DATA]
    db.add_all(tenants)
    db.commit()

    return {"message": "Tenants seeded successfully", "count": len(tenants)}


def seed_services(db):
    existing_count = db.query(Service).count()
    if existing_count > 0:
        return {"message": "Services already seeded", "count": existing_count}

    services = [Service(**service_data) for service_data in SERVICE_SEED_DATA]
    db.add_all(services)
    db.commit()

    return {"message": "Services seeded successfully", "count": len(services)}


def seed_users(db):
    existing_count = db.query(User).count()
    if existing_count > 0:
        return {"message": "Users already seeded", "count": existing_count}

    users = [User(**user_data) for user_data in USER_SEED_DATA]
    db.add_all(users)
    db.commit()

    return {"message": "Users seeded successfully", "count": len(users)}


def seed_requests(db):
    existing_count = db.query(ServiceRequest).count()
    if existing_count > 0:
        return {"message": "Requests already seeded", "count": existing_count}

    requests = [ServiceRequest(**request_data) for request_data in REQUEST_SEED_DATA]
    db.add_all(requests)
    db.commit()

    return {"message": "Requests seeded successfully", "count": len(requests)}


def seed_request_activity(db):
    existing_count = db.query(RequestActivity).count()
    if existing_count > 0:
        return {"message": "Request activity already seeded", "count": existing_count}

    activity = [RequestActivity(**item) for item in REQUEST_ACTIVITY_SEED_DATA]
    db.add_all(activity)
    db.commit()

    return {"message": "Request activity seeded successfully", "count": len(activity)}


def seed_request_documents(db):
    existing_count = db.query(RequestDocument).count()
    if existing_count > 0:
        return {"message": "Request documents already seeded", "count": existing_count}

    documents = [RequestDocument(**item) for item in REQUEST_DOCUMENT_SEED_DATA]
    db.add_all(documents)
    db.commit()

    return {"message": "Request documents seeded successfully", "count": len(documents)}
