from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models import Client
from app.schemas import ClientCreate, ClientUpdate
from typing import List, Optional

class ClientService:
    @staticmethod
    async def get_all(db: Session) -> List[Client]:
        return db.query(Client).all()
    
    @staticmethod
    async def get_by_id(db: Session, client_id: int) -> Optional[Client]:
        return db.query(Client).filter(Client.id == client_id).first()
    
    @staticmethod
    async def get_by_email(db: Session, email: str) -> Optional[Client]:
        return db.query(Client).filter(Client.email == email).first()
    
    @staticmethod
    async def get_by_type(db: Session, client_type: str) -> List[Client]:
        return db.query(Client).filter(Client.type == client_type).all()
    
    @staticmethod
    async def create(db: Session, client_data: ClientCreate) -> Client:
        db_client = Client(**client_data.dict())
        db.add(db_client)
        db.commit()
        db.refresh(db_client)
        return db_client
    
    @staticmethod
    async def update(db: Session, client_id: int, client_data: ClientUpdate) -> Optional[Client]:
        db_client = db.query(Client).filter(Client.id == client_id).first()
        if not db_client:
            return None
        
        update_data = client_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_client, field, value)
        
        db.commit()
        db.refresh(db_client)
        return db_client
    
    @staticmethod
    async def delete(db: Session, client_id: int) -> bool:
        db_client = db.query(Client).filter(Client.id == client_id).first()
        if not db_client:
            return False
        
        db.delete(db_client)
        db.commit()
        return True 