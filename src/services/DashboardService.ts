
import { DashboardStats } from '../models/DashboardStats';
import { mockDashboardStats } from '../data/mockData';

export class DashboardService {
  static async getDashboardStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { ...mockDashboardStats };
  }

  static async getRecentActivity(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [
      { id: 1, action: 'New service request', client: 'TechCorp Solutions', time: '2 minutes ago', status: 'open' },
      { id: 2, action: 'Device maintenance completed', client: 'Digital Dynamics', time: '15 minutes ago', status: 'resolved' },
      { id: 3, action: 'Asset assigned to technician', client: 'Internal', time: '1 hour ago', status: 'assigned' },
      { id: 4, action: 'Client profile updated', client: 'Future Systems Inc', time: '2 hours ago', status: 'updated' },
    ];
  }
}
