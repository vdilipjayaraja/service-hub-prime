from sqlalchemy import Column, Integer, String, Text, DateTime, Date, BigInteger, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    email = Column(Text, unique=True, nullable=False, index=True)
    role = Column(Text, nullable=False)
    avatar = Column(Text)
    password = Column(Text)
    
    # Relationships
    service_requests_assigned = relationship("ServiceRequest", foreign_keys="ServiceRequest.assigned_to", back_populates="assigned_technician")
    service_requests_submitted = relationship("ServiceRequest", foreign_keys="ServiceRequest.submitted_by", back_populates="submitted_user")
    company_assets = relationship("CompanyAsset", back_populates="assigned_user")
    asset_requests = relationship("AssetRequest", back_populates="requested_user")
    
    __table_args__ = (
        CheckConstraint(role.in_(['admin', 'technician', 'client']), name='valid_role'),
    )

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    contact_person = Column(Text, nullable=False)
    email = Column(Text, unique=True, nullable=False, index=True)
    phone = Column(Text, nullable=False)
    address = Column(Text, nullable=False)
    type = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    devices = relationship("Device", back_populates="client", cascade="all, delete-orphan")
    service_requests = relationship("ServiceRequest", back_populates="client", cascade="all, delete-orphan")
    
    __table_args__ = (
        CheckConstraint(type.in_(['managed_site', 'individual', 'walk_in']), name='valid_client_type'),
    )

class Device(Base):
    __tablename__ = "devices"
    
    id = Column(BigInteger, primary_key=True, index=True)
    client_id = Column(BigInteger, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    device_code = Column(Text, nullable=False)
    device_type = Column(Text, nullable=False)
    manufacturer = Column(Text, nullable=False)
    model = Column(Text, nullable=False)
    serial_number = Column(Text, nullable=False)
    purchase_date = Column(Date, nullable=False)
    warranty_expiry = Column(Date, nullable=False)
    status = Column(Text, nullable=False)
    location = Column(Text, nullable=False)
    notes = Column(Text)
    
    # Relationships
    client = relationship("Client", back_populates="devices")
    service_requests = relationship("ServiceRequest", back_populates="device")
    
    __table_args__ = (
        CheckConstraint(device_type.in_(['PC', 'Server', 'Network', 'CCTV', 'Printer', 'Other']), name='valid_device_type'),
        CheckConstraint(status.in_(['active', 'in_repair', 'retired', 'maintenance']), name='valid_device_status'),
    )

class ServiceRequest(Base):
    __tablename__ = "service_requests"
    
    id = Column(BigInteger, primary_key=True, index=True)
    ticket_id = Column(Text, unique=True, nullable=False, index=True)
    client_id = Column(BigInteger, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    device_id = Column(BigInteger, ForeignKey("devices.id"))
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(Text, nullable=False)
    priority = Column(Text, nullable=False)
    assigned_to = Column(BigInteger, ForeignKey("users.id"))
    submitted_by = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    assigned_at = Column(DateTime(timezone=True))
    resolution_notes = Column(Text)
    
    # Relationships
    client = relationship("Client", back_populates="service_requests")
    device = relationship("Device", back_populates="service_requests")
    assigned_technician = relationship("User", foreign_keys=[assigned_to], back_populates="service_requests_assigned")
    submitted_user = relationship("User", foreign_keys=[submitted_by], back_populates="service_requests_submitted")
    
    __table_args__ = (
        CheckConstraint(status.in_(['open', 'assigned', 'in_progress', 'resolved', 'closed']), name='valid_request_status'),
        CheckConstraint(priority.in_(['low', 'medium', 'high', 'urgent']), name='valid_priority'),
    )

class CompanyAsset(Base):
    __tablename__ = "company_assets"
    
    id = Column(BigInteger, primary_key=True, index=True)
    asset_tag = Column(Text, unique=True, nullable=False, index=True)
    asset_type = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(Text, nullable=False)
    status = Column(Text, nullable=False)
    assigned_to = Column(BigInteger, ForeignKey("users.id"))
    last_maintenance = Column(Date)
    
    # Relationships
    assigned_user = relationship("User", back_populates="company_assets")
    asset_requests = relationship("AssetRequest", back_populates="asset")
    
    __table_args__ = (
        CheckConstraint(asset_type.in_(['Laptop', 'Desktop', 'Monitor', 'Network_Equipment', 'Tool', 'Other']), name='valid_asset_type'),
        CheckConstraint(status.in_(['available', 'assigned_to_tech', 'on_loan_to_client', 'maintenance']), name='valid_asset_status'),
    )

class AssetRequest(Base):
    __tablename__ = "asset_requests"
    
    id = Column(BigInteger, primary_key=True, index=True)
    asset_id = Column(BigInteger, ForeignKey("company_assets.id"))
    requested_by = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    request_type = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    asset = relationship("CompanyAsset", back_populates="asset_requests")
    requested_user = relationship("User", back_populates="asset_requests")
    
    __table_args__ = (
        CheckConstraint(request_type.in_(['assignment', 'modification', 'maintenance']), name='valid_request_type'),
        CheckConstraint(status.in_(['pending', 'approved', 'rejected']), name='valid_asset_request_status'),
    )

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    title = Column(Text, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Integer, default=0)  # 0 = unread, 1 = read
    type = Column(Text, nullable=False)  # e.g., 'user', 'admin'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", backref="notifications")

    __table_args__ = (
        CheckConstraint(type.in_(['user', 'admin']), name='valid_notification_type'),
    ) 