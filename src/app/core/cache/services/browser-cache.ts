import { BrowserStorage } from '@core/storage';
import { map, Observable, of, tap } from 'rxjs';
import { CacheEntry } from '@core/cache/types/cache-entry';
import { effect, signal, WritableSignal } from '@angular/core';
import { CacheData } from '@core/cache/types/cache-data';
import { ENVIRONMENT } from '@environments/environment';

export abstract class BrowserCache {
  private readonly CACHE_KEY: string = 'cache';
  private storage!: BrowserStorage;

  private readonly cacheData: WritableSignal<CacheData> = signal<CacheData>({
    entries: {},
  });

  public constructor() {
    effect((): void => {
      // On cache data change - persist cache data to storage:
      this.storage.setItem(this.CACHE_KEY, this.cacheData());
    });
  }

  protected setUpCache(storage: BrowserStorage): void {
    this.storage = storage;

    this.readCacheEntriesFromStorage();
    this.enableSynchronizationBetweenBrowserTabs();
  }

  private readCacheEntriesFromStorage() {
    const cacheData = this.storage.getItem<CacheData>(this.CACHE_KEY);
    if (!cacheData) {
      return;
    }

    this.cacheData.set(cacheData);
  }

  public getEntry<T>(cacheKey: string): Observable<CacheEntry<T> | null> {
    return of(this.cacheData().entries[cacheKey] as CacheEntry<T>);
  }

  public get<T>(cacheKey: string): Observable<T | null> {
    return this.getEntry<T>(cacheKey).pipe(map(entry => entry?.data ?? null));
  }

  public set<T>(cacheKey: string, data: T): void {
    const entry: CacheEntry<T> = {
      data: data,
      timestamp: Date.now(),
    };

    this.cacheData.update((prevData: CacheData) => {
      return {
        ...prevData,
        entries: {
          ...prevData.entries,
          [cacheKey]: entry,
        },
      };
    });
  }

  private enableSynchronizationBetweenBrowserTabs(): void {
    this.storage
      .remoteChangeNotification<CacheData>(this.CACHE_KEY)
      .pipe(
        tap((remoteCacheData: CacheData | null): void => {
          if (remoteCacheData) {
            this.cacheData.set(remoteCacheData);
          }
        })
      )
      .subscribe();
  }

  public isEntryFresh<T>(entry: CacheEntry<T>): boolean {
    return !this.isEntryStale(entry);
  }

  public isEntryStale<T>(entry: CacheEntry<T>): boolean {
    return entry.timestamp + ENVIRONMENT.CACHE_LIFESPAN_MILLIS < Date.now();
  }
}
