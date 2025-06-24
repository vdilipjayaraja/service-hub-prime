
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

from database import get_db, engine, Base
from models import *
from schemas import *
from auth import verify_password, get_password_hash, create_access_token, verify_token

load_dotenv()

app = FastAPI(title="IT Management System API", version="1.0.0")

# CORS configuration
CORS_ORIGINS = ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")
except Exception as e:
    print(f"Error creating tables: {e}")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user

# Auth endpoints
@app.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
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

@app.get("/auth/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "avatar": current_user.avatar
    }

# Dashboard endpoints
@app.get("/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        total_clients = db.query(Client).count()
        active_devices = db.query(Device).filter(Device.status == 'active').count()
        open_tickets = db.query(ServiceRequest).filter(ServiceRequest.status.in_(['open', 'assigned', 'in_progress'])).count()
        available_assets = db.query(Asset).filter(Asset.status == 'available').count()
        pending_requests = db.query(AssetRequest).filter(AssetRequest.status == 'pending').count()
        
        # Get today's resolved tickets
        today = datetime.utcnow().date()
        resolved_today = db.query(ServiceRequest).filter(
            ServiceRequest.status == 'resolved',
            ServiceRequest.updated_at >= today
        ).count()
        
        return {
            "total_clients": total_clients,
            "active_devices": active_devices,
            "open_tickets": open_tickets,
            "available_assets": available_assets,
            "pending_requests": pending_requests,
            "resolved_today": resolved_today
        }
    except Exception as e:
        print(f"Error fetching dashboard stats: {e}")
        return {
            "total_clients": 0,
            "active_devices": 0,
            "open_tickets": 0,
            "available_assets": 0,
            "pending_requests": 0,
            "resolved_today": 0
        }

# Client endpoints
@app.get("/clients", response_model=List[Client])
async def get_clients(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    clients = db.query(Client).all()
    return clients

@app.post("/clients", response_model=Client)
async def create_client(client: ClientCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_client = Client(
        id=uuid.uuid4(),
        **client.dict()
    )
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

# Device endpoints
@app.get("/devices")
async def get_devices(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    devices = db.query(Device).all()
    return [
        {
            "id": str(device.id),
            "client_id": str(device.client_id),
            "device_code": device.device_code,
            "device_type": device.device_type,
            "manufacturer": device.manufacturer,
            "model": device.model,
            "serial_number": device.serial_number,
            "purchase_date": device.purchase_date.isoformat() if device.purchase_date else None,
            "warranty_expiry": device.warranty_expiry.isoformat() if device.warranty_expiry else None,
            "status": device.status,
            "location": device.location,
            "notes": device.notes,
            "created_at": device.created_at.isoformat(),
            "updated_at": device.updated_at.isoformat()
        }
        for device in devices
    ]

@app.post("/devices")
async def create_device(device: DeviceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_device = Device(
        id=uuid.uuid4(),
        **device.dict()
    )
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return {
        "id": str(db_device.id),
        "client_id": str(db_device.client_id),
        "device_code": db_device.device_code,
        "device_type": db_device.device_type,
        "manufacturer": db_device.manufacturer,
        "model": db_device.model,
        "serial_number": db_device.serial_number,
        "purchase_date": db_device.purchase_date.isoformat() if db_device.purchase_date else None,
        "warranty_expiry": db_device.warranty_expiry.isoformat() if db_device.warranty_expiry else None,
        "status": db_device.status,
        "location": db_device.location,
        "notes": db_device.notes,
        "created_at": db_device.created_at.isoformat(),
        "updated_at": db_device.updated_at.isoformat()
    }

@app.put("/devices/{device_id}")
async def update_device(device_id: str, device_update: DeviceUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_device = db.query(Device).filter(Device.id == device_id).first()
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    update_data = device_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_device, field, value)
    
    db_device.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_device)
    
    return {
        "id": str(db_device.id),
        "client_id": str(db_device.client_id),
        "device_code": db_device.device_code,
        "device_type": db_device.device_type,
        "manufacturer": db_device.manufacturer,
        "model": db_device.model,
        "serial_number": db_device.serial_number,
        "purchase_date": db_device.purchase_date.isoformat() if db_device.purchase_date else None,
        "warranty_expiry": db_device.warranty_expiry.isoformat() if db_device.warranty_expiry else None,
        "status": db_device.status,
        "location": db_device.location,
        "notes": db_device.notes,
        "created_at": db_device.created_at.isoformat(),
        "updated_at": db_device.updated_at.isoformat()
    }

# Service Request endpoints
@app.get("/service-requests")
async def get_service_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    requests = db.query(ServiceRequest).all()
    return requests

@app.post("/service-requests")
async def create_service_request(request: ServiceRequestCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Generate ticket ID
    ticket_count = db.query(ServiceRequest).count()
    ticket_id = f"SR{str(ticket_count + 1).zfill(6)}"
    
    db_request = ServiceRequest(
        id=uuid.uuid4(),
        ticket_id=ticket_id,
        **request.dict()
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

# Technician endpoints
@app.get("/technicians")
async def get_technicians(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    technicians = db.query(Technician).all()
    return technicians

# Asset endpoints
@app.get("/assets")
async def get_assets(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    assets = db.query(Asset).all()
    return assets

# Create default admin user if not exists
@app.on_event("startup")
async def create_default_admin():
    try:
        db = next(get_db())
        
        # Check if admin user exists
        admin_user = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin_user:
            # Create default admin user
            admin_user = User(
                id=uuid.uuid4(),
                name="Admin User",
                email="admin@example.com",
                password_hash=get_password_hash("admin123"),
                role="admin"
            )
            db.add(admin_user)
            
            # Create a default client
            default_client = Client(
                id=uuid.uuid4(),
                name="Sample Company",
                contact_person="John Doe",
                email="contact@samplecompany.com",
                phone="+1234567890",
                address="123 Business Street, City, State",
                type="managed_site"
            )
            db.add(default_client)
            
            db.commit()
            print("Default admin user and client created successfully")
            print("Email: admin@example.com")
            print("Password: admin123")
        
        db.close()
    except Exception as e:
        print(f"Error creating default admin: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
