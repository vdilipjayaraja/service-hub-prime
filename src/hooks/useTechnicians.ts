
import { useState } from 'react';

export interface Technician {
  id: string;
  name: string;
  email: string;
  status: 'available' | 'busy' | 'offline';
  specialization: string[];
  activeRequests: number;
  avatar?: string;
}

// Mock technician data
const mockTechnicians: Technician[] = [
  {
    id: '1',
    name: 'John Technician',
    email: 'john@company.com',
    status: 'available',
    specialization: ['Hardware', 'Network'],
    activeRequests: 2,
    avatar: undefined
  },
  {
    id: '2',
    name: 'Sarah Tech',
    email: 'sarah@company.com',
    status: 'busy',
    specialization: ['Software', 'Security'],
    activeRequests: 5,
    avatar: undefined
  },
  {
    id: '3',
    name: 'Mike Support',
    email: 'mike@company.com',
    status: 'available',
    specialization: ['Hardware', 'CCTV'],
    activeRequests: 1,
    avatar: undefined
  }
];

export const useTechnicians = () => {
  const [technicians] = useState<Technician[]>(mockTechnicians);

  const getAvailableTechnicians = () => {
    return technicians.filter(tech => tech.status === 'available');
  };

  const getTechnicianById = (id: string) => {
    return technicians.find(tech => tech.id === id);
  };

  return {
    technicians,
    getAvailableTechnicians,
    getTechnicianById
  };
};
