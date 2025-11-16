import { Result, ok, err } from '@/std';
import { Site, SiteState } from '@/sdk/domain/entities/site';
import { SiteRepository } from '@/sdk/domain/ports/out/site-repository';

export class CreateSite {
  constructor(private readonly siteRepository: SiteRepository) {}

  async execute(domainName: string): Promise<Result<Site, string>> {
    try {
      const newSite = new Site('', domainName, {}, SiteState.UPDATE_REQUESTED);
      const savedSite = await this.siteRepository.save(newSite);
      return ok(savedSite);
    } catch (error) {
      return err(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
