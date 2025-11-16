import { Future } from '@/std/domain/entities/future';
import { Result, ok, err } from '@/std/domain/entities/result';
import { FrontendHttpClient } from '@/sdk/infra/adapters/frontend-http-client';
import { ManifestDtoMapper } from '@/sdk/infra/mappers/dto/manifest-dto-mapper';
import { FrontendContentDtoMapper } from '@/sdk/infra/mappers/dto/frontend-content-dto-mapper';
import { ManifestFuture } from './manifest-future';
import { FrontendContentsFuture } from './frontend-contents-future';

/**
 * Future for content operations that resolves manifest first
 */
class ContentsFutureWrapper extends Future<FrontendContentsFuture, never> {
  constructor(
    private readonly manifestFuture: ManifestFuture,
    private readonly httpClient: FrontendHttpClient,
    private readonly contentMapper: FrontendContentDtoMapper
  ) {
    super({ parent: undefined as never });
  }

  async resolve(): Promise<Result<FrontendContentsFuture, any>> {
    try {
      const manifestResult = await this.manifestFuture.resolve();
      if (manifestResult.isErr()) {
        return err(manifestResult.unwrapErr());
      }
      
      const manifest = manifestResult.unwrap();
      const contentsFuture = new FrontendContentsFuture(manifest, this.httpClient, this.contentMapper);
      return ok(contentsFuture);
    } catch (error) {
      return err(error);
    }
  }
}

/**
 * Main Walde future class for frontend SDK operations
 */
export class WaldeFuture extends Future<WaldeFuture, never> {
  constructor(
    private readonly httpClient: FrontendHttpClient,
    private readonly manifestMapper: ManifestDtoMapper,
    private readonly contentMapper: FrontendContentDtoMapper
  ) {
    super({ parent: undefined as never });
  }

  /**
   * Resolve returns self for method chaining
   */
  async resolve(): Promise<Result<WaldeFuture, any>> {
    return ok(this);
  }

  /**
   * Get manifest operations
   */
  manifest(): ManifestFuture {
    return new ManifestFuture(this.httpClient, this.manifestMapper);
  }

  /**
   * Get content operations (requires manifest for validation)
   */
  contents(): ContentsFutureWrapper {
    const manifestFuture = this.manifest();
    return new ContentsFutureWrapper(manifestFuture, this.httpClient, this.contentMapper);
  }
}
