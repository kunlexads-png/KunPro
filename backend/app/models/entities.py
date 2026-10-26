from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, Boolean, JSON
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    plan = Column(String(50), default="Enterprise")
    currency = Column(String(10), default="USD")
    fiscal_year_start = Column(String(20), default="January")
    timezone = Column(String(50), default="America/New_York")
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="organization")
    datasets = relationship("Dataset", back_populates="organization")

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="Analyst")  # Super Admin, Business Owner, Analyst, Viewer
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String(36), primary_key=True, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)
    row_count = Column(Integer, default=0)
    column_count = Column(Integer, default=0)
    columns_schema = Column(JSON, nullable=False)
    file_size = Column(String(20), nullable=False)
    status = Column(String(50), default="active")
    uploaded_by = Column(String(255), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="datasets")

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    report_type = Column(String(50), nullable=False)
    period = Column(String(100), nullable=False)
    summary = Column(Text, nullable=False)
    kpi_payload = Column(JSON, nullable=False)
    findings = Column(JSON, nullable=False)
    anomalies = Column(JSON, nullable=False)
    recommendations = Column(JSON, nullable=False)
    created_by = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    actor = Column(String(255), nullable=False)
    action = Column(String(100), nullable=False)
    resource = Column(String(255), nullable=False)
    ip_address = Column(String(50), nullable=False)
    status = Column(String(50), default="Success")
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
