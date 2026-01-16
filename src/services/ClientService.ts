
import { User } from '../types';
import { mockUsers } from '../data/mockData';

export class ClientService {
  private static clients: User[] = mockUsers.filter(user => user.role === 'client');

  static async getAll(): Promise<User[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.clients];
  }

  static async getById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.clients.find(client => client.id === id) || null;
  }

  static async create(clientData: Omit<User, 'id'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newClient: User = {
      ...clientData,
      id: Date.now().toString(),
      role: 'client'
    };
    this.clients.push(newClient);
    return newClient;
  }

  static async update(id: string, updates: Partial<User>): Promise<User | null> {
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
