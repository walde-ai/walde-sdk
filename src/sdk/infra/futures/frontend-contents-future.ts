import { Future } from '@/std/domain/entities/future';
import { Result, ok } from '@/std/domain/entities/result';
import { Manifest } from '@/sdk/domain/entities/manifest';
import { FrontendHttpClient } from '@/sdk/infra/adapters/frontend-http-client';
import { FrontendContentDtoMapper } from '@/sdk/infra/mappers/dto/frontend-content-dto-mapper';
import { ContentListFuture } from './content-list-future';
import { ContentItemFuture } from './content-item-future';
import { WaldeValidationError } from '@/sdk/domain/errors';

/**
 * Future for frontend content operations with manifest-based validation
 */
export class FrontendContentsFuture extends Future<FrontendContentsFuture, never> {
  constructor(
    private readonly manifest: Manifest,
    private readonly httpClient: FrontendHttpClient,
    private readonly contentMapper: FrontendContentDtoMapper
  ) {
    super({ parent: undefined as never });
  }

  /**
   * Resolve returns self for method chaining
   */
  async resolve(): Promise<Result<FrontendContentsFuture, any>> {
    return ok(this);
  }

  /**
   * Get list of contents from manifest
   */
  list(): ContentListFuture {
    return new ContentListFuture(this.manifest);
  }

  /**
   * Get content by ID with validation against manifest
   */
  id(id: string): ContentItemFuture {
    const contentMetadata = this.manifest.contents.find(content => content.id === id);
    if (!contentMetadata) {
      throw new WaldeValidationError(`Content with ID '${id}' not found in manifest`);
    }

    return new ContentItemFuture(contentMetadata, this.httpClient, this.contentMapper);
  }

  /**
   * Get content by name with validation against manifest
   */
  name(name: string): ContentItemFuture {
    const contentMetadata = this.manifest.contents.find(content => content.name === name);
    if (!contentMetadata) {
      throw new WaldeValidationError(`Content with name '${name}' not found in manifest`);
    }

    return new ContentItemFuture(contentMetadata, this.httpClient, this.contentMapper);
  }

  /**
   * Get content by key with validation against manifest
   */
  key(key: string): ContentItemFuture {
    const contentMetadata = this.manifest.contents.find(content => content.key === key);
    if (!contentMetadata) {
      throw new WaldeValidationError(`Content with key '${key}' not found in manifest`);
    }

    return new ContentItemFuture(contentMetadata, this.httpClient, this.contentMapper);
  }
}
