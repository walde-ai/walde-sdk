import { Future } from '@/std/domain/entities/future';
import { Result, ok, err } from '@/std/domain/entities/result';
import { FrontendContent } from '@/sdk/domain/entities/frontend-content';
import { ManifestContent } from '@/sdk/domain/entities/manifest-content';
import { FrontendHttpClient } from '@/sdk/infra/adapters/frontend-http-client';
import { FrontendContentDtoMapper } from '@/sdk/infra/mappers/dto/frontend-content-dto-mapper';
import { WaldeValidationError } from '@/sdk/domain/errors';

/**
 * Future for individual content item operations with locale support
 */
export class ContentItemFuture extends Future<FrontendContent, never> {
  private selectedLocale?: string;

  constructor(
    private readonly contentMetadata: ManifestContent,
    private readonly httpClient: FrontendHttpClient,
    private readonly contentMapper: FrontendContentDtoMapper
  ) {
    super({ parent: undefined as never });
  }

  /**
   * Specify locale for content retrieval
   */
  locale(locale: string): ContentItemFuture {
    if (!this.contentMetadata.locales.includes(locale)) {
      throw new WaldeValidationError(
        `Locale '${locale}' not available for content '${this.contentMetadata.name}'. Available locales: ${this.contentMetadata.locales.join(', ')}`
      );
    }

    const newFuture = new ContentItemFuture(
      this.contentMetadata,
      this.httpClient,
      this.contentMapper
    );
    newFuture.selectedLocale = locale;
    return newFuture;
  }

  /**
   * Resolve the content by fetching from the API
   */
  async resolve(): Promise<Result<FrontendContent, any>> {
    try {
      if (!this.selectedLocale) {
        throw new WaldeValidationError(
          `Locale must be specified for content '${this.contentMetadata.name}'. Available locales: ${this.contentMetadata.locales.join(', ')}`
        );
      }

      const endpoint = `/contents/${this.contentMetadata.id}/${this.selectedLocale}.json`;
      const contentData = await this.httpClient.get<any>(endpoint);
      const content = this.contentMapper.toDomain(contentData);
      return ok(content);
    } catch (error) {
      return err(error);
    }
  }
}
