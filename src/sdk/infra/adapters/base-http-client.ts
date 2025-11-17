import { WaldeNetworkError, WaldeUnexpectedError } from '@/sdk/domain/errors';

/**
 * Abstract base HTTP client providing common HTTP functionality.
 * Concrete implementations must provide authentication headers.
 */
export abstract class BaseHttpClient {
  constructor(protected readonly baseUrl: string) {}

  /**
   * Get headers for HTTP requests. Implemented by concrete classes.
   */
  protected abstract getHeaders(): Record<string, string>;

  /**
   * Make HTTP GET request with error handling and response parsing.
   */
  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders();

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new WaldeNetworkError(
          `HTTP ${response.status}: ${response.statusText} for ${url}`,
          new Error(`HTTP ${response.status}`)
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.text();
        return data ? JSON.parse(data) : (null as T);
      } else {
        return (await response.text()) as T;
      }
    } catch (error) {
      if (error instanceof WaldeNetworkError) {
        throw error;
      }
      throw new WaldeUnexpectedError('HTTP request failed', error as Error);
    }
  }

  /**
   * Make HTTP POST request with error handling and response parsing.
   */
  async post<T>(endpoint: string, body?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      ...this.getHeaders(),
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new WaldeNetworkError(
          `HTTP ${response.status}: ${response.statusText} for ${url}`,
          new Error(`HTTP ${response.status}`)
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.text();
        return data ? JSON.parse(data) : (null as T);
      } else {
        return (await response.text()) as T;
      }
    } catch (error) {
      if (error instanceof WaldeNetworkError) {
        throw error;
      }
      throw new WaldeUnexpectedError('HTTP request failed', error as Error);
    }
  }

  /**
   * Make HTTP PUT request with error handling and response parsing.
   */
  async put<T>(endpoint: string, body?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      ...this.getHeaders(),
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new WaldeNetworkError(
          `HTTP ${response.status}: ${response.statusText} for ${url}`,
          new Error(`HTTP ${response.status}`)
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.text();
        return data ? JSON.parse(data) : (null as T);
      } else {
        return (await response.text()) as T;
      }
    } catch (error) {
      if (error instanceof WaldeNetworkError) {
        throw error;
      }
      throw new WaldeUnexpectedError('HTTP request failed', error as Error);
    }
  }

  /**
   * Make HTTP DELETE request with error handling and response parsing.
   */
  async delete<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders();

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new WaldeNetworkError(
          `HTTP ${response.status}: ${response.statusText} for ${url}`,
          new Error(`HTTP ${response.status}`)
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.text();
        return data ? JSON.parse(data) : (null as T);
      } else {
        return (await response.text()) as T;
      }
    } catch (error) {
      if (error instanceof WaldeNetworkError) {
        throw error;
      }
      throw new WaldeUnexpectedError('HTTP request failed', error as Error);
    }
  }
}
