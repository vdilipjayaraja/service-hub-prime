
import { CompanyAsset, AssetRequest } from '../types';
import { mockCompanyAssets, mockAssetRequests } from '../data/mockData';

export class AssetService {
  private static assets: CompanyAsset[] = [...mockCompanyAssets];
  private static requests: AssetRequest[] = [...mockAssetRequests];

  // Company Assets methods
  static async getAllAssets(): Promise<CompanyAsset[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.assets];
  }

  static async getAssetById(id: string): Promise<CompanyAsset | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.assets.find(asset => asset.id === id) || null;
  }

  static async createAsset(assetData: Omit<CompanyAsset, 'id'>): Promise<CompanyAsset> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newAsset: CompanyAsset = {
      ...assetData,
      id: Date.now().toString()
    };
    this.assets.push(newAsset);
    return newAsset;
  }

  static async updateAsset(id: string, updates: Partial<CompanyAsset>): Promise<CompanyAsset | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.assets.findIndex(asset => asset.id === id);
    if (index === -1) return null;
    
    this.assets[index] = { ...this.assets[index], ...updates };
    return this.assets[index];
  }

  static async deleteAsset(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const index = this.assets.findIndex(asset => asset.id === id);
    if (index === -1) return false;
    
    this.assets.splice(index, 1);
    return true;
  }

  // Asset Requests methods
  static async getAllRequests(): Promise<AssetRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.requests];
  }

  static async getRequestById(id: string): Promise<AssetRequest | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.requests.find(request => request.id === id) || null;
  }

  static async createRequest(requestData: Omit<AssetRequest, 'id' | 'createdAt'>): Promise<AssetRequest> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newRequest: AssetRequest = {
      ...requestData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.requests.push(newRequest);
    return newRequest;
  }

  static async updateRequest(id: string, updates: Partial<AssetRequest>): Promise<AssetRequest | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.requests.findIndex(request => request.id === id);
    if (index === -1) return null;
    
    this.requests[index] = { ...this.requests[index], ...updates };
    return this.requests[index];
  }

  static async deleteRequest(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const index = this.requests.findIndex(request => request.id === id);
    if (index === -1) return false;
    
    this.requests.splice(index, 1);
    return true;
  }
}
