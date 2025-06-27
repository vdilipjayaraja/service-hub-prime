# instruction to config database 

query for psql 

'''
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'technician', 'client')) NOT NULL,
  avatar TEXT,
  password TEXT
);

CREATE TABLE clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  type TEXT CHECK (type IN ('managed_site', 'individual', 'walk_in')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE devices (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  device_code TEXT NOT NULL,
  device_type TEXT CHECK (device_type IN ('PC', 'Server', 'Network', 'CCTV', 'Printer', 'Other')) NOT NULL,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  warranty_expiry DATE NOT NULL,
  status TEXT CHECK (status IN ('active', 'in_repair', 'retired', 'maintenance')) NOT NULL,
  location TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE service_requests (
  id BIGSERIAL PRIMARY KEY,
  ticket_id TEXT UNIQUE NOT NULL,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  device_id BIGINT REFERENCES devices(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved', 'closed')) NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) NOT NULL,
  assigned_to BIGINT REFERENCES users(id),
  submitted_by BIGINT REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_at TIMESTAMP,
  resolution_notes TEXT
);

CREATE TABLE company_assets (
  id BIGSERIAL PRIMARY KEY,
  asset_tag TEXT UNIQUE NOT NULL,
  asset_type TEXT CHECK (asset_type IN ('Laptop', 'Desktop', 'Monitor', 'Network_Equipment', 'Tool', 'Other')) NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT CHECK (status IN ('available', 'assigned_to_tech', 'on_loan_to_client', 'maintenance')) NOT NULL,
  assigned_to BIGINT REFERENCES users(id),
  last_maintenance DATE
);

CREATE TABLE asset_requests (
  id BIGSERIAL PRIMARY KEY,
  asset_id BIGINT REFERENCES company_assets(id),
  requested_by BIGINT REFERENCES users(id),
  request_type TEXT CHECK (request_type IN ('assignment', 'modification', 'maintenance')) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT
  (SELECT COUNT(*) FROM clients) AS total_clients,
  (SELECT COUNT(*) FROM devices WHERE status = 'active') AS active_devices,
  (SELECT COUNT(*) FROM service_requests WHERE status IN ('open', 'assigned', 'in_progress')) AS open_tickets,
  (SELECT COUNT(*) FROM company_assets WHERE status = 'available') AS available_assets,
  (SELECT COUNT(*) FROM asset_requests WHERE status = 'pending') AS pending_requests,
  (SELECT COUNT(*) FROM service_requests WHERE status = 'resolved' AND DATE(updated_at) = CURRENT_DATE) AS resolved_today;

'''

## Psql url for api
postgresql://user:password@localhost:5432/mydatabase
