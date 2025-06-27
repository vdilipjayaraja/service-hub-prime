from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.notification_service import NotificationService
from app.schemas import Notification, NotificationCreate, NotificationUpdate

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/", response_model=List[Notification])
async def get_notifications(user_id: int = None, type: str = None, db: Session = Depends(get_db)):
    """Get notifications (optionally filter by user_id and type)"""
    return await NotificationService.get_all(db, user_id=user_id, type=type)

@router.get("/{notification_id}", response_model=Notification)
async def get_notification(notification_id: int, db: Session = Depends(get_db)):
    notification = await NotificationService.get_by_id(db, notification_id)
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return notification

@router.post("/", response_model=Notification, status_code=status.HTTP_201_CREATED)
async def create_notification(notification_data: NotificationCreate, db: Session = Depends(get_db)):
    return await NotificationService.create(db, notification_data)

@router.put("/{notification_id}", response_model=Notification)
async def update_notification(notification_id: int, notification_data: NotificationUpdate, db: Session = Depends(get_db)):
    notification = await NotificationService.update(db, notification_id, notification_data)
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return notification

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    success = await NotificationService.delete(db, notification_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return None 