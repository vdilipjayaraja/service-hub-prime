
import { User } from '../types';
import { mockUsers } from '../data/mockData';

export class UserService {
  private static users: User[] = [...mockUsers];

  static async getAll(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.users];
  }

  static async getById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.users.find(user => user.id === id) || null;
  }

  static async getByRole(role: 'admin' | 'technician' | 'client'): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.users.filter(user => user.role === role);
  }

  static async create(userData: Omit<User, 'id'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    this.users.push(newUser);
    return newUser;
  }

  static async update(id: string, updates: Partial<User>): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  static async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;
    
    this.users.splice(index, 1);
    return true;
  }
}
