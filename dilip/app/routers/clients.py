from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.client_service import ClientService
from app.schemas import Client, ClientCreate, ClientUpdate, ClientList

router = APIRouter(prefix="/clients", tags=["clients"])

@router.get("/type/{client_type}", response_model=List[Client])
async def get_clients_by_type(client_type: str, db: Session = Depends(get_db)):
    """Get clients by type"""
    clients = await ClientService.get_by_type(db, client_type)
    return clients

@router.get("/", response_model=List[Client])
async def get_clients(db: Session = Depends(get_db)):
    """Get all clients"""
    clients = await ClientService.get_all(db)
    return clients

@router.get("/{client_id}", response_model=Client)
async def get_client(client_id: int, db: Session = Depends(get_db)):
    """Get a specific client by ID"""
    client = await ClientService.get_by_id(db, client_id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    return client

@router.post("/", response_model=Client, status_code=status.HTTP_201_CREATED)
async def create_client(client_data: ClientCreate, db: Session = Depends(get_db)):
    """Create a new client"""
    # Check if email already exists
    existing_client = await ClientService.get_by_email(db, client_data.email)
    if existing_client:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    client = await ClientService.create(db, client_data)
    return client

@router.put("/{client_id}", response_model=Client)
async def update_client(client_id: int, client_data: ClientUpdate, db: Session = Depends(get_db)):
    """Update a client"""
    client = await ClientService.update(db, client_id, client_data)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    return client

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(client_id: int, db: Session = Depends(get_db)):
    """Delete a client"""
    success = await ClientService.delete(db, client_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    return None 