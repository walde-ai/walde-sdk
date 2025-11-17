import { BackendClient } from '@/sdk/domain/ports/backend/backend-client';
import { BaseHttpClient } from '@/sdk/infra/adapters/base-http-client';

export class WaldeClient extends BaseHttpClient implements BackendClient {
  constructor(
    baseUrl: string,
    private getAuthToken: () => Promise<string>
  ) {
    super(baseUrl);
  }

  protected getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    return this.makeAuthenticatedRequest('GET', endpoint, undefined, { ...authHeaders, ...headers });
  }

  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    return this.makeAuthenticatedRequest('POST', endpoint, data, { ...authHeaders, ...headers });
  }

  async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    return this.makeAuthenticatedRequest('PUT', endpoint, data, { ...authHeaders, ...headers });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    return this.makeAuthenticatedRequest('DELETE', endpoint, undefined, { ...authHeaders, ...headers });
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getAuthToken();
    return { Authorization: `Bearer ${token}` };
  }

  private async makeAuthenticatedRequest<T>(method: string, endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: { ...this.getHeaders(), ...headers },
      body: data && (method === 'POST' || method === 'PUT') ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      return text ? JSON.parse(text) : (null as T);
    } else {
      return (await response.text()) as T;
    }
  }
}
