import { BackendClient } from '@/sdk/domain/ports/backend/backend-client';
import { DefaultHttpClient } from '@/sdk/infra/adapters/default-http-client';

export class WaldeClient implements BackendClient {
  constructor(
    private httpClient: DefaultHttpClient,
    private getAuthToken: () => Promise<string>
  ) {}

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    return this.httpClient.get(endpoint, { ...authHeaders, ...headers });
  }

  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    return this.httpClient.post(endpoint, data, { ...authHeaders, ...headers });
  }

  async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    return this.httpClient.put(endpoint, data, { ...authHeaders, ...headers });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    return this.httpClient.delete(endpoint, { ...authHeaders, ...headers });
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getAuthToken();
    return { Authorization: `Bearer ${token}` };
  }
}
