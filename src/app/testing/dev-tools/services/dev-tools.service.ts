import {
  computed,
  effect,
  inject,
  Injectable,
  Signal,
  signal,
} from '@angular/core';
import { DevToolsSettings } from '@testing/dev-tools/types/dev-tools-settings';
import { tap } from 'rxjs';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { LocalStorageCacheService } from '@core/cache/services';
import { CacheEntry } from '@core/cache/types';
import { HttpResponse } from '@angular/common/http';
import { DevToolsEnvManagerService } from '@testing/dev-tools/services/dev-tools-env-manager.service';

function isHttpResponseEvent<T>(object: unknown): object is HttpResponse<T> {
  return (
    !!object &&
    (object as HttpResponse<T>).url !== undefined &&
    (object as HttpResponse<T>).status !== undefined
  );
}

@Injectable({
  providedIn: 'root',
})
export class DevToolsService {
  private readonly DEFAULT_OPENED_STATE: boolean = false;
  private readonly OPENED_STATE_KEY: string = 'devToolsOpened';

  private readonly devToolsEnvManager = inject(DevToolsEnvManagerService);
  private readonly cacheService = inject(LocalStorageCacheService);
  private readonly sessionStorage = inject(SessionStorageService);

  public readonly opened = signal<boolean>(
    this.sessionStorage.getItem<boolean>(this.OPENED_STATE_KEY) ??
      this.DEFAULT_OPENED_STATE
  );

  public readonly cacheLifespan: Signal<number> = computed(() => {
    return (
      this.devToolsEnvManager.settings().cacheLifespan ??
      this.devToolsEnvManager.ENV_DEFAULTS().CACHE_LIFESPAN_MILLIS
    );
  });

  public readonly httpCacheEntries: Signal<
    CacheEntry<HttpResponse<unknown>>[]
  > = computed(() => {
    const allEntries = this.cacheService.cacheEntries();

    return allEntries
      .filter(this.filterHttpRequestCacheEntries)
      .sort(this.sortCacheEntriesByDateDesc) as CacheEntry<
      HttpResponse<unknown>
    >[];
  });

  public readonly cachedItemsCount = computed(
    () => this.httpCacheEntries().length
  );

  public constructor() {
    this.enableOpenedStatePersistence();
    this.automaticallyCleanStaleCacheEntries();
  }

  public resetSettingsToDefaults(): void {
    this.devToolsEnvManager.resetSettingsToDefaults();
  }

  public overrideCacheLifespan(timeInMillis: number): void {
    this.devToolsEnvManager.settings.update(
      (prevSettings: DevToolsSettings) => {
        return {
          ...prevSettings,
          cacheLifespan: timeInMillis,
        };
      }
    );
  }

  private enableOpenedStatePersistence(): void {
    effect((): void => {
      this.sessionStorage.setItem(this.OPENED_STATE_KEY, this.opened());
    });

    this.sessionStorage
      .remoteChangeNotification<boolean>(this.OPENED_STATE_KEY)
      .pipe(
        tap((remoteUiOpened: boolean | null): void => {
          if (remoteUiOpened !== null) {
            this.sessionStorage.setItem(this.OPENED_STATE_KEY, remoteUiOpened);
          }
        })
      )
      .subscribe();
  }

  private automaticallyCleanStaleCacheEntries(): void {
    effect(
      (): void => {
        if (this.cacheLifespan() >= 0) {
          this.cacheService.removeStaleCacheEntries();
        }
      },
      { allowSignalWrites: true }
    );
  }

  private filterHttpRequestCacheEntries(
    oneEntry: CacheEntry<unknown>
  ): boolean {
    return isHttpResponseEvent(oneEntry.data);
  }

  private sortCacheEntriesByDateDesc(
    a: CacheEntry<unknown>,
    b: CacheEntry<unknown>
  ): number {
    if (a.timestamp === b.timestamp) {
      return 0;
    }

    return a.timestamp > b.timestamp ? -1 : 1;
  }
}
