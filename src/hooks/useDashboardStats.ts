
import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../services/DashboardService';
import { DashboardStats } from '../models/DashboardStats';

export const useDashboardStats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: DashboardService.getDashboardStats
  });

  return {
    stats: stats || {
      totalClients: 0,
      activeDevices: 0,
      openTickets: 0,
      availableAssets: 0,
      pendingRequests: 0,
      resolvedToday: 0
    } as DashboardStats,
    isLoading,
    error
  };
};
