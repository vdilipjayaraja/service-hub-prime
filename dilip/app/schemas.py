from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date

# Base schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    avatar: Optional[str] = None

class ClientBase(BaseModel):
    name: str
    contact_person: str
    email: EmailStr
    phone: str
    address: str
    type: str

class DeviceBase(BaseModel):
    client_id: int
    device_code: str
    device_type: str
    manufacturer: str
    model: str
    serial_number: str
    purchase_date: date
    warranty_expiry: date
    status: str
    location: str
    notes: Optional[str] = None

class ServiceRequestBase(BaseModel):
    ticket_id: str
    client_id: int
    device_id: Optional[int] = None
    title: str
    description: str
    status: str
    priority: str
    assigned_to: Optional[int] = None
    submitted_by: int
    assigned_at: Optional[datetime] = None
    resolution_notes: Optional[str] = None

class CompanyAssetBase(BaseModel):
    asset_tag: str
    asset_type: str
    description: str
    location: str
    status: str
    assigned_to: Optional[int] = None
    last_maintenance: Optional[date] = None

class AssetRequestBase(BaseModel):
    asset_id: Optional[int] = None
    requested_by: int
    request_type: str
    reason: str
    status: str

class NotificationBase(BaseModel):
    user_id: int
    title: str
    message: str
    type: str  # 'user' or 'admin'

# Create schemas
class UserCreate(UserBase):
    password: str

class ClientCreate(ClientBase):
    pass

class DeviceCreate(DeviceBase):
    pass

class ServiceRequestCreate(ServiceRequestBase):
    pass

class CompanyAssetCreate(CompanyAssetBase):
    pass

class AssetRequestCreate(AssetRequestBase):
    pass

class NotificationCreate(NotificationBase):
    pass

# Update schemas
class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    avatar: Optional[str] = None
    password: Optional[str] = None

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    type: Optional[str] = None

class DeviceUpdate(BaseModel):
    client_id: Optional[int] = None
    device_code: Optional[str] = None
    device_type: Optional[str] = None
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_expiry: Optional[date] = None
    status: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None

class ServiceRequestUpdate(BaseModel):
    ticket_id: Optional[str] = None
    client_id: Optional[int] = None
    device_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[int] = None
    submitted_by: Optional[int] = None
    assigned_at: Optional[datetime] = None
    resolution_notes: Optional[str] = None

class CompanyAssetUpdate(BaseModel):
    asset_tag: Optional[str] = None
    asset_type: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[int] = None
    last_maintenance: Optional[date] = None

class AssetRequestUpdate(BaseModel):
    asset_id: Optional[int] = None
    requested_by: Optional[int] = None
    request_type: Optional[str] = None
    reason: Optional[str] = None
    status: Optional[str] = None

class NotificationUpdate(BaseModel):
    title: str | None = None
    message: str | None = None
    is_read: int | None = None
    type: str | None = None

# Response schemas
class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class Client(ClientBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Device(DeviceBase):
    id: int
    
    class Config:
        from_attributes = True

class ServiceRequest(ServiceRequestBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class CompanyAsset(CompanyAssetBase):
    id: int
    
    class Config:
        from_attributes = True

class AssetRequest(AssetRequestBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Notification(NotificationBase):
    id: int
    is_read: int
    created_at: datetime

    class Config:
        from_attributes = True

# Dashboard Stats schema
class DashboardStats(BaseModel):
    total_clients: int
    active_devices: int
    open_tickets: int
    available_assets: int
    pending_requests: int
    resolved_today: int

# List response schemas
class UserList(BaseModel):
    users: List[User]

class ClientList(BaseModel):
    clients: List[Client]

class DeviceList(BaseModel):
    devices: List[Device]

class ServiceRequestList(BaseModel):
    service_requests: List[ServiceRequest]

class CompanyAssetList(BaseModel):
    company_assets: List[CompanyAsset]

class AssetRequestList(BaseModel):
    asset_requests: List[AssetRequest] 