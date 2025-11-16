import { DnsEntry } from './dns-entry';

export enum SiteState {
  UPDATED = 'UPDATED',
  UPDATE_REQUESTED = 'UPDATE_REQUESTED'
}

/**
 * Represents a website with its configuration and DNS settings
 */
export class Site {
  public constructor(
    public readonly id: string,
    public readonly domainName: string,
    public readonly dnsEntries: Record<string, DnsEntry>,
    public readonly state: SiteState
  ) {}
}
