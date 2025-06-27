from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, clients, devices, service_requests, asset_requests, company_assets, dashboard, notifications, auth
from app.config import settings

app = FastAPI(title="IT Management System API")
app = FastAPI(debug=True)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(users.router)
app.include_router(clients.router)
app.include_router(devices.router)
app.include_router(service_requests.router)
app.include_router(asset_requests.router)
app.include_router(company_assets.router)
app.include_router(dashboard.router)
app.include_router(notifications.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "IT Management System API is running"} 