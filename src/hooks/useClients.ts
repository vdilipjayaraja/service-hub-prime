
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import { User } from '../types';

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
          email: client.email,
          role: client.role,
          avatar: client.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name}`
        })) as User[];
      } catch (error) {
        console.error('Error fetching clients:', error);
        return [];
      }
    }
  });

  const createClientMutation = useMutation({
    mutationFn: async (newClient: Omit<User, 'id'>) => {
      const clientData = {
        name: newClient.name,
        email: newClient.email,
        role: 'client',
        avatar: newClient.avatar
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
