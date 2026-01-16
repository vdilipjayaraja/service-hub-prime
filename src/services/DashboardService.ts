
import { DashboardStats } from '../types';
import { mockDashboardStats } from '../data/mockData';

export class DashboardService {
  static async getStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { ...mockDashboardStats };
  }
}
