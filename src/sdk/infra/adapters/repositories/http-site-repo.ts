import { SiteRepository, CertificateAssociationsResult } from '@/sdk/domain/ports/out/site-repository';
import { Site, SiteState } from '@/sdk/domain/entities/site';
import { DnsEntry } from '@/sdk/domain/entities/dns-entry';
import { ApiClient } from '@/sdk/infra/adapters/api-client';

/**
 * Site API response formats
 */
interface SiteListResponse {
  sites: SiteApiData[];
}

interface SiteApiData {
  id: string;
  domainName: string;
  dnsEntries: Record<string, {
    name: string;
    type: string;
    value: string;
  }>;
  state: SiteState;
  certificateAssociations?: Record<string, {
    associated: boolean;
    reason: string;
  }>;
}

/**
 * HTTP implementation of SiteRepository using ApiClient for standard response handling
 */
export class HttpSiteRepository implements SiteRepository {
  private static readonly BASE_PATH = '/v1/sites';

  public constructor(private readonly apiClient: ApiClient) {}

  public async getAll(): Promise<Site[]> {
    // ApiClient automatically extracts payload from standard response format
    const response = await this.apiClient.get<SiteListResponse>(HttpSiteRepository.BASE_PATH);
    const sites = response.sites;

    return sites.map((siteData: SiteApiData) => {
      const dnsEntries: Record<string, DnsEntry> = {};
      
      for (const [key, entry] of Object.entries(siteData.dnsEntries || {})) {
        dnsEntries[key] = new DnsEntry(
          entry.name,
          entry.type,
          entry.value
        );
      }

      return new Site(
        siteData.id,
        siteData.domainName,
        dnsEntries,
        siteData.state
      );
    });
  }

  public async save(site: Site): Promise<Site> {
    const payload = {
      domainName: site.domainName,
      state: site.state
    };

    const path = site.id ? `${HttpSiteRepository.BASE_PATH}/${site.id}` : HttpSiteRepository.BASE_PATH;
    
    // ApiClient automatically extracts payload from standard response format
    const siteData = await this.apiClient.post<SiteApiData>(path, payload);
    
    const dnsEntries: Record<string, DnsEntry> = {};
    
    for (const [key, entry] of Object.entries(siteData.dnsEntries || {})) {
      dnsEntries[key] = new DnsEntry(
        entry.name,
        entry.type,
        entry.value
      );
    }

    return new Site(
      siteData.id,
      siteData.domainName,
      dnsEntries,
      siteData.state
    );
  }

  public async associateCertificates(siteId: string): Promise<CertificateAssociationsResult> {
    const response = await this.apiClient.post<SiteApiData>(`${HttpSiteRepository.BASE_PATH}/${siteId}/associate-certificates`, {});
    
    const dnsEntries: Record<string, DnsEntry> = {};
    for (const [key, entry] of Object.entries(response.dnsEntries || {})) {
      dnsEntries[key] = new DnsEntry(entry.name, entry.type, entry.value);
    }

    const site = new Site(response.id, response.domainName, dnsEntries, response.state);
    
    return {
      site,
      certificateAssociations: response.certificateAssociations || {}
    };
  }
}
