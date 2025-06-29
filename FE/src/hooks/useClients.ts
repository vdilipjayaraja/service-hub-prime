
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import { Client } from '../types';

export const useClients = () => {
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        const data: any = await apiService.getClients();
        return data.map((client: any) => ({
          id: client.id,
          name: client.name,
          contactPerson: client.contact_person,
          email: client.email,
          phone: client.phone,
          address: client.address,
          type: client.type,
          createdAt: client.created_at,
          deviceCount: client.device_count || 0,
          activeRequests: client.active_requests || 0
        })) as Client[];
      } catch (error) {
        console.error('Error fetching clients:', error);
        return [];
      }
    }
  });

  const createClientMutation = useMutation({
    mutationFn: async (newClient: Omit<Client, 'id' | 'createdAt'>) => {
      const clientData = {
        name: newClient.name,
        contact_person: newClient.contactPerson,
        email: newClient.email,
        phone: newClient.phone,
        address: newClient.address,
        type: newClient.type
      };
      
      return await apiService.createClient(clientData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  return {
    clients,
    isLoading,
    error,
    createClient: createClientMutation.mutate,
    isCreating: createClientMutation.isPending
  };
};
