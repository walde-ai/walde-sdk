import { CredentialsProvider } from '@/sdk/domain/ports/out/credentials-provider';
import { Credentials } from '@/sdk/domain/entities/credentials';

/**
 * Mock credentials provider for testing
 */
export class MockCredentialsProvider implements CredentialsProvider {
  constructor(
    private readonly accessToken: string = 'mock-access-token',
    private readonly refreshToken: string = 'mock-refresh-token',
    private readonly idToken: string = 'mock-id-token'
  ) {}

  /**
   * Retrieve mock credentials
   */
  async retrieve(): Promise<Credentials> {
    return new Credentials(this.accessToken, this.refreshToken, this.idToken);
  }

  /**
   * Save credentials (no-op for mock)
   */
  async save(credentials: Credentials): Promise<void> {
    // No-op for mock implementation
  }
}
