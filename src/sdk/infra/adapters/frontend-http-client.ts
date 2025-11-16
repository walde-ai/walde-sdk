import { BaseHttpClient } from './base-http-client';

/**
 * HTTP client for making unauthenticated frontend API requests
 */
export class FrontendHttpClient extends BaseHttpClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * Get basic headers without authentication
   */
  protected getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }
}
