import { Future, Result, ok, err } from '@/std';
import { WaldeAdmin } from './walde-admin-future';
import { Site } from '@/sdk/domain/entities/site';
import { CreateSite } from '@/sdk/domain/interactors/create-site';
import { UpdateSite } from '@/sdk/domain/interactors/update-site';
import { AssociateSiteCertificates } from '@/sdk/domain/interactors/associate-site-certificates';
import { SiteRepository, CertificateAssociationsResult } from '@/sdk/domain/ports/out/site-repository';
import { ContentsFuture } from './contents-future';
import { ContentFuture } from './content-future';
import { ContentIterator } from './content-iterator';
import { UiFuture } from './ui-future';
import { WaldeConfigurationError } from '@/sdk/domain/errors';

export class SiteFuture extends Future<Site | CertificateAssociationsResult, WaldeAdmin> {
  private operation: 'create' | 'update' | 'associateCertificates' | null = null;
  private domainName?: string;
  private siteId?: string;
  private sitesRepo: SiteRepository;

  constructor({ parent, sitesRepo, siteId }: { parent: WaldeAdmin; sitesRepo: SiteRepository; siteId?: string }) {
    super({ parent });
    this.sitesRepo = sitesRepo;
    this.siteId = siteId;
  }

  setCreateOperation(domainName: string): void {
    this.operation = 'create';
    this.domainName = domainName;
  }

  update({ domain }: { domain: string }): SiteFuture {
    const future = new SiteFuture({ parent: this.parent, sitesRepo: this.sitesRepo });
    future.operation = 'update';
    future.siteId = this.siteId;
    future.domainName = domain;
    return future;
  }

  associateCertificates(): SiteFuture {
    if (!this.siteId) {
      throw new WaldeConfigurationError('Site ID required for certificate association');
    }
    const future = new SiteFuture({ parent: this.parent, sitesRepo: this.sitesRepo });
    future.operation = 'associateCertificates';
    future.siteId = this.siteId;
    return future;
  }

  contents(): ContentsFuture {
    if (!this.siteId) {
      throw new WaldeConfigurationError('Site ID required for content operations');
    }
    return new ContentsFuture({ parent: this.parent, siteId: this.siteId });
  }

  content(params: { id: string }): ContentFuture {
    if (!this.siteId) {
      throw new WaldeConfigurationError('Site ID required for content operations');
    }
    return new ContentFuture({ parent: this.parent, siteId: this.siteId, contentId: params.id });
  }

  setContentFromFile(params: { path: string }): ContentFuture {
    if (!this.siteId) {
      throw new WaldeConfigurationError('Site ID required for content operations');
    }
    return new ContentFuture({ parent: this.parent, siteId: this.siteId, filePath: params.path });
  }

  uploadContentsFromFolder(params: { path: string; onProgress?: (current: number, total: number, filePath: string, success: boolean, error?: Error) => void }): ContentIterator {
    if (!this.siteId) {
      throw new WaldeConfigurationError('Site ID required for content operations');
    }
    return new ContentIterator({ parent: this.parent, siteId: this.siteId, folderPath: params.path, onProgress: params.onProgress || (() => {}) });
  }

  uploadUiFromFolder(params: { path: string; onProgress?: (current: number, total: number, filePath: string, success: boolean, error?: Error) => void }): UiFuture {
    if (!this.siteId) {
      throw new WaldeConfigurationError('Site ID required for UI operations');
    }
    
    return new UiFuture({
      parent: this.parent,
      siteId: this.siteId,
      uiUploadCredentialsRepo: this.parent.uiUploadCredentialsRepo,
      s3FilesRepoFactory: this.parent.s3FilesRepoFactory,
      uploadPath: params.path,
      onProgress: params.onProgress || (() => {})
    });
  }

  async resolve(): Promise<Result<Site | CertificateAssociationsResult, string>> {
    if (!this.operation) {
      return err('No operation specified');
    }

    switch (this.operation) {
      case 'create': {
        if (!this.domainName) {
          return err('Domain name required for create operation');
        }
        const createSite = new CreateSite(this.sitesRepo);
        return await createSite.execute(this.domainName);
      }
      case 'update': {
        if (!this.siteId || !this.domainName) {
          return err('Site ID and domain name required for update operation');
        }
        const updateSite = new UpdateSite(this.sitesRepo);
        return await updateSite.execute(this.siteId, this.domainName);
      }
      case 'associateCertificates': {
        if (!this.siteId) {
          return err('Site ID required for certificate association');
        }
        const associateCertificates = new AssociateSiteCertificates(this.sitesRepo);
        const result = await associateCertificates.execute(this.siteId);
        if (result.isErr()) {
          return err(result.unwrapErr());
        }
        // Return the full certificate associations result
        return ok(result.unwrap());
      }
      default:
        return err(`Unknown operation: ${this.operation}`);
    }
  }
}
