from datetime import datetime
from pathlib import Path
import re

from fastapi import Depends, FastAPI, HTTPException, File, Form, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import (
    authenticate_user,
    create_access_token,
    decode_access_token,
    get_current_user,
    hash_password,
    require_roles,
)
from database import engine, get_db, test_db_connection
from models import (
    Base,
    RequestActivity,
    RequestDocument,
    Service,
    ServiceRequest,
    Tenant,
    User,
)
from seed_data import (
    seed_request_activity,
    seed_request_documents,
    seed_requests,
    seed_services,
    seed_tenants,
    seed_users,
)

app = FastAPI(title="CivicFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

UPLOADS_DIR = Path(__file__).resolve().parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)


def current_timestamp():
    return datetime.now().strftime("%Y-%m-%d %H:%M")


def generate_request_reference(db: Session):
    count = db.query(ServiceRequest).count() + 1
    return f"BRT-2026-{count:05d}"


def serialize_user(user: User):
    return {
        "id": user.id,
        "tenant_id": user.tenant_id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "municipality": user.municipality,
        "is_active": user.is_active,
    }


def serialize_request(request: ServiceRequest):
    return {
        "id": request.id,
        "tenant_id": request.tenant_id,
        "service_id": request.service_id,
        "citizen_user_id": request.citizen_user_id,
        "reference": request.reference,
        "title": request.title,
        "status": request.status,
        "priority": request.priority,
        "submitted_at": request.submitted_at,
        "updated_at": request.updated_at,
        "department": request.department,
        "assigned_reviewer_id": request.assigned_reviewer_id,
        "summary": request.summary,
        "notes": request.notes,
        "is_escalated": request.is_escalated,
        "escalated_at": request.escalated_at,
    }


def serialize_activity(activity: RequestActivity):
    return {
        "id": activity.id,
        "request_id": activity.request_id,
        "author_user_id": activity.author_user_id,
        "author_name": activity.author_name,
        "role": activity.role,
        "activity_type": activity.activity_type,
        "status": activity.status,
        "message": activity.message,
        "created_at": activity.created_at,
    }


def serialize_document(document: RequestDocument):
    return {
        "id": document.id,
        "request_id": document.request_id,
        "file_name": document.file_name,
        "mime_type": document.mime_type,
        "size_label": document.size_label,
        "uploaded_at": document.uploaded_at,
        "download_path": f"/documents/{document.id}/download",
    }


def can_access_request(current_user: User, request: ServiceRequest) -> bool:
    if current_user.role == "super_admin":
        return True

    if current_user.role == "citizen":
        return request.citizen_user_id == current_user.id

    return request.tenant_id == current_user.tenant_id


def priority_rank(priority: str) -> int:
    return {"High": 0, "Medium": 1, "Low": 2}.get(priority, 3)


def sort_requests_for_queue(requests: list[ServiceRequest]) -> list[ServiceRequest]:
    def sort_key(item: ServiceRequest):
        timestamp = int(datetime.strptime(item.updated_at, "%Y-%m-%d %H:%M").timestamp())
        return (
            0 if item.is_escalated else 1,
            priority_rank(item.priority),
            -timestamp,
        )

    return sorted(requests, key=sort_key)


def role_label(role: str) -> str:
    return role.replace("_", " ").title()


def format_size(num_bytes: int) -> str:
    if num_bytes < 1024:
        return f"{num_bytes} B"
    if num_bytes < 1024 * 1024:
        return f"{round(num_bytes / 1024)} KB"
    return f"{round(num_bytes / (1024 * 1024), 1)} MB"


def sanitize_filename(filename: str) -> str:
    safe = re.sub(r"[^A-Za-z0-9._-]", "-", filename or "document")
    return safe[:120] or "document"


def resolve_document_path(document: RequestDocument) -> Path:
    return UPLOADS_DIR / f"{document.id}__{sanitize_filename(document.file_name)}"


def get_user_from_access_token(token: str, db: Session) -> User:
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")

    return user


class LoginPayload(BaseModel):
    email: str
    password: str


class RegisterPayload(BaseModel):
    full_name: str
    email: str
    password: str
    municipality: str


class UpdateRequestStatusPayload(BaseModel):
    status: str
    actor_name: str | None = None
    role: str | None = None
    message: str
    activity_type: str = "status_update"
    actor_user_id: str | None = None
    assigned_reviewer_id: str | None = None


class CreateRequestPayload(BaseModel):
    service_id: str
    title: str
    priority: str = "Medium"
    summary: str
    notes: str | None = None
    documents: list[str] = []


@app.get("/")
def read_root():
    return {"message": "CivicFlow backend is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/db-check")
def db_check():
    result = test_db_connection()
    return {"database": "connected", "result": result}


@app.post("/auth/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.email, payload.password)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(
        subject=user.id,
        role=user.role,
        tenant_id=user.tenant_id,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": serialize_user(user),
    }


@app.post("/auth/register")
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email.strip().lower()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    tenant = db.query(Tenant).filter(Tenant.name == payload.municipality).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Municipality not found")

    if len(payload.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")

    new_user = User(
        id=f"user-{int(datetime.now().timestamp() * 1000)}",
        tenant_id=tenant.id,
        full_name=payload.full_name.strip(),
        email=payload.email.strip().lower(),
        role="citizen",
        municipality=tenant.name,
        password_hash=hash_password(payload.password),
        is_active=True,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(
        subject=new_user.id,
        role=new_user.role,
        tenant_id=new_user.tenant_id,
    )

    return {
        "message": "Account created successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": serialize_user(new_user),
    }


@app.get("/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    return serialize_user(current_user)


@app.get("/me/requests")
def get_my_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role == "citizen":
        requests = (
            db.query(ServiceRequest)
            .filter(ServiceRequest.citizen_user_id == current_user.id)
            .all()
        )
        return [serialize_request(item) for item in sort_requests_for_queue(requests)]

    if current_user.role in {"employee", "municipality_admin"}:
        requests = (
            db.query(ServiceRequest)
            .filter(ServiceRequest.tenant_id == current_user.tenant_id)
            .all()
        )
        return [serialize_request(item) for item in sort_requests_for_queue(requests)]

    requests = db.query(ServiceRequest).all()
    return [serialize_request(item) for item in sort_requests_for_queue(requests)]


@app.get("/me/requests/{request_id}")
def get_my_request_details(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    request = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if not can_access_request(current_user, request):
        raise HTTPException(status_code=403, detail="You do not have access to this request")

    activity = (
        db.query(RequestActivity)
        .filter(RequestActivity.request_id == request_id)
        .all()
    )

    documents = (
        db.query(RequestDocument)
        .filter(RequestDocument.request_id == request_id)
        .all()
    )

    return {
        "request": serialize_request(request),
        "activity": [serialize_activity(item) for item in activity],
        "documents": [serialize_document(item) for item in documents],
    }


@app.post("/me/requests")
async def create_my_request(
    service_id: str = Form(...),
    title: str = Form(...),
    priority: str = Form("Medium"),
    summary: str = Form(...),
    notes: str | None = Form(None),
    files: list[UploadFile] | None = File(None),
    current_user: User = Depends(require_roles("citizen")),
    db: Session = Depends(get_db),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    if current_user.tenant_id != service.tenant_id:
        raise HTTPException(
            status_code=400,
            detail="Citizen and service belong to different tenants",
        )

    now = current_timestamp()
    request_id = f"req-{int(datetime.now().timestamp() * 1000)}"

    new_request = ServiceRequest(
        id=request_id,
        tenant_id=service.tenant_id,
        service_id=service.id,
        citizen_user_id=current_user.id,
        reference=generate_request_reference(db),
        title=title,
        status="Submitted",
        priority=priority,
        submitted_at=now,
        updated_at=now,
        department=service.category,
        assigned_reviewer_id=None,
        summary=summary,
        notes=notes,
        is_escalated=False,
        escalated_at=None,
    )
    db.add(new_request)
    db.flush()

    initial_activity = RequestActivity(
        id=f"activity-{int(datetime.now().timestamp() * 1000)}",
        request_id=request_id,
        author_user_id=current_user.id,
        author_name=current_user.full_name,
        role="Citizen",
        activity_type="submission",
        status="Submitted",
        message="Request submitted through the citizen portal.",
        created_at=now,
    )
    db.add(initial_activity)

    created_documents = []
    for index, upload in enumerate(files or [], start=1):
        document_id = f"doc-{request_id}-{index}"
        content = await upload.read()
        document = RequestDocument(
            id=document_id,
            request_id=request_id,
            file_name=upload.filename or f"document-{index}",
            mime_type=upload.content_type or "application/octet-stream",
            size_label=format_size(len(content)),
            uploaded_at=now,
        )
        db.add(document)

        output_path = resolve_document_path(document)
        output_path.write_bytes(content)
        created_documents.append(document)

    db.commit()

    return {
        "message": "Request created successfully",
        "request": serialize_request(new_request),
        "activity": serialize_activity(initial_activity),
        "documents": [serialize_document(doc) for doc in created_documents],
    }


@app.get("/documents/{document_id}/download")
def download_document(
    document_id: str,
    token: str = Query(...),
    db: Session = Depends(get_db),
):
    current_user = get_user_from_access_token(token, db)

    document = db.query(RequestDocument).filter(RequestDocument.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    request = db.query(ServiceRequest).filter(ServiceRequest.id == document.request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Parent request not found")

    if not can_access_request(current_user, request):
        raise HTTPException(status_code=403, detail="You do not have access to this document")

    file_path = resolve_document_path(document)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Stored file not found")

    return FileResponse(
        file_path,
        media_type=document.mime_type or "application/octet-stream",
        filename=document.file_name,
    )


@app.patch("/me/requests/{request_id}/status")
def update_my_request_status(
    request_id: str,
    payload: UpdateRequestStatusPayload,
    current_user: User = Depends(require_roles("employee", "municipality_admin", "super_admin")),
    db: Session = Depends(get_db),
):
    request = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if not can_access_request(current_user, request):
        raise HTTPException(status_code=403, detail="You do not have access to this request")

    request.status = payload.status
    request.updated_at = current_timestamp()

    if payload.assigned_reviewer_id is not None:
        request.assigned_reviewer_id = payload.assigned_reviewer_id

    if payload.status == "Escalated":
        request.is_escalated = True
        request.escalated_at = request.updated_at
    elif payload.status in {"Department Approved", "Final Approval", "Rejected", "Completed"}:
        request.is_escalated = False
        request.escalated_at = None

    activity = RequestActivity(
        id=f"activity-{int(datetime.now().timestamp() * 1000)}",
        request_id=request.id,
        author_user_id=current_user.id,
        author_name=current_user.full_name,
        role=role_label(current_user.role),
        activity_type=payload.activity_type,
        status=payload.status,
        message=payload.message,
        created_at=request.updated_at,
    )

    db.add(activity)
    db.commit()
    db.refresh(request)

    return {
        "message": "Request status updated successfully",
        "request": serialize_request(request),
        "activity": serialize_activity(activity),
    }


@app.get("/tenants")
def get_tenants(db: Session = Depends(get_db)):
    return db.query(Tenant).all()


@app.post("/seed/tenants")
def seed_tenants_route(db: Session = Depends(get_db)):
    return seed_tenants(db)


@app.get("/services")
def get_services(db: Session = Depends(get_db)):
    return db.query(Service).all()


@app.post("/seed/services")
def seed_services_route(db: Session = Depends(get_db)):
    return seed_services(db)


@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.post("/seed/users")
def seed_users_route(db: Session = Depends(get_db)):
    return seed_users(db)


@app.get("/requests")
def get_requests(db: Session = Depends(get_db)):
    return [serialize_request(item) for item in db.query(ServiceRequest).all()]


@app.post("/requests")
def create_request(payload: CreateRequestPayload, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == payload.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    citizen = db.query(User).filter(User.id == "user-1").first()
    if not citizen:
        raise HTTPException(status_code=404, detail="Citizen user not found")

    if citizen.tenant_id != service.tenant_id:
        raise HTTPException(
            status_code=400,
            detail="Citizen and service belong to different tenants",
        )

    now = current_timestamp()
    request_id = f"req-{int(datetime.now().timestamp() * 1000)}"

    new_request = ServiceRequest(
        id=request_id,
        tenant_id=service.tenant_id,
        service_id=service.id,
        citizen_user_id=citizen.id,
        reference=generate_request_reference(db),
        title=payload.title,
        status="Submitted",
        priority=payload.priority,
        submitted_at=now,
        updated_at=now,
        department=service.category,
        assigned_reviewer_id=None,
        summary=payload.summary,
        notes=payload.notes,
        is_escalated=False,
        escalated_at=None,
    )
    db.add(new_request)
    db.flush()

    initial_activity = RequestActivity(
        id=f"activity-{int(datetime.now().timestamp() * 1000)}",
        request_id=request_id,
        author_user_id=citizen.id,
        author_name=citizen.full_name,
        role="Citizen",
        activity_type="submission",
        status="Submitted",
        message="Request submitted through the citizen portal.",
        created_at=now,
    )
    db.add(initial_activity)

    created_documents = []
    for index, file_name in enumerate(payload.documents, start=1):
        document = RequestDocument(
            id=f"doc-{request_id}-{index}",
            request_id=request_id,
            file_name=file_name,
            mime_type="application/octet-stream",
            size_label="Unknown",
            uploaded_at=now,
        )
        db.add(document)
        created_documents.append(document)

    db.commit()

    return {
        "message": "Request created successfully",
        "request": serialize_request(new_request),
        "activity": serialize_activity(initial_activity),
        "documents": [serialize_document(doc) for doc in created_documents],
    }


@app.post("/seed/requests")
def seed_requests_route(db: Session = Depends(get_db)):
    return seed_requests(db)


@app.get("/request-activity")
def get_request_activity(db: Session = Depends(get_db)):
    return db.query(RequestActivity).all()


@app.post("/seed/request-activity")
def seed_request_activity_route(db: Session = Depends(get_db)):
    return seed_request_activity(db)


@app.get("/request-documents")
def get_request_documents(db: Session = Depends(get_db)):
    return db.query(RequestDocument).all()


@app.post("/seed/request-documents")
def seed_request_documents_route(db: Session = Depends(get_db)):
    return seed_request_documents(db)


@app.get("/requests/{request_id}")
def get_request_details(request_id: str, db: Session = Depends(get_db)):
    request = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    activity = (
        db.query(RequestActivity)
        .filter(RequestActivity.request_id == request_id)
        .all()
    )

    documents = (
        db.query(RequestDocument)
        .filter(RequestDocument.request_id == request_id)
        .all()
    )

    return {
        "request": serialize_request(request),
        "activity": [serialize_activity(item) for item in activity],
        "documents": [serialize_document(item) for item in documents],
    }


@app.patch("/requests/{request_id}/status")
def update_request_status(
    request_id: str,
    payload: UpdateRequestStatusPayload,
    db: Session = Depends(get_db),
):
    request = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    request.status = payload.status
    request.updated_at = current_timestamp()

    if payload.assigned_reviewer_id is not None:
        request.assigned_reviewer_id = payload.assigned_reviewer_id

    if payload.status == "Escalated":
        request.is_escalated = True
        request.escalated_at = request.updated_at
    elif payload.status in {"Department Approved", "Final Approval", "Rejected", "Completed"}:
        request.is_escalated = False
        request.escalated_at = None

    activity = RequestActivity(
        id=f"activity-{int(datetime.now().timestamp() * 1000)}",
        request_id=request.id,
        author_user_id=payload.actor_user_id,
        author_name=payload.actor_name or "Demo User",
        role=payload.role or "Demo Role",
        activity_type=payload.activity_type,
        status=payload.status,
        message=payload.message,
        created_at=request.updated_at,
    )

    db.add(activity)
    db.commit()
    db.refresh(request)

    return {
        "message": "Request status updated successfully",
        "request": serialize_request(request),
        "activity": serialize_activity(activity),
    }
