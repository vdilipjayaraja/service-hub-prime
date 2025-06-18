
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';

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
      try {
        const data: any = await apiService.getAdminNotifications();
        return data?.map((notification: any) => ({
          id: notification.id,
          type: notification.type,
          action: notification.action,
          technicianName: notification.technician_name,
          deviceName: notification.device_name,
          assetName: notification.asset_name,
          timestamp: notification.timestamp,
          acknowledged: notification.acknowledged
        })) as AdminNotification[] || [];
      } catch (error) {
        console.error('Error fetching admin notifications:', error);
        return [];
      }
    }
  });

  const addNotificationMutation = useMutation({
    mutationFn: async (notification: Omit<AdminNotification, 'id' | 'timestamp' | 'acknowledged'>) => {
      const notificationData = {
        type: notification.type,
        action: notification.action,
        technician_name: notification.technicianName,
        device_name: notification.deviceName,
        asset_name: notification.assetName
      };
      return await apiService.createAdminNotification(notificationData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
    }
  });

  const acknowledgeNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await apiService.acknowledgeAdminNotification(notificationId);
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
