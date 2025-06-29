from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.models import ServiceRequest
from app.schemas import ServiceRequestCreate, ServiceRequestUpdate
from typing import List, Optional
from datetime import datetime, date

class ServiceRequestService:
    @staticmethod
    async def get_all(db: Session) -> List[ServiceRequest]:
        return db.query(ServiceRequest).all()
    
    @staticmethod
    async def get_by_id(db: Session, request_id: int) -> Optional[ServiceRequest]:
        return db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    
    @staticmethod
    async def get_by_ticket_id(db: Session, ticket_id: str) -> Optional[ServiceRequest]:
        return db.query(ServiceRequest).filter(ServiceRequest.ticket_id == ticket_id).first()
    
    @staticmethod
    async def get_by_client_id(db: Session, client_id: int) -> List[ServiceRequest]:
        return db.query(ServiceRequest).filter(ServiceRequest.client_id == client_id).all()
    
    @staticmethod
    async def get_by_technician_id(db: Session, technician_id: int) -> List[ServiceRequest]:
        return db.query(ServiceRequest).filter(ServiceRequest.assigned_to == technician_id).all()
    
    @staticmethod
    async def get_by_status(db: Session, status: str) -> List[ServiceRequest]:
        return db.query(ServiceRequest).filter(ServiceRequest.status == status).all()
    
    @staticmethod
    async def get_by_priority(db: Session, priority: str) -> List[ServiceRequest]:
        return db.query(ServiceRequest).filter(ServiceRequest.priority == priority).all()
    
    @staticmethod
    async def get_open_tickets(db: Session) -> List[ServiceRequest]:
        return db.query(ServiceRequest).filter(
            ServiceRequest.status.in_(['open', 'assigned', 'in_progress'])
        ).all()
    
    @staticmethod
    async def get_resolved_today(db: Session) -> List[ServiceRequest]:
        today = date.today()
        return db.query(ServiceRequest).filter(
            and_(
                ServiceRequest.status == 'resolved',
                func.date(ServiceRequest.updated_at) == today
            )
        ).all()
    
    @staticmethod
    async def create(db: Session, request_data: ServiceRequestCreate) -> ServiceRequest:
        db_request = ServiceRequest(**request_data.dict())
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        return db_request
    
    @staticmethod
    async def update(db: Session, request_id: int, request_data: ServiceRequestUpdate) -> Optional[ServiceRequest]:
        db_request = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
        if not db_request:
            return None
        
        update_data = request_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_request, field, value)
        
        # Update the updated_at timestamp
        db_request.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(db_request)
        return db_request
    
    @staticmethod
    async def delete(db: Session, request_id: int) -> bool:
        db_request = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
        if not db_request:
            return False
        
        db.delete(db_request)
        db.commit()
        return True 