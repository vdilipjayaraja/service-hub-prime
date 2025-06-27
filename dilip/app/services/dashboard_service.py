from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.models import Client, Device, ServiceRequest, CompanyAsset, AssetRequest
from app.schemas import DashboardStats
from typing import Dict, Any
from datetime import date

class DashboardService:
    @staticmethod
    async def get_stats(db: Session) -> DashboardStats:
        # Get total clients
        total_clients = db.query(func.count(Client.id)).scalar()
        
        # Get active devices
        active_devices = db.query(func.count(Device.id)).filter(Device.status == 'active').scalar()
        
        # Get open tickets (open, assigned, in_progress)
        open_tickets = db.query(func.count(ServiceRequest.id)).filter(
            ServiceRequest.status.in_(['open', 'assigned', 'in_progress'])
        ).scalar()
        
        # Get available assets
        available_assets = db.query(func.count(CompanyAsset.id)).filter(
            CompanyAsset.status == 'available'
        ).scalar()
        
        # Get pending asset requests
        pending_requests = db.query(func.count(AssetRequest.id)).filter(
            AssetRequest.status == 'pending'
        ).scalar()
        
        # Get resolved tickets today
        today = date.today()
        resolved_today = db.query(func.count(ServiceRequest.id)).filter(
            and_(
                ServiceRequest.status == 'resolved',
                func.date(ServiceRequest.updated_at) == today
            )
        ).scalar()
        
        return DashboardStats(
            total_clients=total_clients,
            active_devices=active_devices,
            open_tickets=open_tickets,
            available_assets=available_assets,
            pending_requests=pending_requests,
            resolved_today=resolved_today
        )
    
    @staticmethod
    async def get_detailed_stats(db: Session) -> Dict[str, Any]:
        # Get basic stats
        basic_stats = await DashboardService.get_stats(db)
        
        # Get device status breakdown
        device_status_stats = db.query(
            Device.status,
            func.count(Device.id).label('count')
        ).group_by(Device.status).all()
        
        # Get service request status breakdown
        request_status_stats = db.query(
            ServiceRequest.status,
            func.count(ServiceRequest.id).label('count')
        ).group_by(ServiceRequest.status).all()
        
        # Get service request priority breakdown
        request_priority_stats = db.query(
            ServiceRequest.priority,
            func.count(ServiceRequest.id).label('count')
        ).group_by(ServiceRequest.priority).all()
        
        # Get asset status breakdown
        asset_status_stats = db.query(
            CompanyAsset.status,
            func.count(CompanyAsset.id).label('count')
        ).group_by(CompanyAsset.status).all()
        
        # Get client type breakdown
        client_type_stats = db.query(
            Client.type,
            func.count(Client.id).label('count')
        ).group_by(Client.type).all()
        
        return {
            "basic_stats": basic_stats.dict(),
            "device_status_breakdown": [{"status": stat.status, "count": stat.count} for stat in device_status_stats],
            "request_status_breakdown": [{"status": stat.status, "count": stat.count} for stat in request_status_stats],
            "request_priority_breakdown": [{"priority": stat.priority, "count": stat.count} for stat in request_priority_stats],
            "asset_status_breakdown": [{"status": stat.status, "count": stat.count} for stat in asset_status_stats],
            "client_type_breakdown": [{"type": stat.type, "count": stat.count} for stat in client_type_stats]
        } 