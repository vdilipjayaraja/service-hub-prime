# Local PostgreSQL Database Setup

## Prerequisites
- PostgreSQL 12+ installed locally
- psql command-line tool

## Setup Steps

### 1. Create the Database
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create the mercury database
CREATE DATABASE mercury;

# Exit psql
\q
```

### 2. Run the Schema
```bash
# Option 1: Using psql
psql -U postgres -d mercury -f schema.sql

# Option 2: From within psql
\c mercury
\i schema.sql
```

### 3. Configure Environment
Edit the `.env` file in the `dilip/` directory:
```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/mercury
```

Update the credentials as needed:
- `postgres` - PostgreSQL username
- `admin` - PostgreSQL password
- `localhost` - Database host
- `5432` - PostgreSQL port
- `mercury` - Database name

### 4. Start the Backend
```bash
cd dilip
pip install -r requirements.txt
python run.py
```

## Connection String Format
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

## Sample Accounts
| Role       | Email                 | Password |
|------------|-----------------------|----------|
| Admin      | admin@mercury.com     | password |
| Technician | john@mercury.com      | password |
| Technician | mike@mercury.com      | password |
| Client     | client@example.com    | password |

## Useful psql Commands
```bash
# List all tables
\dt

# Describe a table
\d users

# View table data
SELECT * FROM users;

# Check connection
\conninfo
```
