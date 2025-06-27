
import { Device, DeviceCreate, DeviceUpdate } from '../models/Device';
import { mockDevices } from '../data/mockData';

export class DeviceService {
  private static devices: Device[] = [...mockDevices];

  static async getAllDevices(): Promise<Device[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.devices];
  }

  static async getDeviceById(id: string): Promise<Device | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.devices.find(device => device.id === id) || null;
  }

  static async createDevice(deviceData: DeviceCreate & { device_code: string; status: Device['status'] }): Promise<Device> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newDevice: Device = {
      id: `dev-${Date.now()}`,
      ...deviceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.devices.push(newDevice);
    return newDevice;
  }

  static async updateDevice(id: string, updates: DeviceUpdate): Promise<Device | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const deviceIndex = this.devices.findIndex(device => device.id === id);
    if (deviceIndex === -1) return null;

    this.devices[deviceIndex] = {
      ...this.devices[deviceIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    return this.devices[deviceIndex];
  }

  static async deleteDevice(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const deviceIndex = this.devices.findIndex(device => device.id === id);
    if (deviceIndex === -1) return false;

    this.devices.splice(deviceIndex, 1);
    return true;
  }

  static async getDevicesByClient(clientId: string): Promise<Device[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.devices.filter(device => device.client_id === clientId);
  }

  static async getDevicesByLocation(location: string): Promise<Device[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.devices.filter(device => device.location === location);
  }
}
