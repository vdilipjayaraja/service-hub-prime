
# IT Management System - FastAPI Backend

A FastAPI backend for the IT Management System with PostgreSQL database.

## Features

- JWT-based authentication
- Role-based access control (Admin, Technician, Client)
- CRUD operations for all entities
- PostgreSQL database with SQLAlchemy ORM
- Async database operations
- CORS support for frontend integration

## Setup

### Prerequisites

- Python 3.8+
- PostgreSQL database
- pip or conda

### Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Set up PostgreSQL database:
```bash
# Create database
createdb it_management

# Run schema
psql -d it_management -f schema.sql
```

5. Run the application:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Default Users

The schema includes default users for testing:
- Admin: `admin@example.com` / `admin123`
- Technician: `tech@example.com` / `admin123`
- Client: `client@example.com` / `admin123`

## Database Schema

The system includes the following main entities:
- Users (Authentication)
- Clients (Customer management)
- Technicians (Staff management)
- Devices (Equipment tracking)
- Service Requests (Ticket system)
- Assets (Company equipment)
- Asset Requests (Asset management)
- Notifications (User notifications)
- Admin Notifications (System notifications)

## Development

To run in development mode with auto-reload:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time (default: 30)
