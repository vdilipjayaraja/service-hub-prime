
import { Device } from '../types';
import { mockDevices } from '../data/mockData';

export class DeviceService {
  private static devices: Device[] = [...mockDevices];

  static async getAll(): Promise<Device[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.devices];
  }

  static async getById(id: string): Promise<Device | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.devices.find(device => device.id === id) || null;
  }

  static async getByClientId(clientId: string): Promise<Device[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.devices.filter(device => device.clientId === clientId);
  }

  static async create(deviceData: Omit<Device, 'id'>): Promise<Device> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newDevice: Device = {
      ...deviceData,
      id: Date.now().toString()
    };
    this.devices.push(newDevice);
    return newDevice;
  }

  static async update(id: string, updates: Partial<Device>): Promise<Device | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.devices.findIndex(device => device.id === id);
    if (index === -1) return null;
    
    this.devices[index] = { ...this.devices[index], ...updates };
    return this.devices[index];
  }

  static async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const index = this.devices.findIndex(device => device.id === id);
    if (index === -1) return false;
    
    this.devices.splice(index, 1);
    return true;
  }
}
