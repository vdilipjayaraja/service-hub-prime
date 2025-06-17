
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import { ServiceRequest } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useServiceRequests = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: serviceRequests = [], isLoading, error } = useQuery({
    queryKey: ['serviceRequests'],
    queryFn: async () => {
      try {
        const data: any = await apiService.getServiceRequests();
        
        // Filter based on user role (client-side filtering for now)
        let filteredData = data;
        if (user?.role === 'client') {
          filteredData = data.filter((request: any) => request.submitted_by === user.id);
        } else if (user?.role === 'technician') {
          filteredData = data.filter((request: any) => 
            request.assigned_to === user.id || request.assigned_to === null
          );
        }

        return filteredData.map((request: any) => ({
          id: request.id,
          ticketId: request.ticket_id,
          clientId: request.client_id,
          deviceId: request.device_id,
          title: request.title,
          description: request.description,
          status: request.status,
          priority: request.priority,
          assignedTo: request.assigned_to,
          submittedBy: request.submitted_by,
          createdAt: request.created_at,
          updatedAt: request.updated_at,
          assignedAt: request.assigned_at,
          resolutionNotes: request.resolution_notes,
          clientName: request.client_name,
          technicianName: request.technician_name
        })) as ServiceRequest[];
      } catch (error) {
        console.error('Error fetching service requests:', error);
        return [];
      }
    },
    enabled: !!user
  });

  const updateServiceRequestMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ServiceRequest> }) => {
      const dbUpdates: any = {};
      
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
      if (updates.resolutionNotes !== undefined) dbUpdates.resolution_notes = updates.resolutionNotes;
      if (updates.assignedAt) dbUpdates.assigned_at = updates.assignedAt;
      
      return await apiService.updateServiceRequest(id, dbUpdates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    }
  });

  const createServiceRequestMutation = useMutation({
    mutationFn: async (newRequest: Omit<ServiceRequest, 'id' | 'ticketId' | 'createdAt' | 'updatedAt'>) => {
      const requestData = {
        client_id: newRequest.clientId,
        device_id: newRequest.deviceId,
        title: newRequest.title,
        description: newRequest.description,
        status: newRequest.status,
        priority: newRequest.priority,
        assigned_to: newRequest.assignedTo,
        submitted_by: newRequest.submittedBy
      };
      
      return await apiService.createServiceRequest(requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    }
  });

  return {
    serviceRequests,
    isLoading,
    error,
    updateServiceRequest: updateServiceRequestMutation.mutate,
    createServiceRequest: createServiceRequestMutation.mutate,
    isUpdating: updateServiceRequestMutation.isPending,
    isCreating: createServiceRequestMutation.isPending
  };
};
