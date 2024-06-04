import { fakeAsync, TestBed } from '@angular/core/testing';
import { LocalStorageCacheService } from './local-storage-cache.service';
import { LocalStorageService } from '@core/storage';
import { InMemoryStorageService } from '@testing/storage';
import { CacheData } from '@core/cache/types';
import { firstValueFrom } from 'rxjs';
import { ENVIRONMENT } from '@environments/environment';

describe('LocalStorageCacheService', (): void => {
  let service: LocalStorageCacheService;
  let storageService: InMemoryStorageService;

  describe('Local storage initially empty', (): void => {
    beforeEach((): void => {
      storageService = new InMemoryStorageService();

      TestBed.configureTestingModule({
        providers: [{ provide: LocalStorageService, useValue: storageService }],
      });

      service = TestBed.inject(LocalStorageCacheService);
      TestBed.flushEffects();
    });

    it('should be created', (): void => {
      expect(service).toBeTruthy();
    });

    it('should initialize empty cache data structure in storage', (): void => {
      const cacheData: CacheData | null = storageService.getItem('cache');

      expect(cacheData).toBeTruthy();
      expect(cacheData).toEqual({ entries: {} });
    });

    it('should save new data to cache', async () => {
      const dataKey: string = 'new-data';
      const data = { description: 'My new data to be cached' };

      let cacheEntry = await firstValueFrom(service.getEntry(dataKey));
      expect(cacheEntry).toBeNull();

      service.set(dataKey, data);
      cacheEntry = await firstValueFrom(service.getEntry(dataKey));

      expect(cacheEntry).toBeTruthy();
      expect(cacheEntry?.data).toEqual(data);
      expect(cacheEntry?.timestamp).toBeTruthy();
    });

    it('should synchronize cache data when cache in other browser tab changes', async () => {
      const dataKey: string = 'new-data';
      const data = {
        description: 'This cache entry was added in different browser tab',
      };
      const differentTabCacheData: CacheData = {
        entries: {
          [dataKey]: {
            data: data,
            timestamp: Date.now(),
          },
        },
      };

      let cacheEntry = await firstValueFrom(service.getEntry(dataKey));
      expect(cacheEntry).toBeNull();

      storageService.remoteDataChange$.next({
        key: 'cache',
        value: differentTabCacheData,
      });

      cacheEntry = await firstValueFrom(service.getEntry(dataKey));
      expect(cacheEntry).toBeTruthy();
      expect(cacheEntry?.data).toEqual(data);
    });

    describe('Identyfing fresh & stale cache entries', (): void => {
      beforeEach(() => {
        jasmine.clock().install();
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      it('should correctly identify fresh cache entry', fakeAsync(async () => {
        const dataKey: string = 'new-data';
        const data = { description: 'My new data to be cached' };

        service.set(dataKey, data);
        let cacheEntry = await firstValueFrom(service.getEntry(dataKey));

        expect(cacheEntry).toBeTruthy();
        expect(service.isEntryFresh(cacheEntry!)).toBeTrue();

        jasmine.clock().tick(ENVIRONMENT.CACHE_LIFESPAN_MILLIS + 1);

        cacheEntry = await firstValueFrom(service.getEntry(dataKey));
        expect(service.isEntryFresh(cacheEntry!)).toBeFalse();
      }));

      it('should correctly identify stale cache entry', fakeAsync(async () => {
        const dataKey: string = 'new-data';
        const data = { description: 'My new data to be cached' };

        service.set(dataKey, data);
        let cacheEntry = await firstValueFrom(service.getEntry(dataKey));

        expect(cacheEntry).toBeTruthy();
        expect(service.isEntryStale(cacheEntry!)).toBeFalse();

        jasmine.clock().tick(ENVIRONMENT.CACHE_LIFESPAN_MILLIS + 1);

        cacheEntry = await firstValueFrom(service.getEntry(dataKey));
        expect(service.isEntryStale(cacheEntry!)).toBeTrue();
      }));
    });
  });

  describe('Local storage with initial data available', (): void => {
    const initialCacheData: CacheData = {
      entries: {
        data1: {
          data: { attr1: 'Attr 1', attr2: 'Attr 2' },
          timestamp: Date.now(),
        },
      },
    };

    beforeEach((): void => {
      storageService = new InMemoryStorageService();
      storageService.setItem('cache', initialCacheData);

      TestBed.configureTestingModule({
        providers: [{ provide: LocalStorageService, useValue: storageService }],
      });

      service = TestBed.inject(LocalStorageCacheService);
      TestBed.flushEffects();
    });

    it('should be created', (): void => {
      expect(service).toBeTruthy();
    });

    it('should load initial cache data from storage', (): void => {
      const cacheData: CacheData | null = storageService.getItem('cache');

      expect(cacheData).toBeTruthy();
      expect(cacheData).toEqual(initialCacheData);
    });

    it('should return cache entry from initial data', async () => {
      const cacheEntry = await firstValueFrom(service.getEntry('data1'));

      expect(cacheEntry).toBeTruthy();
      expect(cacheEntry?.data).toEqual({ attr1: 'Attr 1', attr2: 'Attr 2' });
      expect(cacheEntry?.timestamp).toBeTruthy();
    });
  });
});
