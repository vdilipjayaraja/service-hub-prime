
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

# Enums
class UserRole(str, Enum):
    admin = "admin"
    technician = "technician"
    client = "client"

class ClientType(str, Enum):
    managed_site = "managed_site"
    individual = "individual"
    walk_in = "walk_in"

class DeviceType(str, Enum):
    PC = "PC"
    Server = "Server"
    Network = "Network"
    CCTV = "CCTV"
    Printer = "Printer"
    Other = "Other"

class DeviceStatus(str, Enum):
    active = "active"
    in_repair = "in_repair"
    retired = "retired"
    maintenance = "maintenance"

class RequestStatus(str, Enum):
    open = "open"
    assigned = "assigned"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"

class RequestPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"

class TechnicianStatus(str, Enum):
    available = "available"
    busy = "busy"
    offline = "offline"

class AssetType(str, Enum):
    Laptop = "Laptop"
    Desktop = "Desktop"
    Monitor = "Monitor"
    Network_Equipment = "Network_Equipment"
    Tool = "Tool"
    Other = "Other"

class AssetStatus(str, Enum):
    available = "available"
    assigned_to_tech = "assigned_to_tech"
    on_loan_to_client = "on_loan_to_client"
    maintenance = "maintenance"

class AssetRequestType(str, Enum):
    assignment = "assignment"
    modification = "modification"
    maintenance = "maintenance"

class AssetRequestStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class NotificationType(str, Enum):
    device_action = "device_action"
    asset_action = "asset_action"

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Client schemas
class ClientBase(BaseModel):
    name: str
    contact_person: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    type: ClientType

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ClientWithStats(Client):
    device_count: int = 0
    active_requests: int = 0

# Technician schemas
class TechnicianBase(BaseModel):
    name: str
    email: EmailStr
    status: TechnicianStatus = TechnicianStatus.available
    specialization: Optional[List[str]] = []
    avatar: Optional[str] = None

class TechnicianCreate(TechnicianBase):
    user_id: Optional[str] = None

class Technician(TechnicianBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TechnicianWithStats(Technician):
    active_requests: int = 0

# Device schemas
class DeviceBase(BaseModel):
    client_id: str
    device_code: str
    device_type: DeviceType
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_expiry: Optional[date] = None
    status: DeviceStatus = DeviceStatus.active
    location: Optional[str] = None
    notes: Optional[str] = None

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(BaseModel):
    device_code: Optional[str] = None
    device_type: Optional[DeviceType] = None
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_expiry: Optional[date] = None
    status: Optional[DeviceStatus] = None
    location: Optional[str] = None
    notes: Optional[str] = None

class Device(DeviceBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Service Request schemas
class ServiceRequestBase(BaseModel):
    client_id: str
    device_id: Optional[str] = None
    title: str
    description: str
    status: RequestStatus = RequestStatus.open
    priority: RequestPriority = RequestPriority.medium
    assigned_to: Optional[str] = None
    submitted_by: str
    resolution_notes: Optional[str] = None

class ServiceRequestCreate(ServiceRequestBase):
    pass

class ServiceRequestUpdate(BaseModel):
    status: Optional[RequestStatus] = None
    assigned_to: Optional[str] = None
    resolution_notes: Optional[str] = None
    assigned_at: Optional[datetime] = None

class ServiceRequest(ServiceRequestBase):
    id: str
    ticket_id: str
    created_at: datetime
    updated_at: datetime
    assigned_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ServiceRequestWithDetails(ServiceRequest):
    client_name: Optional[str] = None
    technician_name: Optional[str] = None

# Asset schemas
class AssetBase(BaseModel):
    asset_tag: str
    asset_type: AssetType
    description: str
    location: Optional[str] = None
    status: AssetStatus = AssetStatus.available
    assigned_to: Optional[str] = None
    last_maintenance: Optional[date] = None

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    asset_tag: Optional[str] = None
    asset_type: Optional[AssetType] = None
    description: Optional[str] = None
    location: Optional[str] = None
    status: Optional[AssetStatus] = None
    assigned_to: Optional[str] = None
    last_maintenance: Optional[date] = None

class Asset(AssetBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Asset Request schemas
class AssetRequestBase(BaseModel):
    asset_id: str
    requested_by: str
    request_type: AssetRequestType
    reason: str
    status: AssetRequestStatus = AssetRequestStatus.pending

class AssetRequestCreate(AssetRequestBase):
    pass

class AssetRequestUpdate(BaseModel):
    status: Optional[AssetRequestStatus] = None

class AssetRequest(AssetRequestBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AssetRequestWithDetails(AssetRequest):
    asset_description: Optional[str] = None
    requester_name: Optional[str] = None

# Notification schemas
class NotificationBase(BaseModel):
    user_id: str
    title: str
    message: str
    read: bool = False

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Admin Notification schemas
class AdminNotificationBase(BaseModel):
    type: NotificationType
    action: str
    technician_name: str
    device_name: Optional[str] = None
    asset_name: Optional[str] = None
    acknowledged: bool = False

class AdminNotificationCreate(AdminNotificationBase):
    pass

class AdminNotification(AdminNotificationBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True
