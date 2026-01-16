const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Client endpoints
  async getClients() {
    return this.request('/clients');
  }

  async createClient(client: any) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  }

  // Service Request endpoints
  async getServiceRequests() {
    return this.request('/service-requests');
  }

  async createServiceRequest(request: any) {
    return this.request('/service-requests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateServiceRequest(id: string, updates: any) {
    return this.request(`/service-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Technician endpoints
  async getTechnicians() {
    return this.request('/users/role/technician');
  }

  async createTechnician(technician: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify({ ...technician, role: 'technician' }),
    });
  }

  // Device endpoints
  async getDevices() {
    return this.request('/devices');
  }

  async createDevice(device: any) {
    return this.request('/devices', {
      method: 'POST',
      body: JSON.stringify(device),
    });
  }

  async updateDevice(id: string, updates: any) {
    return this.request(`/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Asset endpoints
  async getAssets() {
    return this.request('/assets');
  }

  async createAsset(asset: any) {
    return this.request('/assets', {
      method: 'POST',
      body: JSON.stringify(asset),
    });
  }

  async updateAsset(id: string, updates: any) {
    return this.request(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Asset Request endpoints
  async getAssetRequests() {
    return this.request('/asset-requests');
  }

  async createAssetRequest(request: any) {
    return this.request('/asset-requests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateAssetRequest(id: string, updates: any) {
    return this.request(`/asset-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Notification endpoints
  async getNotifications() {
    return this.request('/notifications');
  }

  async createNotification(notification: any) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
  }

  // Admin Notification endpoints
  async getAdminNotifications() {
    return this.request('/admin/notifications');
  }

  async createAdminNotification(notification: any) {
    return this.request('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
  }

  async acknowledgeAdminNotification(id: string) {
    return this.request(`/admin/notifications/${id}/acknowledge`, {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
