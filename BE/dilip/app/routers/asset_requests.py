from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.asset_service import AssetService
from app.schemas import AssetRequest, AssetRequestCreate, AssetRequestUpdate, AssetRequestList

router = APIRouter(prefix="/asset-requests", tags=["asset-requests"])

@router.get("/status/{status}", response_model=List[AssetRequest])
async def get_requests_by_status(status: str, db: Session = Depends(get_db)):
    """Get asset requests by status"""
    requests = await AssetService.get_requests_by_status(db, status)
    return requests

@router.get("/user/{user_id}", response_model=List[AssetRequest])
async def get_requests_by_user(user_id: int, db: Session = Depends(get_db)):
    """Get asset requests by user ID"""
    requests = await AssetService.get_requests_by_user(db, user_id)
    return requests

@router.get("/asset/{asset_id}", response_model=List[AssetRequest])
async def get_requests_by_asset(asset_id: int, db: Session = Depends(get_db)):
    """Get asset requests by asset ID"""
    requests = await AssetService.get_requests_by_asset(db, asset_id)
    return requests

@router.get("/pending", response_model=List[AssetRequest])
async def get_pending_requests(db: Session = Depends(get_db)):
    """Get all pending asset requests"""
    requests = await AssetService.get_pending_requests(db)
    return requests

@router.get("/", response_model=List[AssetRequest])
async def get_all_requests(db: Session = Depends(get_db)):
    """Get all asset requests"""
    requests = await AssetService.get_all_requests(db)
    return requests

@router.get("/{request_id}", response_model=AssetRequest)
async def get_request(request_id: int, db: Session = Depends(get_db)):
    """Get a specific asset request by ID"""
    request = await AssetService.get_request_by_id(db, request_id)
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset request not found"
        )
    return request

@router.post("/", response_model=AssetRequest, status_code=status.HTTP_201_CREATED)
async def create_request(request_data: AssetRequestCreate, db: Session = Depends(get_db)):
    """Create a new asset request"""
    request = await AssetService.create_request(db, request_data)
    return request

@router.put("/{request_id}", response_model=AssetRequest)
async def update_request(request_id: int, request_data: AssetRequestUpdate, db: Session = Depends(get_db)):
    """Update an asset request"""
    request = await AssetService.update_request(db, request_id, request_data)
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset request not found"
        )
    return request

@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_request(request_id: int, db: Session = Depends(get_db)):
    """Delete an asset request"""
    success = await AssetService.delete_request(db, request_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset request not found"
        )
    return None 