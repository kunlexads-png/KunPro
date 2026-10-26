import {
  OverviewMetrics,
  Dataset,
  AnomalyItem,
  RecommendationItem,
  ReportItem,
  ChatMessage,
  NotificationItem,
  AuditLogItem,
  User,
  Organization,
} from '../types';

const BASE_URL = '/api';

class ApiService {
  private token: string | null = localStorage.getItem('cerebro_token') || 'demo_token';

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('cerebro_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('cerebro_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      return await res.json();
    } catch (err: any) {
      console.warn(`API call failed for ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth
  async login(email: string, password?: string): Promise<{ token: string; user: User; organization: Organization }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(): Promise<{ user: User; organization: Organization }> {
    return this.request('/auth/me');
  }

  // Dashboard Overview
  async getOverviewMetrics(params?: { period?: string; businessUnit?: string; region?: string }): Promise<OverviewMetrics> {
    const query = new URLSearchParams();
    if (params?.period) query.set('period', params.period);
    if (params?.businessUnit) query.set('businessUnit', params.businessUnit);
    if (params?.region) query.set('region', params.region);
    return this.request(`/dashboard/overview?${query.toString()}`);
  }

  // Trends
  async getTrends(period: string = '30d'): Promise<any> {
    return this.request(`/dashboard/trends?period=${period}`);
  }

  // Datasets
  async getDatasets(): Promise<Dataset[]> {
    return this.request('/datasets');
  }

  async uploadDataset(data: { name: string; type: string; rawContent: string }): Promise<Dataset> {
    return this.request('/datasets/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async previewDataset(id: string): Promise<{ dataset: Dataset; previewRows: any[] }> {
    return this.request(`/datasets/${id}/preview`);
  }

  async importDataset(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/datasets/${id}/import`, { method: 'POST' });
  }

  // Analytics
  async getSalesAnalytics(): Promise<any> {
    return this.request('/analytics/sales');
  }

  async getFinancialAnalytics(): Promise<any> {
    return this.request('/analytics/financial');
  }

  async getCustomerAnalytics(): Promise<any> {
    return this.request('/analytics/customers');
  }

  // Anomalies & Recommendations
  async getAnomalies(): Promise<AnomalyItem[]> {
    return this.request('/anomalies');
  }

  async getRecommendations(): Promise<RecommendationItem[]> {
    return this.request('/recommendations');
  }

  async updateRecommendation(id: string, payload: { status?: string; userNotes?: string }): Promise<RecommendationItem> {
    return this.request(`/recommendations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  // AI Chat & Reports
  async askAiAnalyst(message: string, period?: string): Promise<ChatMessage> {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, period }),
    });
  }

  async generateReport(type: string, period: string): Promise<ReportItem> {
    return this.request('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ type, period }),
    });
  }

  async getReports(): Promise<ReportItem[]> {
    return this.request('/reports');
  }

  async getReport(id: string): Promise<ReportItem> {
    return this.request(`/reports/${id}`);
  }

  // Notifications & Audit
  async getNotifications(): Promise<NotificationItem[]> {
    return this.request('/notifications');
  }

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return this.request(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  async getAuditLogs(): Promise<AuditLogItem[]> {
    return this.request('/audit-logs');
  }

  // Organizations & Settings
  async getOrganization(): Promise<{ organization: Organization; members: User[] }> {
    return this.request('/organizations');
  }

  async updateOrgSettings(settings: Partial<Organization>): Promise<Organization> {
    return this.request('/organizations/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  }
}

export const api = new ApiService();
