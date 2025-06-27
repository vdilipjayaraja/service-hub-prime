
import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../services/DashboardService';
import { DashboardStats } from '../types';

export const useDashboardStats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        return await DashboardService.getStats();
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Return default stats if service call fails
        return {
          totalClients: 0,
          activeDevices: 0,
          openTickets: 0,
          availableAssets: 0,
          pendingRequests: 0,
          resolvedToday: 0
        } as DashboardStats;
      }
    }
  });

  return {
    stats: stats || {
      totalClients: 0,
      activeDevices: 0,
      openTickets: 0,
      availableAssets: 0,
      pendingRequests: 0,
      resolvedToday: 0
    },
    isLoading,
    error
  };
};
