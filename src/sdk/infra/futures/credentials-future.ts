import { Future, Result, ok, err } from '@/std';
import { WaldeAdmin } from './walde-admin-future';
import { Credentials } from '@/sdk/domain/entities/credentials';
import { GetCredentials } from '@/sdk/domain/interactors/get-credentials';
import { RefreshCredentials } from '@/sdk/domain/interactors/refresh-credentials';
import { GetToken } from '@/sdk/domain/interactors/get-token';
import { CognitoTokenRefreshProvider } from '@/sdk/infra/adapters/cognito-token-refresh-provider';
import { WaldeConfigurationError, WaldeUsageError } from '@/sdk/domain/errors';

export class CredentialsFuture extends Future<Credentials, WaldeAdmin> {
  private operation: 'get' | 'refresh' | 'getToken' | null = null;

  constructor({ parent }: { parent: WaldeAdmin }) {
    super({ parent });
  }

  get(): CredentialsFuture {
    const future = new CredentialsFuture({ parent: this.parent });
    future.operation = 'get';
    return future;
  }

  refresh(): CredentialsFuture {
    const future = new CredentialsFuture({ parent: this.parent });
    future.operation = 'refresh';
    return future;
  }

  getToken(): Future<string, WaldeAdmin> {
    return new TokenFuture({ parent: this.parent });
  }

  async resolve(): Promise<Result<Credentials, any>> {
    try {
      const config = this.parent.getConfig();
      
      if (this.operation === 'get') {
        const interactor = new GetCredentials(config.credentialsProvider);
        const credentials = await interactor.execute();
        return ok(credentials);
      } else if (this.operation === 'refresh') {
        if (!config.config.clientId) {
          throw new WaldeConfigurationError('Cognito client ID not configured');
        }
        
        const tokenRefreshProvider = new CognitoTokenRefreshProvider(
          config.config.clientId,
          config.config.region
        );
        const interactor = new RefreshCredentials(
          config.credentialsProvider,
          tokenRefreshProvider
        );
        const credentials = await interactor.execute();
        return ok(credentials);
      } else {
        throw new WaldeUsageError('No operation specified');
      }
    } catch (error: any) {
      return err(error.message);
    }
  }
}

class TokenFuture extends Future<string, WaldeAdmin> {
  constructor({ parent }: { parent: WaldeAdmin }) {
    super({ parent });
  }

  async resolve(): Promise<Result<string, any>> {
    try {
      const config = this.parent.getConfig();
      const interactor = new GetToken(config.credentialsProvider);
      const token = await interactor.execute();
      return ok(token);
    } catch (error: any) {
      return err(error.message);
    }
  }
}
