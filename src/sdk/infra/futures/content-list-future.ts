import { Future } from '@/std/domain/entities/future';
import { Result, ok } from '@/std/domain/entities/result';
import { ManifestContent } from '@/sdk/domain/entities/manifest-content';
import { Manifest } from '@/sdk/domain/entities/manifest';

/**
 * Future for content list operations from manifest
 */
export class ContentListFuture extends Future<ManifestContent[], never> {
  constructor(private readonly manifest: Manifest) {
    super({ parent: undefined as never });
  }

  /**
   * Resolve the list of content metadata from manifest
   */
  async resolve(): Promise<Result<ManifestContent[], any>> {
    return ok(this.manifest.contents);
  }
}
