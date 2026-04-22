from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Boolean, ForeignKey, Integer, String


class Base(DeclarativeBase):
    pass


class Tenant(Base):
    __tablename__ = "tenants"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    region: Mapped[str] = mapped_column(String(100), nullable=False)


class Service(Base):
    __tablename__ = "services"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    tenant_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("tenants.id"),
        nullable=False,
    )
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(300), nullable=False)
    estimated_days: Mapped[int] = mapped_column(Integer, nullable=False)


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    tenant_id: Mapped[str | None] = mapped_column(
        String,
        ForeignKey("tenants.id"),
        nullable=True,
    )
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    municipality: Mapped[str] = mapped_column(String(150), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class ServiceRequest(Base):
    __tablename__ = "service_requests"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    tenant_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("tenants.id"),
        nullable=False,
    )
    service_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("services.id"),
        nullable=False,
    )
    citizen_user_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("users.id"),
        nullable=False,
    )
    reference: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    priority: Mapped[str] = mapped_column(String(50), nullable=False)
    submitted_at: Mapped[str] = mapped_column(String(50), nullable=False)
    updated_at: Mapped[str] = mapped_column(String(50), nullable=False)
    department: Mapped[str] = mapped_column(String(100), nullable=False)
    assigned_reviewer_id: Mapped[str | None] = mapped_column(
        String,
        ForeignKey("users.id"),
        nullable=True,
    )
    summary: Mapped[str] = mapped_column(String(500), nullable=False)
    notes: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    is_escalated: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    escalated_at: Mapped[str | None] = mapped_column(String(50), nullable=True)


class RequestActivity(Base):
    __tablename__ = "request_activity"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    request_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("service_requests.id"),
        nullable=False,
    )
    author_user_id: Mapped[str | None] = mapped_column(
        String,
        ForeignKey("users.id"),
        nullable=True,
    )
    author_name: Mapped[str] = mapped_column(String(150), nullable=False)
    role: Mapped[str] = mapped_column(String(100), nullable=False)
    activity_type: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str | None] = mapped_column(String(50), nullable=True)
    message: Mapped[str] = mapped_column(String(1000), nullable=False)
    created_at: Mapped[str] = mapped_column(String(50), nullable=False)


class RequestDocument(Base):
    __tablename__ = "request_documents"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    request_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("service_requests.id"),
        nullable=False,
    )
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    mime_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    size_label: Mapped[str | None] = mapped_column(String(50), nullable=True)
    uploaded_at: Mapped[str] = mapped_column(String(50), nullable=False)
