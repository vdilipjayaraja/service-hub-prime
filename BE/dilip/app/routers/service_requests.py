from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.service_request_service import ServiceRequestService
from app.schemas import ServiceRequest, ServiceRequestCreate, ServiceRequestUpdate, ServiceRequestList

router = APIRouter(prefix="/service-requests", tags=["service-requests"])

@router.get("/", response_model=List[ServiceRequest])
async def get_service_requests(db: Session = Depends(get_db)):
    """Get all service requests"""
    requests = await ServiceRequestService.get_all(db)
    return requests

@router.get("/{request_id}", response_model=ServiceRequest)
async def get_service_request(request_id: int, db: Session = Depends(get_db)):
    """Get a specific service request by ID"""
    request = await ServiceRequestService.get_by_id(db, request_id)
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service request not found"
        )
    return request

@router.get("/ticket/{ticket_id}", response_model=ServiceRequest)
async def get_service_request_by_ticket(ticket_id: str, db: Session = Depends(get_db)):
    """Get a service request by ticket ID"""
    request = await ServiceRequestService.get_by_ticket_id(db, ticket_id)
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service request not found"
        )
    return request

@router.get("/client/{client_id}", response_model=List[ServiceRequest])
async def get_service_requests_by_client(client_id: int, db: Session = Depends(get_db)):
    """Get service requests by client ID"""
    requests = await ServiceRequestService.get_by_client_id(db, client_id)
    return requests

@router.get("/technician/{technician_id}", response_model=List[ServiceRequest])
async def get_service_requests_by_technician(technician_id: int, db: Session = Depends(get_db)):
    """Get service requests by technician ID"""
    requests = await ServiceRequestService.get_by_technician_id(db, technician_id)
    return requests

@router.get("/status/{status}", response_model=List[ServiceRequest])
async def get_service_requests_by_status(status: str, db: Session = Depends(get_db)):
    """Get service requests by status"""
    requests = await ServiceRequestService.get_by_status(db, status)
    return requests

@router.get("/priority/{priority}", response_model=List[ServiceRequest])
async def get_service_requests_by_priority(priority: str, db: Session = Depends(get_db)):
    """Get service requests by priority"""
    requests = await ServiceRequestService.get_by_priority(db, priority)
    return requests

@router.get("/open/tickets", response_model=List[ServiceRequest])
async def get_open_tickets(db: Session = Depends(get_db)):
    """Get all open tickets (open, assigned, in_progress)"""
    requests = await ServiceRequestService.get_open_tickets(db)
    return requests

@router.get("/resolved/today", response_model=List[ServiceRequest])
async def get_resolved_today(db: Session = Depends(get_db)):
    """Get tickets resolved today"""
    requests = await ServiceRequestService.get_resolved_today(db)
    return requests

@router.post("/", response_model=ServiceRequest, status_code=status.HTTP_201_CREATED)
async def create_service_request(request_data: ServiceRequestCreate, db: Session = Depends(get_db)):
    """Create a new service request"""
    # Check if ticket_id already exists
    existing_request = await ServiceRequestService.get_by_ticket_id(db, request_data.ticket_id)
    if existing_request:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ticket ID already exists"
        )
    
    request = await ServiceRequestService.create(db, request_data)
    return request

@router.put("/{request_id}", response_model=ServiceRequest)
async def update_service_request(request_id: int, request_data: ServiceRequestUpdate, db: Session = Depends(get_db)):
    """Update a service request"""
    request = await ServiceRequestService.update(db, request_id, request_data)
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service request not found"
        )
    return request

@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a service request"""
    success = await ServiceRequestService.delete(db, request_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service request not found"
        )
    return None 