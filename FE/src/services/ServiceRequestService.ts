
import { ServiceRequest } from '../types';
import { mockServiceRequests } from '../data/mockData';

export class ServiceRequestService {
  private static requests: ServiceRequest[] = [...mockServiceRequests];

  static async getAll(): Promise<ServiceRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.requests];
  }

  static async getById(id: string): Promise<ServiceRequest | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.requests.find(request => request.id === id) || null;
  }

  static async getByClientId(clientId: string): Promise<ServiceRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.requests.filter(request => request.clientId === clientId);
  }

  static async getByTechnicianId(technicianId: string): Promise<ServiceRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.requests.filter(request => request.assignedTo === technicianId);
  }

  static async create(requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceRequest> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newRequest: ServiceRequest = {
      ...requestData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.requests.push(newRequest);
    return newRequest;
  }

  static async update(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.requests.findIndex(request => request.id === id);
    if (index === -1) return null;
    
    this.requests[index] = { 
      ...this.requests[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    return this.requests[index];
  }

  static async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const index = this.requests.findIndex(request => request.id === id);
    if (index === -1) return false;
    
    this.requests.splice(index, 1);
    return true;
  }
}
