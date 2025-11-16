import { TokenProvider } from '../../domain/ports/in/token-provider';
import { CredentialsProvider } from '@/sdk/domain/ports/out/credentials-provider';
import { WaldeAuthenticationError } from '@/sdk/domain/errors';

/**
 * Default implementation of TokenProvider using CredentialsProvider
 */
export class DefaultTokenProvider implements TokenProvider {
  constructor(private readonly credentialsProvider: CredentialsProvider) {}

  /**
   * Get the access token from stored credentials
   */
  public async getAccessToken(): Promise<string> {
    try {
      const credentials = await this.credentialsProvider.retrieve();
      return credentials.idToken;
    } catch (error) {
      throw new WaldeAuthenticationError('Credentials file not found');
    }
  }
}
