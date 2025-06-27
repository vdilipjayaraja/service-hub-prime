from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.device_service import DeviceService
from app.schemas import Device, DeviceCreate, DeviceUpdate, DeviceList

router = APIRouter(prefix="/devices", tags=["devices"])

@router.get("/status/{status}", response_model=List[Device])
async def get_devices_by_status(status: str, db: Session = Depends(get_db)):
    """Get devices by status"""
    devices = await DeviceService.get_by_status(db, status)
    return devices

@router.get("/type/{device_type}", response_model=List[Device])
async def get_devices_by_type(device_type: str, db: Session = Depends(get_db)):
    """Get devices by type"""
    devices = await DeviceService.get_by_device_type(db, device_type)
    return devices

@router.get("/client/{client_id}", response_model=List[Device])
async def get_devices_by_client(client_id: int, db: Session = Depends(get_db)):
    """Get devices by client ID"""
    devices = await DeviceService.get_by_client_id(db, client_id)
    return devices

@router.get("/", response_model=List[Device])
async def get_devices(db: Session = Depends(get_db)):
    """Get all devices"""
    devices = await DeviceService.get_all(db)
    return devices

@router.get("/{device_id}", response_model=Device)
async def get_device(device_id: int, db: Session = Depends(get_db)):
    """Get a specific device by ID"""
    device = await DeviceService.get_by_id(db, device_id)
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    return device

@router.post("/", response_model=Device, status_code=status.HTTP_201_CREATED)
async def create_device(device_data: DeviceCreate, db: Session = Depends(get_db)):
    """Create a new device"""
    device = await DeviceService.create(db, device_data)
    return device

@router.put("/{device_id}", response_model=Device)
async def update_device(device_id: int, device_data: DeviceUpdate, db: Session = Depends(get_db)):
    """Update a device"""
    device = await DeviceService.update(db, device_id, device_data)
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    return device

@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_device(device_id: int, db: Session = Depends(get_db)):
    """Delete a device"""
    success = await DeviceService.delete(db, device_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    return None 