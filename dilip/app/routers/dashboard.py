from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.dashboard_service import DashboardService
from app.schemas import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    stats = await DashboardService.get_stats(db)
    return stats

@router.get("/detailed-stats")
async def get_detailed_dashboard_stats(db: Session = Depends(get_db)):
    """Get detailed dashboard statistics"""
    stats = await DashboardService.get_detailed_stats(db)
    return stats 