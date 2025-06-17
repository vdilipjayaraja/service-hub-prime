
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface AdminNotification {
  id: string;
  type: 'device_action' | 'asset_action';
  action: string;
  technicianName: string;
  deviceName?: string;
  assetName?: string;
  timestamp: string;
  acknowledged: boolean;
}

export const useAdminNotifications = () => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: async () => {
      // Mock data for demonstration
      return [
        {
          id: '1',
          type: 'device_action' as const,
          action: 'edited device details',
          technicianName: 'John Smith',
          deviceName: 'KH03LAP',
          timestamp: new Date().toISOString(),
          acknowledged: false
        },
        {
          id: '2',
          type: 'asset_action' as const,
          action: 'deployed asset',
          technicianName: 'Jane Doe',
          assetName: 'Conference Room Projector',
          timestamp: new Date().toISOString(),
          acknowledged: false
        }
      ] as AdminNotification[];
    }
  });

  const addNotificationMutation = useMutation({
    mutationFn: async (notification: Omit<AdminNotification, 'id' | 'timestamp' | 'acknowledged'>) => {
      // In a real app, this would make an API call
      const newNotification: AdminNotification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        acknowledged: false
      };
      return newNotification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
    }
  });

  const acknowledgeNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // In a real app, this would make an API call
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
    }
  });

  return {
    notifications,
    isLoading,
    addNotification: addNotificationMutation.mutate,
    acknowledgeNotification: acknowledgeNotificationMutation.mutate
  };
};
