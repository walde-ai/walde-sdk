import { Result, ok, err } from '@/std';
import { Site, SiteState } from '@/sdk/domain/entities/site';
import { SiteRepository } from '@/sdk/domain/ports/out/site-repository';

export class UpdateSite {
  constructor(private readonly siteRepository: SiteRepository) {}

  async execute(siteId: string, domainName: string): Promise<Result<Site, string>> {
    try {
      const siteToUpdate = new Site(siteId, domainName, {}, SiteState.UPDATE_REQUESTED);
      const savedSite = await this.siteRepository.save(siteToUpdate);
      return ok(savedSite);
    } catch (error) {
      return err(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
