import { WaldeAdminFactory } from './infra/factories/walde-admin-factory';
import { WaldeAdmin } from './infra/futures/walde-admin-future';
import { CredentialsProvider } from './domain/ports/out/credentials-provider';

interface MakeWaldeAdminConfig {
  credentialsProvider: CredentialsProvider;
  endpoint?: string;
  clientId?: string;
  region?: string;
  stage?: string;
}

/**
 * Customer-facing factory function for creating WaldeAdmin instances
 */
export function MakeWaldeAdmin(config: MakeWaldeAdminConfig): WaldeAdmin {
  return WaldeAdminFactory.createAdmin(config);
}
