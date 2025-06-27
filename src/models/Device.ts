
export interface Device {
  id: string;
  client_id: string;
  device_code: string;
  device_type: 'PC' | 'Server' | 'Network' | 'CCTV' | 'Printer' | 'Other';
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  status: 'active' | 'in_repair' | 'retired' | 'maintenance';
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DeviceCreate {
  client_id: string;
  device_type: Device['device_type'];
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  location?: string;
  notes?: string;
}

export interface DeviceUpdate {
  device_code?: string;
  device_type?: Device['device_type'];
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  status?: Device['status'];
  location?: string;
  notes?: string;
}
