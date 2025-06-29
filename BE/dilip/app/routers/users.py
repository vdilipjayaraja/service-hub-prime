from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.user_service import UserService
from app.schemas import User, UserCreate, UserUpdate, UserList

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[User])
async def get_users(db: Session = Depends(get_db)):
    """Get all users"""
    users = await UserService.get_all(db)
    return users

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get a specific user by ID"""
    user = await UserService.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.get("/role/{role}", response_model=List[User])
async def get_users_by_role(role: str, db: Session = Depends(get_db)):
    """Get users by role"""
    users = await UserService.get_by_role(db, role)
    return users

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    # Check if email already exists
    existing_user = await UserService.get_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = await UserService.create(db, user_data)
    return user

@router.put("/{user_id}", response_model=User)
async def update_user(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    """Update a user"""
    user = await UserService.update(db, user_id, user_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a user"""
    success = await UserService.delete(db, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return None

@router.get("/technicians", response_model=List[User])
async def get_technicians(db: Session = Depends(get_db)):
    """Get all technicians"""
    return await UserService.get_all_technicians(db)

@router.post("/technicians", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_technician(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create a new technician"""
    return await UserService.create_technician(db, user_data)

@router.put("/technicians/{user_id}", response_model=User)
async def update_technician(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    """Update a technician"""
    return await UserService.update_technician(db, user_id, user_data) 