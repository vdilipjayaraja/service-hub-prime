-- Mercury IT Service Management Database Schema
-- PostgreSQL Database Setup for Local Development

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS asset_requests CASCADE;
DROP TABLE IF EXISTS company_assets CASCADE;
DROP TABLE IF EXISTS service_requests CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'technician', 'client')),
    avatar TEXT,
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- CLIENTS TABLE
-- ============================================
CREATE TABLE clients (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('managed_site', 'individual', 'walk_in')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_type ON clients(type);

-- ============================================
-- DEVICES TABLE
-- ============================================
CREATE TABLE devices (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    device_code TEXT NOT NULL,
    device_type TEXT NOT NULL CHECK (device_type IN ('PC', 'Server', 'Network', 'CCTV', 'Printer', 'Other')),
    manufacturer TEXT NOT NULL,
    model TEXT NOT NULL,
    serial_number TEXT NOT NULL,
    purchase_date DATE NOT NULL,
    warranty_expiry DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'in_repair', 'retired', 'maintenance')),
    location TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_devices_client_id ON devices(client_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_device_type ON devices(device_type);

-- ============================================
-- SERVICE REQUESTS TABLE
-- ============================================
CREATE TABLE service_requests (
    id BIGSERIAL PRIMARY KEY,
    ticket_id TEXT UNIQUE NOT NULL,
    client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    device_id BIGINT REFERENCES devices(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved', 'closed')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
    submitted_by BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT
);

CREATE INDEX idx_service_requests_ticket_id ON service_requests(ticket_id);
CREATE INDEX idx_service_requests_client_id ON service_requests(client_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_priority ON service_requests(priority);
CREATE INDEX idx_service_requests_assigned_to ON service_requests(assigned_to);

-- ============================================
-- COMPANY ASSETS TABLE
-- ============================================
CREATE TABLE company_assets (
    id BIGSERIAL PRIMARY KEY,
    asset_tag TEXT UNIQUE NOT NULL,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('Laptop', 'Desktop', 'Monitor', 'Network_Equipment', 'Tool', 'Other')),
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available', 'assigned_to_tech', 'on_loan_to_client', 'maintenance')),
    assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
    last_maintenance DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_company_assets_asset_tag ON company_assets(asset_tag);
CREATE INDEX idx_company_assets_status ON company_assets(status);
CREATE INDEX idx_company_assets_asset_type ON company_assets(asset_type);

-- ============================================
-- ASSET REQUESTS TABLE
-- ============================================
CREATE TABLE asset_requests (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT REFERENCES company_assets(id) ON DELETE SET NULL,
    requested_by BIGINT NOT NULL REFERENCES users(id),
    request_type TEXT NOT NULL CHECK (request_type IN ('assignment', 'modification', 'maintenance')),
    reason TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_asset_requests_asset_id ON asset_requests(asset_id);
CREATE INDEX idx_asset_requests_requested_by ON asset_requests(requested_by);
CREATE INDEX idx_asset_requests_status ON asset_requests(status);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0 CHECK (is_read IN (0, 1)),
    type TEXT NOT NULL CHECK (type IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================================
-- SAMPLE DATA INSERTION
-- ============================================

-- Insert sample users
INSERT INTO users (name, email, role, password) VALUES
('Admin User', 'admin@mercury.com', 'admin', 'password'),
('John Technician', 'john@mercury.com', 'technician', 'password'),
('Mike Technician', 'mike@mercury.com', 'technician', 'password'),
('Client User', 'client@example.com', 'client', 'password');

-- Insert sample clients
INSERT INTO clients (name, contact_person, email, phone, address, type) VALUES
('ABC Corporation', 'John Smith', 'john@abccorp.com', '+1-555-0101', '123 Business Ave, City', 'managed_site'),
('XYZ Industries', 'Jane Doe', 'jane@xyzind.com', '+1-555-0102', '456 Industrial Blvd, Town', 'managed_site'),
('Individual Client', 'Bob Wilson', 'bob@email.com', '+1-555-0103', '789 Home Street, Village', 'individual');

-- Insert sample devices
INSERT INTO devices (client_id, device_code, device_type, manufacturer, model, serial_number, purchase_date, warranty_expiry, status, location, notes) VALUES
(1, 'PC-001', 'PC', 'Dell', 'OptiPlex 7090', 'SN123456789', '2023-01-15', '2026-01-15', 'active', 'Office A', 'Primary workstation'),
(1, 'SRV-001', 'Server', 'HP', 'ProLiant DL380', 'SN987654321', '2022-06-01', '2025-06-01', 'active', 'Server Room', 'Main file server'),
(2, 'NET-001', 'Network', 'Cisco', 'Catalyst 2960', 'SN456789123', '2023-03-20', '2026-03-20', 'active', 'Network Closet', 'Core switch');

-- Insert sample service requests
INSERT INTO service_requests (ticket_id, client_id, device_id, title, description, status, priority, submitted_by) VALUES
('TKT-001', 1, 1, 'Computer running slow', 'The main workstation is experiencing performance issues', 'open', 'medium', 1),
('TKT-002', 2, 3, 'Network connectivity issues', 'Intermittent network drops in the office', 'assigned', 'high', 1);

-- Insert sample company assets
INSERT INTO company_assets (asset_tag, asset_type, description, location, status) VALUES
('ASSET-001', 'Laptop', 'Dell Latitude 5520 - Field Laptop', 'IT Storage', 'available'),
('ASSET-002', 'Tool', 'Network Cable Tester', 'IT Storage', 'available'),
('ASSET-003', 'Monitor', '27" Dell UltraSharp Monitor', 'IT Storage', 'available');

-- ============================================
-- DATABASE CONNECTION INFO
-- ============================================
-- Connection String: postgresql://postgres:admin@localhost:5432/mercury
-- 
-- To create the database, run:
-- CREATE DATABASE mercury;
-- 
-- Then connect to mercury and run this schema file:
-- \c mercury
-- \i schema.sql
