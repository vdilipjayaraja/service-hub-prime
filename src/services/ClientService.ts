
import { Client, ClientCreate } from '../models/Client';
import { mockClients } from '../data/mockData';

export class ClientService {
  private static clients: Client[] = [...mockClients];

  static async getAllClients(): Promise<Client[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.clients];
  }

  static async getClientById(id: string): Promise<Client | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.clients.find(client => client.id === id) || null;
  }

  static async createClient(clientData: ClientCreate): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newClient: Client = {
      id: `client-${Date.now()}`,
      ...clientData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.clients.push(newClient);
    return newClient;
  }

  static async updateClient(id: string, updates: Partial<ClientCreate>): Promise<Client | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const clientIndex = this.clients.findIndex(client => client.id === id);
    if (clientIndex === -1) return null;

    this.clients[clientIndex] = {
      ...this.clients[clientIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    return this.clients[clientIndex];
  }

  static async deleteClient(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const clientIndex = this.clients.findIndex(client => client.id === id);
    if (clientIndex === -1) return false;

    this.clients.splice(clientIndex, 1);
    return true;
  }
}
