import {
  computed,
  effect,
  inject,
  Injectable,
  Signal,
  signal,
} from '@angular/core';
import { DevToolsSettings } from '@testing/dev-tools/types/dev-tools-settings';
import { LocalStorageService } from '@core/storage';
import { tap } from 'rxjs';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { ENVIRONMENT } from '@environments/environment';
import { AppEnvironmentConfig } from '@environments/app-environment-config';

@Injectable({
  providedIn: 'root',
})
export class DevToolsSettingsService {
  private readonly DEFAULT_OPENED_STATE: boolean = false;
  private readonly OPENED_STATE_KEY: string = 'devToolsOpened';
  private readonly SETTINGS_KEY: string = 'devToolsSettings';

  protected sessionStorage = inject(SessionStorageService);
  protected localStorage = inject(LocalStorageService);

  private readonly ENV_DEFAULTS: Signal<AppEnvironmentConfig> =
    signal(ENVIRONMENT).asReadonly();

  public opened = signal<boolean>(
    this.sessionStorage.getItem<boolean>(this.OPENED_STATE_KEY) ??
      this.DEFAULT_OPENED_STATE
  );

  private settings = signal<DevToolsSettings>(
    this.localStorage.getItem<DevToolsSettings>(this.SETTINGS_KEY) ?? {
      cacheLifespan: this.ENV_DEFAULTS().CACHE_LIFESPAN_MILLIS,
    }
  );

  public cacheLifespan: Signal<number> = computed(() => {
    return (
      this.settings().cacheLifespan ?? this.ENV_DEFAULTS().CACHE_LIFESPAN_MILLIS
    );
  });

  public constructor() {
    this.enableOpenedStatePersistence();
    this.enableDevToolsSettingsPersistence();
    this.enableSynchronizationBetweenBrowserTabs();

    this.registerEnvironmentSettingsUpdates();
  }

  public resetSettingsToDefaults(): void {
    this.settings.set({
      cacheLifespan: this.ENV_DEFAULTS().CACHE_LIFESPAN_MILLIS,
    });
  }

  public overrideCacheLifespan(timeInMillis: number): void {
    this.settings.update((prevSettings: DevToolsSettings) => {
      return {
        ...prevSettings,
        cacheLifespan: timeInMillis,
      };
    });
  }

  private enableDevToolsSettingsPersistence(): void {
    effect((): void => {
      this.localStorage.setItem(this.SETTINGS_KEY, this.settings());
    });
  }

  private enableSynchronizationBetweenBrowserTabs(): void {
    this.localStorage
      .remoteChangeNotification<DevToolsSettings>(this.SETTINGS_KEY)
      .pipe(
        tap((remoteSettings: DevToolsSettings | null): void => {
          if (remoteSettings) {
            this.settings.set(remoteSettings);
          }
        })
      )
      .subscribe();
  }

  private enableOpenedStatePersistence() {
    effect(() => {
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

  private registerEnvironmentSettingsUpdates(): void {
    effect((): void => {
      this.applySettingsToEnvironment(this.settings());
    });
  }

  public applySettingsToEnvironment(settings: DevToolsSettings): void {
    if (settings.cacheLifespan !== undefined) {
      ENVIRONMENT.CACHE_LIFESPAN_MILLIS = settings.cacheLifespan;
    }
  }
}
