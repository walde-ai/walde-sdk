import { FrontendHttpClient } from '@/sdk/infra/adapters/frontend-http-client';
import { ManifestDtoMapper } from '@/sdk/infra/mappers/dto/manifest-dto-mapper';
import { FrontendContentDtoMapper } from '@/sdk/infra/mappers/dto/frontend-content-dto-mapper';
import { WaldeFuture } from '@/sdk/infra/futures/walde-future';

/**
 * Factory for creating properly configured Walde instances
 */
export class WaldeFactory {
  /**
   * Create a Walde instance with all dependencies
   */
  static create(config: { url: string }): WaldeFuture {
    const httpClient = new FrontendHttpClient(config.url);
    const manifestMapper = new ManifestDtoMapper();
    const contentMapper = new FrontendContentDtoMapper();

    return new WaldeFuture(httpClient, manifestMapper, contentMapper);
  }
}
