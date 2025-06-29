
import { Client } from '../types';
import { mockClients } from '../data/mockData';

export class ClientService {
  private static clients: Client[] = [...mockClients];

  static async getAll(): Promise<Client[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.clients];
  }

  static async getById(id: string): Promise<Client | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.clients.find(client => client.id === id) || null;
  }

  static async create(clientData: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      deviceCount: 0,
      activeRequests: 0
    };
    this.clients.push(newClient);
    return newClient;
  }

  static async update(id: string, updates: Partial<Client>): Promise<Client | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.clients.findIndex(client => client.id === id);
    if (index === -1) return null;
    
    this.clients[index] = { ...this.clients[index], ...updates };
    return this.clients[index];
  }

  static async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const index = this.clients.findIndex(client => client.id === id);
    if (index === -1) return false;
    
    this.clients.splice(index, 1);
    return true;
  }
}
