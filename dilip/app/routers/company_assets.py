from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.asset_service import AssetService
from app.schemas import CompanyAsset, CompanyAssetCreate, CompanyAssetUpdate, CompanyAssetList

router = APIRouter(prefix="/company-assets", tags=["company-assets"])

@router.get("/status/{status}", response_model=List[CompanyAsset])
async def get_assets_by_status(status: str, db: Session = Depends(get_db)):
    """Get company assets by status"""
    assets = await AssetService.get_assets_by_status(db, status)
    return assets

@router.get("/type/{asset_type}", response_model=List[CompanyAsset])
async def get_assets_by_type(asset_type: str, db: Session = Depends(get_db)):
    """Get company assets by type"""
    assets = await AssetService.get_assets_by_type(db, asset_type)
    return assets

@router.get("/assigned/{user_id}", response_model=List[CompanyAsset])
async def get_assets_by_assigned_user(user_id: int, db: Session = Depends(get_db)):
    """Get company assets assigned to a user"""
    assets = await AssetService.get_assets_by_assigned_user(db, user_id)
    return assets

@router.get("/available", response_model=List[CompanyAsset])
async def get_available_assets(db: Session = Depends(get_db)):
    """Get all available company assets"""
    assets = await AssetService.get_available_assets(db)
    return assets

@router.get("/", response_model=List[CompanyAsset])
async def get_all_assets(db: Session = Depends(get_db)):
    """Get all company assets"""
    assets = await AssetService.get_all_assets(db)
    return assets

@router.get("/{asset_id}", response_model=CompanyAsset)
async def get_asset(asset_id: int, db: Session = Depends(get_db)):
    """Get a specific company asset by ID"""
    asset = await AssetService.get_asset_by_id(db, asset_id)
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company asset not found"
        )
    return asset

@router.post("/", response_model=CompanyAsset, status_code=status.HTTP_201_CREATED)
async def create_asset(asset_data: CompanyAssetCreate, db: Session = Depends(get_db)):
    """Create a new company asset"""
    asset = await AssetService.create_asset(db, asset_data)
    return asset

@router.put("/{asset_id}", response_model=CompanyAsset)
async def update_asset(asset_id: int, asset_data: CompanyAssetUpdate, db: Session = Depends(get_db)):
    """Update a company asset"""
    asset = await AssetService.update_asset(db, asset_id, asset_data)
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company asset not found"
        )
    return asset

@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_asset(asset_id: int, db: Session = Depends(get_db)):
    """Delete a company asset"""
    success = await AssetService.delete_asset(db, asset_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company asset not found"
        )
    return None
 