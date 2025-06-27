
import { Device } from '../models/Device';
import { Client } from '../models/Client';
import { User } from '../models/User';
import { ServiceRequest } from '../models/ServiceRequest';
import { Asset } from '../models/Asset';
import { Technician } from '../models/Technician';
import { Notification } from '../models/Notification';
import { DashboardStats } from '../models/DashboardStats';

// Centralized mock data store
export const mockDevices: Device[] = [
  {
    id: 'dev-001',
    client_id: 'client-001',
    device_code: 'KH01DES',
    device_type: 'PC',
    manufacturer: 'Dell',
    model: 'OptiPlex 7090',
    serial_number: 'SN123456789',
    purchase_date: '2023-01-15',
    warranty_expiry: '2026-01-15',
    status: 'active',
    location: 'Office A-101',
    notes: 'Main workstation for accounting department',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'dev-002',
    client_id: 'client-001',
    device_code: 'SR01SRV',
    device_type: 'Server',
    manufacturer: 'HP',
    model: 'ProLiant DL380',
    serial_number: 'SN987654321',
    purchase_date: '2022-08-20',
    warranty_expiry: '2025-08-20',
    status: 'active',
    location: 'Server Room',
    notes: 'Primary database server',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'dev-003',
    client_id: 'client-002',
    device_code: 'KB01PRT',
    device_type: 'Printer',
    manufacturer: 'Canon',
    model: 'ImageRunner C3226',
    serial_number: 'SN456789123',
    purchase_date: '2023-06-10',
    warranty_expiry: '2025-06-10',
    status: 'maintenance',
    location: 'Office B-201',
    notes: 'Scheduled maintenance this week',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockClients: Client[] = [
  {
    id: 'client-001',
    name: 'TechCorp Solutions',
    contact_person: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1-555-0123',
    address: '123 Business Ave, Suite 100, New York, NY 10001',
    type: 'managed_site',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'client-002',
    name: 'Digital Dynamics',
    contact_person: 'Sarah Johnson',
    email: 'sarah@digitaldynamics.com',
    phone: '+1-555-0456',
    address: '456 Innovation Dr, San Francisco, CA 94102',
    type: 'walk_in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'client-003',
    name: 'Future Systems Inc',
    contact_person: 'Mike Davis',
    email: 'mike@futuresystems.com',
    phone: '+1-555-0789',
    address: '789 Tech Park Blvd, Austin, TX 78701',
    type: 'managed_site',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Admin User',
    email: 'admin@techsolutions.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'user-002',
    name: 'John Smith',
    email: 'john@techsolutions.com',
    role: 'technician',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John Smith',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'user-003',
    name: 'Client User',
    email: 'client@example.com',
    role: 'client',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Client User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockServiceRequests: ServiceRequest[] = [
  {
    id: 'sr-001',
    ticket_id: 'SR000001',
    client_id: 'client-001',
    title: 'Computer won\'t start',
    description: 'PC in accounting department won\'t boot up',
    priority: 'high',
    status: 'open',
    category: 'hardware',
    assigned_to: null,
    created_by: 'user-003',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'sr-002',
    ticket_id: 'SR000002',
    client_id: 'client-002',
    title: 'Email setup required',
    description: 'New employee needs email configuration',
    priority: 'medium',
    status: 'assigned',
    category: 'software',
    assigned_to: 'user-002',
    created_by: 'user-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockAssets: Asset[] = [
  {
    id: 'asset-001',
    name: 'Laptop - Dell Latitude 5520',
    category: 'laptop',
    serial_number: 'LT123456',
    status: 'available',
    location: 'IT Storage',
    assigned_to: null,
    purchase_date: '2023-03-15',
    warranty_expiry: '2026-03-15',
    notes: 'Brand new laptop for field technicians',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'asset-002',
    name: 'Monitor - LG 27" 4K',
    category: 'monitor',
    serial_number: 'MN789012',
    status: 'assigned',
    location: 'Office A-101',
    assigned_to: 'user-002',
    purchase_date: '2023-05-20',
    warranty_expiry: '2026-05-20',
    notes: 'Assigned to John Smith for CAD work',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockTechnicians: Technician[] = [
  {
    id: 'tech-001',
    name: 'John Smith',
    email: 'john@techsolutions.com',
    phone: '+1-555-1234',
    specialization: 'Hardware',
    status: 'active',
    hire_date: '2022-01-15',
    certifications: ['CompTIA A+', 'Network+'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tech-002',
    name: 'Emily Rodriguez',
    email: 'emily@techsolutions.com',
    phone: '+1-555-5678',
    specialization: 'Software',
    status: 'active',
    hire_date: '2022-06-10',
    certifications: ['Microsoft Certified Professional', 'AWS Solutions Architect'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'New Service Request',
    message: 'A new service request has been submitted by TechCorp Solutions',
    type: 'info',
    read: false,
    created_at: new Date().toISOString(),
    user_id: 'user-001'
  },
  {
    id: 'notif-002',
    title: 'Device Maintenance Due',
    message: 'Printer in Office B-201 is due for maintenance',
    type: 'warning',
    read: false,
    created_at: new Date().toISOString(),
    user_id: 'user-002'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalClients: mockClients.length,
  activeDevices: mockDevices.filter(d => d.status === 'active').length,
  openTickets: mockServiceRequests.filter(sr => ['open', 'assigned', 'in_progress'].includes(sr.status)).length,
  availableAssets: mockAssets.filter(a => a.status === 'available').length,
  pendingRequests: mockServiceRequests.filter(sr => sr.status === 'open').length,
  resolvedToday: mockServiceRequests.filter(sr => sr.status === 'resolved').length
};
