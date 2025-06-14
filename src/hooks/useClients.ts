
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Client } from '../types';

export const useClients = () => {
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }

      return data?.map(client => ({
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
      })) as Client[] || [];
    }
  });

  const createClientMutation = useMutation({
    mutationFn: async (newClient: Omit<Client, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: newClient.name,
          contact_person: newClient.contactPerson,
          email: newClient.email,
          phone: newClient.phone,
          address: newClient.address,
          type: newClient.type
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating client:', error);
        throw error;
      }

      return data;
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
