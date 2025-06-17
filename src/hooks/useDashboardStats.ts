
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import { DashboardStats } from '../types';

export const useDashboardStats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        const data: any = await apiService.getDashboardStats();
        return {
          totalClients: data.total_clients || 0,
          activeDevices: data.active_devices || 0,
          openTickets: data.open_tickets || 0,
          availableAssets: data.available_assets || 0,
          pendingRequests: data.pending_requests || 0,
          resolvedToday: data.resolved_today || 0
        } as DashboardStats;
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Return default stats if API call fails
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
