export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'client';
  avatar?: string;
  // This field is NOT used for login. Authentication is done via Supabase Auth.
  password?: string;
}

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  type: 'managed_site' | 'individual' | 'walk_in';
  createdAt: string;
  deviceCount?: number;
  activeRequests?: number;
}

export interface Device {
  id: string;
  clientId: string;
  deviceCode: string;
  deviceType: 'PC' | 'Server' | 'Network' | 'CCTV' | 'Printer' | 'Other';
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  status: 'active' | 'in_repair' | 'retired' | 'maintenance';
  location: string;
  notes: string;
}

export interface ServiceRequest {
  id: string;
  ticketId: string;
  clientId: string;
  deviceId?: string;
  title: string;
  description: string;
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
  assignedAt?: string;
  resolutionNotes?: string;
  clientName?: string;
  technicianName?: string;
}

export interface CompanyAsset {
  id: string;
  assetTag: string;
  assetType: 'Laptop' | 'Desktop' | 'Monitor' | 'Network_Equipment' | 'Tool' | 'Other';
  description: string;
  location: string;
  status: 'available' | 'assigned_to_tech' | 'on_loan_to_client' | 'maintenance';
  assignedTo?: string;
  lastMaintenance?: string;
}

export interface AssetRequest {
  id: string;
  assetId: string;
  requestedBy: string;
  requestType: 'assignment' | 'modification' | 'maintenance';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  assetDescription?: string;
  requesterName?: string;
}

export interface DashboardStats {
  totalClients: number;
  activeDevices: number;
  openTickets: number;
  availableAssets: number;
  pendingRequests: number;
  resolvedToday: number;
}
