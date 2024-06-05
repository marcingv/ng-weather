import { inject, Injectable } from '@angular/core';
import { BrowserCache } from '@core/cache/services/browser-cache';
import { BrowserStorage, LocalStorageService } from '@core/storage';
import { ENVIRONMENT } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageCacheService extends BrowserCache {
  private provider: BrowserStorage = inject(LocalStorageService);

  public constructor() {
    super();

    this.setUpCache(this.provider);
  }

  public override cacheEntryLifespan(): number {
    return ENVIRONMENT.CACHE_LIFESPAN_MILLIS;
  }
}
