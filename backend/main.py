from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from backend import auth
from typing import Optional, List
import os
from dotenv import load_dotenv

from backend.database import get_db, engine
from backend import models
from backend import schemas
from backend.auth import verify_password, get_password_hash, create_access_token, verify_token

load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="IT Management System API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Dependency to get current user
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user

# Authentication endpoints
@app.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)))
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=schemas.User)
async def get_current_user_profile(current_user: models.User = Depends(get_current_user)):
    return current_user

# Dashboard endpoints
@app.get("/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    total_clients = db.query(models.Client).count()
    active_devices = db.query(models.Device).filter(models.Device.status == 'active').count()
    open_tickets = db.query(models.ServiceRequest).filter(models.ServiceRequest.status.in_(['open', 'assigned', 'in_progress'])).count()
    available_assets = db.query(models.Asset).filter(models.Asset.status == 'available').count()
    pending_requests = db.query(models.AssetRequest).filter(models.AssetRequest.status == 'pending').count()
    resolved_today = db.query(models.ServiceRequest).filter(
        models.ServiceRequest.status == 'resolved',
        models.ServiceRequest.updated_at >= datetime.now().date()
    ).count()
    
    return {
        "total_clients": total_clients,
        "active_devices": active_devices,
        "open_tickets": open_tickets,
        "available_assets": available_assets,
        "pending_requests": pending_requests,
        "resolved_today": resolved_today
    }

# Client endpoints
@app.get("/clients", response_model=List[schemas.ClientWithStats])
async def get_clients(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    clients = db.query(models.Client).all()
    result = []
    
    for client in clients:
        device_count = db.query(models.Device).filter(models.Device.client_id == client.id).count()
        active_requests = db.query(models.ServiceRequest).filter(
            models.ServiceRequest.client_id == client.id,
            models.ServiceRequest.status.in_(['open', 'assigned', 'in_progress'])
        ).count()
        
        client_data = schemas.ClientWithStats(
            id=str(client.id),
            name=client.name,
            contact_person=client.contact_person,
            email=client.email,
            phone=client.phone,
            address=client.address,
            type=client.type,
            created_at=client.created_at.isoformat(),
            device_count=device_count,
            active_requests=active_requests
        )
        result.append(client_data)
    
    return result

@app.post("/clients", response_model=schemas.Client)
async def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

# Technician endpoints
@app.get("/technicians", response_model=List[schemas.TechnicianWithStats])
async def get_technicians(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    technicians = db.query(models.Technician).all()
    result = []
    
    for tech in technicians:
        active_requests = db.query(models.ServiceRequest).filter(
            models.ServiceRequest.assigned_to == tech.id,
            models.ServiceRequest.status.in_(['assigned', 'in_progress'])
        ).count()
        
        tech_data = schemas.TechnicianWithStats(
            id=str(tech.id),
            name=tech.name,
            email=tech.email,
            status=tech.status,
            specialization=tech.specialization or [],
            active_requests=active_requests,
            avatar=tech.avatar
        )
        result.append(tech_data)
    
    return result

@app.post("/technicians", response_model=schemas.Technician)
async def create_technician(technician: schemas.TechnicianCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_technician = models.Technician(**technician.dict())
    db.add(db_technician)
    db.commit()
    db.refresh(db_technician)
    return db_technician

# Device endpoints
@app.get("/devices", response_model=List[schemas.Device])
async def get_devices(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Device).all()

@app.post("/devices", response_model=schemas.Device)
async def create_device(device: schemas.DeviceCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_device = models.Device(**device.dict())
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

@app.put("/devices/{device_id}", response_model=schemas.Device)
async def update_device(device_id: str, device_update: schemas.DeviceUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    update_data = device_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_device, field, value)
    
    db.commit()
    db.refresh(db_device)
    return db_device

# Service Request endpoints
@app.get("/service-requests", response_model=List[schemas.ServiceRequestWithDetails])
async def get_service_requests(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.ServiceRequest)
    
    # Filter based on user role
    if current_user.role == 'client':
        query = query.filter(models.ServiceRequest.submitted_by == current_user.id)
    elif current_user.role == 'technician':
        query = query.filter(
            (models.ServiceRequest.assigned_to == current_user.id) |
            (models.ServiceRequest.assigned_to.is_(None))
        )
    
    requests = query.all()
    result = []
    
    for request in requests:
        client = db.query(models.Client).filter(models.Client.id == request.client_id).first()
        technician = None
        if request.assigned_to:
            technician = db.query(models.Technician).filter(models.Technician.id == request.assigned_to).first()
        
        request_data = schemas.ServiceRequestWithDetails(
            id=str(request.id),
            ticket_id=request.ticket_id,
            client_id=str(request.client_id),
            device_id=str(request.device_id) if request.device_id else None,
            title=request.title,
            description=request.description,
            status=request.status,
            priority=request.priority,
            assigned_to=str(request.assigned_to) if request.assigned_to else None,
            submitted_by=str(request.submitted_by),
            created_at=request.created_at.isoformat(),
            updated_at=request.updated_at.isoformat(),
            assigned_at=request.assigned_at.isoformat() if request.assigned_at else None,
            resolution_notes=request.resolution_notes,
            client_name=client.name if client else None,
            technician_name=technician.name if technician else None
        )
        result.append(request_data)
    
    return result

@app.post("/service-requests", response_model=schemas.ServiceRequest)
async def create_service_request(request: schemas.ServiceRequestCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Generate ticket ID
    count = db.query(models.ServiceRequest).count()
    ticket_id = f"SR-{count + 1:06d}"
    
    db_request = models.ServiceRequest(
        ticket_id=ticket_id,
        **request.dict()
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@app.put("/service-requests/{request_id}", response_model=schemas.ServiceRequest)
async def update_service_request(request_id: str, request_update: schemas.ServiceRequestUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_request = db.query(models.ServiceRequest).filter(models.ServiceRequest.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Service request not found")
    
    update_data = request_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_request, field, value)
    
    db_request.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_request)
    return db_request

# Asset endpoints
@app.get("/assets", response_model=List[schemas.Asset])
async def get_assets(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Asset).all()

@app.post("/assets", response_model=schemas.Asset)
async def create_asset(asset: schemas.AssetCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_asset = models.Asset(**asset.dict())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

@app.put("/assets/{asset_id}", response_model=schemas.Asset)
async def update_asset(asset_id: str, asset_update: schemas.AssetUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    update_data = asset_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_asset, field, value)
    
    db.commit()
    db.refresh(db_asset)
    return db_asset

# Asset Request endpoints
@app.get("/asset-requests", response_model=List[schemas.AssetRequestWithDetails])
async def get_asset_requests(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    requests = db.query(models.AssetRequest).all()
    result = []
    
    for request in requests:
        asset = db.query(models.Asset).filter(models.Asset.id == request.asset_id).first()
        technician = db.query(models.Technician).filter(models.Technician.id == request.requested_by).first()
        
        request_data = schemas.AssetRequestWithDetails(
            id=str(request.id),
            asset_id=str(request.asset_id),
            requested_by=str(request.requested_by),
            request_type=request.request_type,
            reason=request.reason,
            status=request.status,
            created_at=request.created_at.isoformat(),
            asset_description=asset.description if asset else None,
            requester_name=technician.name if technician else None
        )
        result.append(request_data)
    
    return result

@app.post("/asset-requests", response_model=schemas.AssetRequest)
async def create_asset_request(request: schemas.AssetRequestCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_request = models.AssetRequest(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@app.put("/asset-requests/{request_id}", response_model=schemas.AssetRequest)
async def update_asset_request(request_id: str, request_update: schemas.AssetRequestUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_request = db.query(models.AssetRequest).filter(models.AssetRequest.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Asset request not found")
    
    update_data = request_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_request, field, value)
    
    db.commit()
    db.refresh(db_request)
    return db_request

# Notification endpoints
@app.get("/notifications", response_model=List[schemas.Notification])
async def get_notifications(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Notification).filter(models.Notification.user_id == current_user.id).all()

@app.post("/notifications", response_model=schemas.Notification)
async def create_notification(notification: schemas.NotificationCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_notification = models.Notification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

# Admin Notification endpoints
@app.get("/admin/notifications", response_model=List[schemas.AdminNotification])
async def get_admin_notifications(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Access denied")
    
    return db.query(models.AdminNotification).all()

@app.post("/admin/notifications", response_model=schemas.AdminNotification)
async def create_admin_notification(notification: schemas.AdminNotificationCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_notification = models.AdminNotification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

@app.post("/admin/notifications/{notification_id}/acknowledge")
async def acknowledge_admin_notification(notification_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Access denied")
    
    notification = db.query(models.AdminNotification).filter(models.AdminNotification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.acknowledged = True
    db.commit()
    return {"message": "Notification acknowledged"}

@app.get("/")
def read_root():
    return {"message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
