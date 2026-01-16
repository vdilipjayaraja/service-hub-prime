
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../lib/api';

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
      try {
        const data: any = await apiService.getTechnicians();
        return data?.map((tech: any) => ({
          id: tech.id,
          name: tech.name,
          email: tech.email,
          status: 'available', // Default status since User model doesn't have this
          specialization: [], // Default empty array since User model doesn't have this
          activeRequests: 0, // Default 0 since User model doesn't have this
          avatar: tech.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.name}`
        })) as Technician[] || [];
      } catch (error) {
        console.error('Error fetching technicians:', error);
        return [];
      }
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
