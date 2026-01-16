
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeviceService } from '../services/DeviceService';
import { Device } from '../types';

export const useDevices = () => {
  const queryClient = useQueryClient();

  const { data: devices = [], isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: () => DeviceService.getAll()
  });

  const createMutation = useMutation({
    mutationFn: (deviceData: Omit<Device, 'id'>) => DeviceService.create(deviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Device> }) => 
      DeviceService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => DeviceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    }
  });

  return {
    devices,
    isLoading,
    error,
    createDevice: createMutation.mutateAsync,
    updateDevice: updateMutation.mutateAsync,
    deleteDevice: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
