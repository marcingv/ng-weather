import { effect, inject, Injectable, signal, Signal } from '@angular/core';
import { AppEnvironmentConfig } from '@environments/app-environment-config';
import { ENVIRONMENT } from '@environments/environment';
import { DevToolsSettings } from '@testing/dev-tools/types';
import { LocalStorageService } from '@core/storage';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DevToolsEnvManagerService {
  private readonly SETTINGS_KEY: string = 'devToolsSettings';
  private readonly localStorage = inject(LocalStorageService);

  public readonly ENV_DEFAULTS: Signal<AppEnvironmentConfig> = signal(
    JSON.parse(JSON.stringify(ENVIRONMENT))
  ).asReadonly();

  public readonly settings = signal<DevToolsSettings>(
    this.localStorage.getItem<DevToolsSettings>(this.SETTINGS_KEY) ?? {
      cacheLifespan: this.ENV_DEFAULTS().CACHE_LIFESPAN_MILLIS,
    }
  );

  public constructor() {
    this.enableSettingsPersistence();
    this.enableSynchronizationBetweenBrowserTabs();
    this.registerEnvironmentSettingsUpdates();
  }

  public applySettingsToEnvironment(settings: DevToolsSettings): void {
    if (settings.cacheLifespan !== undefined) {
      ENVIRONMENT.CACHE_LIFESPAN_MILLIS = settings.cacheLifespan;
    }
  }

  public resetSettingsToDefaults(): void {
    this.settings.update((prevSettings: DevToolsSettings) => {
      return {
        ...prevSettings,
        cacheLifespan: this.ENV_DEFAULTS().CACHE_LIFESPAN_MILLIS,
      };
    });
  }

  private enableSettingsPersistence(): void {
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

  private registerEnvironmentSettingsUpdates(): void {
    effect((): void => {
      this.applySettingsToEnvironment(this.settings());
    });
  }
}
