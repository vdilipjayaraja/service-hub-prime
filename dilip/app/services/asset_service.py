from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.models import CompanyAsset, AssetRequest
from app.schemas import CompanyAssetCreate, CompanyAssetUpdate, AssetRequestCreate, AssetRequestUpdate
from typing import List, Optional
from datetime import date

class AssetService:
    # Company Assets methods
    @staticmethod
    async def get_all_assets(db: Session) -> List[CompanyAsset]:
        return db.query(CompanyAsset).all()
    
    @staticmethod
    async def get_asset_by_id(db: Session, asset_id: int) -> Optional[CompanyAsset]:
        return db.query(CompanyAsset).filter(CompanyAsset.id == asset_id).first()
    
    @staticmethod
    async def get_asset_by_tag(db: Session, asset_tag: str) -> Optional[CompanyAsset]:
        return db.query(CompanyAsset).filter(CompanyAsset.asset_tag == asset_tag).first()
    
    @staticmethod
    async def get_assets_by_status(db: Session, status: str) -> List[CompanyAsset]:
        return db.query(CompanyAsset).filter(CompanyAsset.status == status).all()
    
    @staticmethod
    async def get_assets_by_type(db: Session, asset_type: str) -> List[CompanyAsset]:
        return db.query(CompanyAsset).filter(CompanyAsset.asset_type == asset_type).all()
    
    @staticmethod
    async def get_assets_by_assigned_user(db: Session, user_id: int) -> List[CompanyAsset]:
        return db.query(CompanyAsset).filter(CompanyAsset.assigned_to == user_id).all()
    
    @staticmethod
    async def get_available_assets(db: Session) -> List[CompanyAsset]:
        return db.query(CompanyAsset).filter(CompanyAsset.status == 'available').all()
    
    @staticmethod
    async def create_asset(db: Session, asset_data: CompanyAssetCreate) -> CompanyAsset:
        db_asset = CompanyAsset(**asset_data.dict())
        db.add(db_asset)
        db.commit()
        db.refresh(db_asset)
        return db_asset
    
    @staticmethod
    async def update_asset(db: Session, asset_id: int, asset_data: CompanyAssetUpdate) -> Optional[CompanyAsset]:
        db_asset = db.query(CompanyAsset).filter(CompanyAsset.id == asset_id).first()
        if not db_asset:
            return None
        
        update_data = asset_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_asset, field, value)
        
        db.commit()
        db.refresh(db_asset)
        return db_asset
    
    @staticmethod
    async def delete_asset(db: Session, asset_id: int) -> bool:
        db_asset = db.query(CompanyAsset).filter(CompanyAsset.id == asset_id).first()
        if not db_asset:
            return False
        
        db.delete(db_asset)
        db.commit()
        return True
    
    # Asset Requests methods
    @staticmethod
    async def get_all_requests(db: Session) -> List[AssetRequest]:
        return db.query(AssetRequest).all()
    
    @staticmethod
    async def get_request_by_id(db: Session, request_id: int) -> Optional[AssetRequest]:
        return db.query(AssetRequest).filter(AssetRequest.id == request_id).first()
    
    @staticmethod
    async def get_requests_by_status(db: Session, status: str) -> List[AssetRequest]:
        return db.query(AssetRequest).filter(AssetRequest.status == status).all()
    
    @staticmethod
    async def get_requests_by_user(db: Session, user_id: int) -> List[AssetRequest]:
        return db.query(AssetRequest).filter(AssetRequest.requested_by == user_id).all()
    
    @staticmethod
    async def get_requests_by_asset(db: Session, asset_id: int) -> List[AssetRequest]:
        return db.query(AssetRequest).filter(AssetRequest.asset_id == asset_id).all()
    
    @staticmethod
    async def get_pending_requests(db: Session) -> List[AssetRequest]:
        return db.query(AssetRequest).filter(AssetRequest.status == 'pending').all()
    
    @staticmethod
    async def create_request(db: Session, request_data: AssetRequestCreate) -> AssetRequest:
        db_request = AssetRequest(**request_data.dict())
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        return db_request
    
    @staticmethod
    async def update_request(db: Session, request_id: int, request_data: AssetRequestUpdate) -> Optional[AssetRequest]:
        db_request = db.query(AssetRequest).filter(AssetRequest.id == request_id).first()
        if not db_request:
            return None
        
        update_data = request_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_request, field, value)
        
        db.commit()
        db.refresh(db_request)
        return db_request
    
    @staticmethod
    async def delete_request(db: Session, request_id: int) -> bool:
        db_request = db.query(AssetRequest).filter(AssetRequest.id == request_id).first()
        if not db_request:
            return False
        
        db.delete(db_request)
        db.commit()
        return True 