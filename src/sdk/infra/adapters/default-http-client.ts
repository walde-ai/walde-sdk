import { TokenProvider } from '../../domain/ports/in/token-provider';
import { WaldeNetworkError, WaldeSystemError, WaldeAuthenticationError, WaldeValidationError, WaldeUnexpectedError } from '@/sdk/domain/errors';
import { BaseHttpClient } from './base-http-client';

/**
 * HTTP client for making authenticated API requests
 */
export class DefaultHttpClient extends BaseHttpClient {
  constructor(
    baseUrl: string,
    private readonly tokenProvider: TokenProvider
  ) {
    super(baseUrl);
  }

  /**
   * Get headers with Bearer token authentication
   */
  protected getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Make a GET request to the specified path
   */
  public async get(path: string, customHeaders?: Record<string, string>): Promise<any> {
    return this.request('GET', path, undefined, customHeaders);
  }

  /**
   * Make a POST request to the specified path with optional body
   */
  public async post(path: string, body?: any, customHeaders?: Record<string, string>): Promise<any> {
    return this.request('POST', path, body, customHeaders);
  }

  /**
   * Make a PUT request to the specified path with optional body
   */
  public async put(path: string, body?: any, customHeaders?: Record<string, string>): Promise<any> {
    return this.request('PUT', path, body, customHeaders);
  }

  /**
   * Make a DELETE request to the specified path
   */
  public async delete(path: string, customHeaders?: Record<string, string>): Promise<any> {
    return this.request('DELETE', path, undefined, customHeaders);
  }

  /**
   * Handle HTTP error responses with appropriate error types
   */
  private handleHttpError(statusCode: number, statusMessage: string, parsedData: any, url: string): Error {
    const serverMessage = parsedData?.metadata?.error;
    const details = { statusCode, statusMessage, response: parsedData, url };

    if (statusCode === 401) {
      return new WaldeAuthenticationError(
        serverMessage || 'Authentication required. Please login first.',
        details
      );
    }

    if (statusCode === 403) {
      return new WaldeAuthenticationError(
        serverMessage || 'Access denied. You do not have permission to perform this action.',
        details
      );
    }

    if (statusCode >= 500) {
      return new WaldeSystemError(
        serverMessage || `Server error ${statusCode}: ${statusMessage}`,
        undefined,
        details
      );
    }

    if (statusCode >= 400) {
      return new WaldeValidationError(
        serverMessage || `Request failed with status ${statusCode}`,
        details
      );
    }

    return new WaldeNetworkError(`HTTP ${statusCode}: ${statusMessage}`, undefined, details);
  }

  /**
   * Make an HTTP request with authentication
   */
  private async request(method: string, path: string, body?: any, customHeaders?: Record<string, string>): Promise<any> {
    const accessToken = await this.tokenProvider.getAccessToken();
    const url = `${this.baseUrl}${path}`;

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(customHeaders || {})
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body && (method === 'POST' || method === 'PUT') ? JSON.stringify(body) : undefined,
      });

      const contentType = response.headers.get('content-type');
      let parsedData;

      if (contentType && contentType.includes('application/json')) {
        const data = await response.text();
        parsedData = data ? JSON.parse(data) : null;
      } else {
        parsedData = await response.text();
      }

      if (!response.ok) {
        throw this.handleHttpError(response.status, response.statusText, parsedData, url);
      }

      return parsedData;
    } catch (error) {
      if (error instanceof WaldeNetworkError || error instanceof WaldeAuthenticationError || 
          error instanceof WaldeSystemError || error instanceof WaldeValidationError) {
        throw error;
      }
      throw new WaldeUnexpectedError('HTTP request failed', error as Error);
    }
  }
}
