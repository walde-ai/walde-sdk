import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';
import { TokenProvider } from '../../domain/ports/in/token-provider';
import { WaldeNetworkError, WaldeSystemError, WaldeAuthenticationError, WaldeValidationError } from '@/sdk/domain/errors';
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
    // This will be called synchronously, but we need async token access
    // Keep the existing implementation for backward compatibility
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
        serverMessage || 'A server error occurred. Please try again later.',
        undefined, // No meaningful cause for server errors
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
    const url = new URL(`${this.baseUrl}${path}`);

    const requestBody = body && (method === 'POST' || method === 'PUT')
      ? JSON.stringify(body)
      : undefined;

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...(requestBody && { 'Content-Length': Buffer.byteLength(requestBody) }),
        ...(customHeaders || {})
      }
    };

    return new Promise((resolve, reject) => {
      const client = url.protocol === 'https:' ? https : http;

      const req = client.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const contentType = res.headers['content-type'];
            let parsedData;

            if (contentType && contentType.includes('application/json')) {
              parsedData = data ? JSON.parse(data) : null;
            } else {
              parsedData = data;
            }

            if (!res.statusCode) {
              reject(new WaldeNetworkError('No status code received from server', new Error('Missing status code')));
              return;
            }

            if (res.statusCode >= 400) {
              reject(this.handleHttpError(res.statusCode, res.statusMessage || '', parsedData, url.toString()));
              return;
            }

            resolve(parsedData);
          } catch (parseError) {
            reject(new WaldeNetworkError('Failed to parse response', parseError as Error));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (requestBody) {
        req.write(requestBody);
      }

      req.end();
    });
  }
}
