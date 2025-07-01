
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models import User
from app.schemas import UserCreate, UserUpdate
from typing import List, Optional

class ClientService:
    @staticmethod
    async def get_all(db: Session) -> List[User]:
        return db.query(User).filter(User.role == 'client').all()
    
    @staticmethod
    async def get_by_id(db: Session, client_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == client_id, User.role == 'client').first()
    
    @staticmethod
    async def get_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email, User.role == 'client').first()
    
    @staticmethod
    async def create(db: Session, client_data: UserCreate) -> User:
        # Ensure role is set to client
        client_data.role = 'client'
        db_client = User(**client_data.dict())
        db.add(db_client)
        db.commit()
        db.refresh(db_client)
        return db_client
    
    @staticmethod
    async def update(db: Session, client_id: int, client_data: UserUpdate) -> Optional[User]:
        db_client = db.query(User).filter(User.id == client_id, User.role == 'client').first()
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
        db_client = db.query(User).filter(User.id == client_id, User.role == 'client').first()
        if not db_client:
            return False
        
        db.delete(db_client)
        db.commit()
        return True
