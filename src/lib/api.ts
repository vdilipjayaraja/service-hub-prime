
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

  // Device endpoints
  async getDevices() {
    return this.request('/devices');
  }

  // Asset endpoints
  async getAssets() {
    return this.request('/assets');
  }

  // Notification endpoints
  async getNotifications() {
    return this.request('/notifications');
  }
}

export const apiService = new ApiService();
