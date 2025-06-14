
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface Technician {
  id: string;
  name: string;
  email: string;
  status: 'available' | 'busy' | 'offline';
  specialization: string[];
  activeRequests: number;
  avatar?: string;
}

export const useTechnicians = () => {
  const { data: technicians = [], isLoading, error } = useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching technicians:', error);
        throw error;
      }

      return data?.map(tech => ({
        id: tech.id,
        name: tech.name,
        email: tech.email,
        status: tech.status,
        specialization: tech.specialization || [],
        activeRequests: tech.active_requests || 0,
        avatar: tech.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.name}`
      })) as Technician[] || [];
    }
  });

  const getAvailableTechnicians = () => {
    return technicians.filter(tech => tech.status === 'available');
  };

  const getTechnicianById = (id: string) => {
    return technicians.find(tech => tech.id === id);
  };

  return {
    technicians,
    isLoading,
    error,
    getAvailableTechnicians,
    getTechnicianById
  };
};
