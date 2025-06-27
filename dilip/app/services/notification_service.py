from sqlalchemy.orm import Session
from app.models import Notification
from app.schemas import NotificationCreate, NotificationUpdate
from typing import List, Optional

class NotificationService:
    @staticmethod
    async def get_all(db: Session, user_id: int = None, type: str = None) -> List[Notification]:
        query = db.query(Notification)
        if user_id is not None:
            query = query.filter(Notification.user_id == user_id)
        if type is not None:
            query = query.filter(Notification.type == type)
        return query.all()

    @staticmethod
    async def get_by_id(db: Session, notification_id: int) -> Optional[Notification]:
        return db.query(Notification).filter(Notification.id == notification_id).first()

    @staticmethod
    async def create(db: Session, notification_data: NotificationCreate) -> Notification:
        db_notification = Notification(**notification_data.dict())
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        return db_notification

    @staticmethod
    async def update(db: Session, notification_id: int, notification_data: NotificationUpdate) -> Optional[Notification]:
        db_notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if not db_notification:
            return None
        update_data = notification_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_notification, field, value)
        db.commit()
        db.refresh(db_notification)
        return db_notification

    @staticmethod
    async def delete(db: Session, notification_id: int) -> bool:
        db_notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if not db_notification:
            return False
        db.delete(db_notification)
        db.commit()
        return True 