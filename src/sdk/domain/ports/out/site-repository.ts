import { Site } from '@/sdk/domain/entities/site';

/**
 * Certificate association result
 */
export interface CertificateAssociation {
  associated: boolean;
  reason: string;
}

/**
 * Certificate associations response
 */
export interface CertificateAssociationsResult {
  site: Site;
  certificateAssociations: Record<string, CertificateAssociation>;
}

/**
 * Repository interface for site data access
 */
export interface SiteRepository {
  /**
   * Retrieves all sites for the authenticated user
   */
  getAll(): Promise<Site[]>;

  /**
   * Creates or updates a site
   * If site.id is empty, creates new site (POST /v1/sites)
   * If site.id is provided, updates existing site (POST /v1/sites/<id>)
   */
  save(site: Site): Promise<Site>;

  /**
   * Associates certificates for a site's custom domain
   */
  associateCertificates(siteId: string): Promise<CertificateAssociationsResult>;
}
