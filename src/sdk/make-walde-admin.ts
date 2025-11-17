import { WaldeAdminFactory } from './infra/factories/walde-admin-factory';
import { WaldeAdmin } from './infra/futures/walde-admin-future';
import { CredentialsProvider } from './domain/ports/out/credentials-provider';

export interface WaldeAdminConfig {
  credentialsProvider: CredentialsProvider;
  endpoint?: string;
  clientId?: string;
  region?: string;
  stage?: string;
}

/**
 * Customer-facing factory function for creating WaldeAdmin instances
 */
export function MakeWaldeAdmin(config: WaldeAdminConfig): WaldeAdmin {
  return WaldeAdminFactory.createAdmin(config);
}
