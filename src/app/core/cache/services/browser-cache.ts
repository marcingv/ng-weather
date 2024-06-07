import { BrowserStorage } from '@core/storage';
import { Observable, of, tap } from 'rxjs';
import { CacheEntry } from '@core/cache/types/cache-entry';
import {
  computed,
  effect,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CacheData } from '@core/cache/types/cache-data';
import { toObservable } from '@angular/core/rxjs-interop';
import { CacheEntryKey } from '../types';

export abstract class BrowserCache {
  private readonly CACHE_KEY: string = 'cache';
  private storage!: BrowserStorage;

  private readonly cacheData: WritableSignal<CacheData> = signal<CacheData>({
    entries: {},
  });
  private readonly countSignal: Signal<number> = computed(() => {
    return Object.keys(this.cacheData().entries).length;
  });
  private readonly count$: Observable<number> = toObservable(this.countSignal);

  public cacheEntries = computed(() => {
    return Object.values(this.cacheData().entries);
  });

  public constructor() {
    effect((): void => {
      // On cache data change - persist cache data to storage:
      this.storage.setItem(this.CACHE_KEY, this.cacheData());
    });
  }

  public abstract cacheEntryLifespan(): number;

  protected setUpCache(storage: BrowserStorage): void {
    this.storage = storage;

    this.readCacheEntriesFromStorage();
    this.removeStaleCacheEntries();
    this.enableSynchronizationBetweenBrowserTabs();
  }

  private readCacheEntriesFromStorage() {
    const cacheData = this.storage.getItem<CacheData>(this.CACHE_KEY);
    if (!cacheData) {
      return;
    }

    this.cacheData.set(cacheData);
  }

  public count(): Observable<number> {
    return this.count$;
  }

  public freshEntriesCount(): number {
    return this.cacheEntries().filter(oneEntry => this.isEntryFresh(oneEntry))
      .length;
  }

  public staleEntriesCount(): number {
    return this.cacheEntries().filter(oneEntry => this.isEntryStale(oneEntry))
      .length;
  }

  public getEntry<T>(
    cacheKey: CacheEntryKey
  ): Observable<CacheEntry<T> | null> {
    return of((this.cacheData().entries[cacheKey] as CacheEntry<T>) ?? null);
  }

  public set<T>(cacheKey: CacheEntryKey, data: T): void {
    const entry: CacheEntry<T> = {
      key: cacheKey,
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

  public remove(cacheKey: CacheEntryKey): void {
    this.cacheData.update((prevData: CacheData) => {
      const updatedEntries = { ...prevData.entries };
      if (updatedEntries[cacheKey]) {
        delete updatedEntries[cacheKey];
      }

      return {
        ...prevData,
        entries: updatedEntries,
      };
    });
  }

  public clear(): void {
    this.cacheData.update((prevData: CacheData) => {
      return {
        ...prevData,
        entries: {},
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
    return entry.timestamp + this.cacheEntryLifespan() < Date.now();
  }

  public removeStaleCacheEntries(): void {
    this.cacheData.update((prevCacheData: CacheData) => {
      let hasStaleEntries: boolean = false;

      const newCacheData: CacheData = {
        ...prevCacheData,
        entries: { ...prevCacheData.entries },
      };

      for (const entryKey in newCacheData.entries) {
        const cacheEntry = newCacheData.entries[entryKey];
        if (this.isEntryStale(cacheEntry)) {
          hasStaleEntries = true;
          delete newCacheData.entries[entryKey];
        }
      }

      if (!hasStaleEntries) {
        // No stale entries - keep cache data unchanged
        return prevCacheData;
      } else {
        return newCacheData;
      }
    });
  }
}
