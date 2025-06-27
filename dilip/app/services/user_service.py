from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models import User
from app.schemas import UserCreate, UserUpdate
from typing import List, Optional
import jwt
from datetime import datetime, timedelta
from app.config import settings

class UserService:
    @staticmethod
    async def get_all(db: Session) -> List[User]:
        return db.query(User).all()
    
    @staticmethod
    async def get_by_id(db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    async def get_by_role(db: Session, role: str) -> List[User]:
        return db.query(User).filter(User.role == role).all()
    
    @staticmethod
    async def get_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    async def create(db: Session, user_data: UserCreate) -> User:
        db_user = User(**user_data.dict())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    async def update(db: Session, user_id: int, user_data: UserUpdate) -> Optional[User]:
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            return None
        
        update_data = user_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    async def delete(db: Session, user_id: int) -> bool:
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            return False
        
        db.delete(db_user)
        db.commit()
        return True

    @staticmethod
    async def get_all_technicians(db: Session) -> List[User]:
        return db.query(User).filter(User.role == 'technician').all()

    @staticmethod
    async def create_technician(db: Session, user_data: UserCreate) -> User:
        user_data.role = 'technician'
        db_user = User(**user_data.dict())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    async def update_technician(db: Session, user_id: int, user_data: UserUpdate) -> Optional[User]:
        db_user = db.query(User).filter(User.id == user_id, User.role == 'technician').first()
        if not db_user:
            return None
        update_data = user_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    @staticmethod
    async def authenticate_user(db: Session, email: str, password: str):
        user = await UserService.get_by_email(db, email)
        if not user or user.password != password:
            return None
        return user 