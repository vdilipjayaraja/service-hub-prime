
-- PostgreSQL Schema for IT Management System
-- Drop tables if they exist (in reverse order due to foreign keys)
DROP TABLE IF EXISTS admin_notifications CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS asset_requests CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS service_requests CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS technicians CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'technician', 'client');
CREATE TYPE client_type AS ENUM ('managed_site', 'individual', 'walk_in');
CREATE TYPE device_type AS ENUM ('PC', 'Server', 'Network', 'CCTV', 'Printer', 'Other');
CREATE TYPE device_status AS ENUM ('active', 'in_repair', 'retired', 'maintenance');
CREATE TYPE request_status AS ENUM ('open', 'assigned', 'in_progress', 'resolved', 'closed');
CREATE TYPE request_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE technician_status AS ENUM ('available', 'busy', 'offline');
CREATE TYPE asset_type AS ENUM ('Laptop', 'Desktop', 'Monitor', 'Network_Equipment', 'Tool', 'Other');
CREATE TYPE asset_status AS ENUM ('available', 'assigned_to_tech', 'on_loan_to_client', 'maintenance');
CREATE TYPE asset_request_type AS ENUM ('assignment', 'modification', 'maintenance');
CREATE TYPE asset_request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE notification_type AS ENUM ('device_action', 'asset_action');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    type client_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Technicians table
CREATE TABLE technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status technician_status DEFAULT 'available',
    specialization TEXT[],
    active_requests INTEGER DEFAULT 0,
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Devices table
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    device_code VARCHAR(100) UNIQUE NOT NULL,
    device_type device_type NOT NULL,
    manufacturer VARCHAR(255),
    model VARCHAR(255),
    serial_number VARCHAR(255),
    purchase_date DATE,
    warranty_expiry DATE,
    status device_status DEFAULT 'active',
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Requests table
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id VARCHAR(50) UNIQUE NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status request_status DEFAULT 'open',
    priority request_priority DEFAULT 'medium',
    assigned_to UUID REFERENCES technicians(id) ON DELETE SET NULL,
    submitted_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_at TIMESTAMP,
    resolution_notes TEXT
);

-- Assets table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_tag VARCHAR(100) UNIQUE NOT NULL,
    asset_type asset_type NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    status asset_status DEFAULT 'available',
    assigned_to UUID REFERENCES technicians(id) ON DELETE SET NULL,
    last_maintenance DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Requests table
CREATE TABLE asset_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    requested_by UUID REFERENCES technicians(id) ON DELETE CASCADE,
    request_type asset_request_type NOT NULL,
    reason TEXT NOT NULL,
    status asset_request_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Notifications table
CREATE TABLE admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type notification_type NOT NULL,
    action VARCHAR(255) NOT NULL,
    technician_name VARCHAR(255) NOT NULL,
    device_name VARCHAR(255),
    asset_name VARCHAR(255),
    acknowledged BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_service_requests_client_id ON service_requests(client_id);
CREATE INDEX idx_service_requests_assigned_to ON service_requests(assigned_to);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_devices_client_id ON devices(client_id);
CREATE INDEX idx_assets_assigned_to ON assets(assigned_to);
CREATE INDEX idx_asset_requests_requested_by ON asset_requests(requested_by);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES 
('System Admin', 'admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewCkSb2.9i3qK8p2', 'admin');

-- Insert sample technician
INSERT INTO users (name, email, password_hash, role) VALUES 
('John Technician', 'tech@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewCkSb2.9i3qK8p2', 'technician');

-- Insert sample client
INSERT INTO users (name, email, password_hash, role) VALUES 
('Client User', 'client@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewCkSb2.9i3qK8p2', 'client');
