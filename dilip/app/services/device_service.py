from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models import Device
from app.schemas import DeviceCreate, DeviceUpdate
from typing import List, Optional

class DeviceService:
    @staticmethod
    async def get_all(db: Session) -> List[Device]:
        return db.query(Device).all()
    
    @staticmethod
    async def get_by_id(db: Session, device_id: int) -> Optional[Device]:
        return db.query(Device).filter(Device.id == device_id).first()
    
    @staticmethod
    async def get_by_client_id(db: Session, client_id: int) -> List[Device]:
        return db.query(Device).filter(Device.client_id == client_id).all()
    
    @staticmethod
    async def get_by_status(db: Session, status: str) -> List[Device]:
        return db.query(Device).filter(Device.status == status).all()
    
    @staticmethod
    async def get_by_device_type(db: Session, device_type: str) -> List[Device]:
        return db.query(Device).filter(Device.device_type == device_type).all()
    
    @staticmethod
    async def create(db: Session, device_data: DeviceCreate) -> Device:
        db_device = Device(**device_data.dict())
        db.add(db_device)
        db.commit()
        db.refresh(db_device)
        return db_device
    
    @staticmethod
    async def update(db: Session, device_id: int, device_data: DeviceUpdate) -> Optional[Device]:
        db_device = db.query(Device).filter(Device.id == device_id).first()
        if not db_device:
            return None
        
        update_data = device_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_device, field, value)
        
        db.commit()
        db.refresh(db_device)
        return db_device
    
    @staticmethod
    async def delete(db: Session, device_id: int) -> bool:
        db_device = db.query(Device).filter(Device.id == device_id).first()
        if not db_device:
            return False
        
        db.delete(db_device)
        db.commit()
        return True 