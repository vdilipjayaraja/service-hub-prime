
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Date, Text, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

# ENUM definitions
user_role_enum = ENUM('admin', 'technician', 'client', name='user_role')
client_type_enum = ENUM('managed_site', 'individual', 'walk_in', name='client_type')
device_type_enum = ENUM('PC', 'Server', 'Network', 'CCTV', 'Printer', 'Other', name='device_type')
device_status_enum = ENUM('active', 'in_repair', 'retired', 'maintenance', name='device_status')
request_status_enum = ENUM('open', 'assigned', 'in_progress', 'resolved', 'closed', name='request_status')
request_priority_enum = ENUM('low', 'medium', 'high', 'urgent', name='request_priority')
technician_status_enum = ENUM('available', 'busy', 'offline', name='technician_status')
asset_type_enum = ENUM('Laptop', 'Desktop', 'Monitor', 'Network_Equipment', 'Tool', 'Other', name='asset_type')
asset_status_enum = ENUM('available', 'assigned_to_tech', 'on_loan_to_client', 'maintenance', name='asset_status')
asset_request_type_enum = ENUM('assignment', 'modification', 'maintenance', name='asset_request_type')
asset_request_status_enum = ENUM('pending', 'approved', 'rejected', name='asset_request_status')
notification_type_enum = ENUM('device_action', 'asset_action', name='notification_type')

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(user_role_enum, nullable=False)
    avatar = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    contact_person = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50))
    address = Column(Text)
    type = Column(client_type_enum, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    devices = relationship("Device", back_populates="client")
    service_requests = relationship("ServiceRequest", back_populates="client")

class Technician(Base):
    __tablename__ = "technicians"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    status = Column(technician_status_enum, default='available')
    specialization = Column(ARRAY(String))
    active_requests = Column(Integer, default=0)
    avatar = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    assigned_requests = relationship("ServiceRequest", back_populates="technician")
    assigned_assets = relationship("Asset", back_populates="technician")
    asset_requests = relationship("AssetRequest", back_populates="requester")

class Device(Base):
    __tablename__ = "devices"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id", ondelete="CASCADE"))
    device_code = Column(String(100), unique=True, nullable=False)
    device_type = Column(device_type_enum, nullable=False)
    manufacturer = Column(String(255))
    model = Column(String(255))
    serial_number = Column(String(255))
    purchase_date = Column(Date)
    warranty_expiry = Column(Date)
    status = Column(device_status_enum, default='active')
    location = Column(String(255))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    client = relationship("Client", back_populates="devices")
    service_requests = relationship("ServiceRequest", back_populates="device")

class ServiceRequest(Base):
    __tablename__ = "service_requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(String(50), unique=True, nullable=False)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id", ondelete="CASCADE"))
    device_id = Column(UUID(as_uuid=True), ForeignKey("devices.id", ondelete="SET NULL"))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(request_status_enum, default='open')
    priority = Column(request_priority_enum, default='medium')
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("technicians.id", ondelete="SET NULL"))
    submitted_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    assigned_at = Column(DateTime)
    resolution_notes = Column(Text)
    
    # Relationships
    client = relationship("Client", back_populates="service_requests")
    device = relationship("Device", back_populates="service_requests")
    technician = relationship("Technician", back_populates="assigned_requests")
    submitter = relationship("User")

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_tag = Column(String(100), unique=True, nullable=False)
    asset_type = Column(asset_type_enum, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255))
    status = Column(asset_status_enum, default='available')
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("technicians.id", ondelete="SET NULL"))
    last_maintenance = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    technician = relationship("Technician", back_populates="assigned_assets")
    asset_requests = relationship("AssetRequest", back_populates="asset")

class AssetRequest(Base):
    __tablename__ = "asset_requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id", ondelete="CASCADE"))
    requested_by = Column(UUID(as_uuid=True), ForeignKey("technicians.id", ondelete="CASCADE"))
    request_type = Column(asset_request_type_enum, nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(asset_request_status_enum, default='pending')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    asset = relationship("Asset", back_populates="asset_requests")
    requester = relationship("Technician", back_populates="asset_requests")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User")

class AdminNotification(Base):
    __tablename__ = "admin_notifications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(notification_type_enum, nullable=False)
    action = Column(String(255), nullable=False)
    technician_name = Column(String(255), nullable=False)
    device_name = Column(String(255))
    asset_name = Column(String(255))
    acknowledged = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
