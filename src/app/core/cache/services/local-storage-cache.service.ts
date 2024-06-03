import { inject, Injectable } from '@angular/core';
import { BrowserCache } from '@core/cache/services/browser-cache';
import { BrowserStorage, LocalStorageService } from '@core/storage';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageCacheService extends BrowserCache {
  private provider: BrowserStorage = inject(LocalStorageService);

  public constructor() {
    super();

    this.setUpCache(this.provider);
  }
}
