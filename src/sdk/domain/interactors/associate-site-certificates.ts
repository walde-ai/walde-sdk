import { Result, ok, err } from '@/std';
import { SiteRepository, CertificateAssociationsResult } from '@/sdk/domain/ports/out/site-repository';

/**
 * Associates certificates for a site's custom domain
 */
export class AssociateSiteCertificates {
  constructor(private readonly siteRepository: SiteRepository) {}

  async execute(siteId: string): Promise<Result<CertificateAssociationsResult, string>> {
    try {
      const result = await this.siteRepository.associateCertificates(siteId);
      return ok(result);
    } catch (error) {
      return err(`Failed to associate certificates: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
