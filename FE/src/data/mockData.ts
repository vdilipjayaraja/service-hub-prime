
import { Client, Device, ServiceRequest, CompanyAsset, AssetRequest, DashboardStats, User } from '../types';

// Users mock data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'John Technician',
    email: 'john@company.com',
    role: 'technician',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Jane Client',
    email: 'jane@client.com',
    role: 'client',
    avatar: '/placeholder.svg'
  }
];

// Clients mock data
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Tech Corp',
    contactPerson: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1-555-0101',
    address: '123 Business Ave, Suite 100',
    type: 'managed_site',
    createdAt: '2024-01-15T10:00:00Z',
    deviceCount: 25,
    activeRequests: 3
  },
  {
    id: '2',
    name: 'ABC Industries',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@abcindustries.com',
    phone: '+1-555-0102',
    address: '456 Industrial Blvd',
    type: 'managed_site',
    createdAt: '2024-01-10T14:30:00Z',
    deviceCount: 45,
    activeRequests: 7
  },
  {
    id: '3',
    name: 'Walk-in Customer',
    contactPerson: 'Mike Wilson',
    email: 'mike@email.com',
    phone: '+1-555-0103',
    address: '789 Main St',
    type: 'walk_in',
    createdAt: '2024-01-20T09:15:00Z',
    deviceCount: 1,
    activeRequests: 1
  }
];

// Devices mock data
export const mockDevices: Device[] = [
  {
    id: '1',
    clientId: '1',
    deviceCode: 'KH01DES',
    deviceType: 'PC',
    manufacturer: 'Dell',
    model: 'OptiPlex 7090',
    serialNumber: 'DT001234',
    purchaseDate: '2023-06-15',
    warrantyExpiry: '2026-06-15',
    status: 'active',
    location: 'Office A-101',
    notes: 'Primary workstation'
  },
  {
    id: '2',
    clientId: '1',
    deviceCode: 'RM01LAP',
    deviceType: 'PC',
    manufacturer: 'HP',
    model: 'EliteBook 850',
    serialNumber: 'LT002345',
    purchaseDate: '2023-08-20',
    warrantyExpiry: '2026-08-20',
    status: 'active',
    location: 'Remote',
    notes: 'Mobile worker laptop'
  },
  {
    id: '3',
    clientId: '2',
    deviceCode: 'SR01SRV',
    deviceType: 'Server',
    manufacturer: 'Dell',
    model: 'PowerEdge R740',
    serialNumber: 'SV001456',
    purchaseDate: '2023-01-10',
    warrantyExpiry: '2028-01-10',
    status: 'maintenance',
    location: 'Server Room',
    notes: 'Scheduled maintenance'
  }
];

// Service Requests mock data
export const mockServiceRequests: ServiceRequest[] = [
  {
    id: '1',
    ticketId: 'REQ-2024-001',
    clientId: '1',
    deviceId: '1',
    title: 'Computer running slowly',
    description: 'The workstation has been running very slowly for the past few days',
    status: 'open',
    priority: 'medium',
    assignedTo: '2',
    submittedBy: '3',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    clientName: 'Tech Corp',
    technicianName: 'John Technician'
  },
  {
    id: '2',
    ticketId: 'REQ-2024-002',
    clientId: '2',
    title: 'Network connectivity issues',
    description: 'Unable to connect to the company network',
    status: 'in_progress',
    priority: 'high',
    assignedTo: '2',
    submittedBy: '3',
    createdAt: '2024-01-14T15:45:00Z',
    updatedAt: '2024-01-15T09:20:00Z',
    assignedAt: '2024-01-14T16:00:00Z',
    clientName: 'ABC Industries',
    technicianName: 'John Technician'
  }
];

// Company Assets mock data
export const mockCompanyAssets: CompanyAsset[] = [
  {
    id: '1',
    assetTag: 'TOOL-001',
    assetType: 'Tool',
    description: 'Network Cable Tester',
    location: 'Tech Room A',
    status: 'available',
    lastMaintenance: '2024-01-01'
  },
  {
    id: '2',
    assetTag: 'LAP-001',
    assetType: 'Laptop',
    description: 'Dell Latitude 5520',
    location: 'Storage',
    status: 'assigned_to_tech',
    assignedTo: '2',
    lastMaintenance: '2023-12-15'
  },
  {
    id: '3',
    assetTag: 'MON-001',
    assetType: 'Monitor',
    description: '24" LED Monitor',
    location: 'Storage',
    status: 'on_loan_to_client',
    assignedTo: '1'
  }
];

// Asset Requests mock data
export const mockAssetRequests: AssetRequest[] = [
  {
    id: '1',
    assetId: '1',
    requestedBy: '2',
    requestType: 'assignment',
    reason: 'Need cable tester for client site visit',
    status: 'pending',
    createdAt: '2024-01-15T11:00:00Z',
    assetDescription: 'Network Cable Tester',
    requesterName: 'John Technician'
  },
  {
    id: '2',
    assetId: '3',
    requestedBy: '2',
    requestType: 'modification',
    reason: 'Client requested monitor upgrade',
    status: 'approved',
    createdAt: '2024-01-14T14:30:00Z',
    assetDescription: '24" LED Monitor',
    requesterName: 'John Technician'
  }
];

// Dashboard Stats mock data
export const mockDashboardStats: DashboardStats = {
  totalClients: 45,
  activeDevices: 128,
  openTickets: 12,
  availableAssets: 23,
  pendingRequests: 5,
  resolvedToday: 8
};
