import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { FormControlDirective } from '@ui/forms';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DevToolsService } from '@testing/dev-tools/services/dev-tools.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, Observable, tap } from 'rxjs';
import { ButtonDirective } from '@ui/buttons/directives';
import { CloseIconComponent } from '@ui/icons/close-icon';
import { NoSymbolIconComponent } from '@ui/icons/no-symbol-icon';
import { DevToolsCacheItemsCounterComponent } from '../dev-tools-cache-items-counter/dev-tools-cache-items-counter.component';

@Component({
  selector: 'app-dev-tools-http-cache-settings',
  standalone: true,
  imports: [
    FormControlDirective,
    ReactiveFormsModule,
    ButtonDirective,
    CloseIconComponent,
    NoSymbolIconComponent,
    DevToolsCacheItemsCounterComponent,
  ],
  templateUrl: './dev-tools-http-cache-settings.component.html',
  styleUrl: './dev-tools-http-cache-settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsHttpCacheSettingsComponent {
  private readonly ONE_SECOND_MILLIS: number = 1000;
  private readonly UPDATE_DEBOUNCE_MILLIS: number = 300;

  private devToolsService = inject(DevToolsService);

  public cacheLifespanSecs = computed(
    () => this.devToolsService.cacheLifespan() / this.ONE_SECOND_MILLIS
  );

  protected cacheLifespanCtrl: FormControl<number | null> = new FormControl(
    this.cacheLifespanSecs(),
    [Validators.required, Validators.min(0)]
  );

  private updateCacheLifetime$: Observable<number | null> =
    this.cacheLifespanCtrl.events.pipe(
      map(() => this.cacheLifespanCtrl.value),
      distinctUntilChanged(),
      debounceTime(this.UPDATE_DEBOUNCE_MILLIS),
      tap((cacheLifespanSecs: number | null): void => {
        if (
          cacheLifespanSecs === null ||
          !this.cacheLifespanCtrl.valid ||
          !this.cacheLifespanCtrl.dirty
        ) {
          return;
        }

        const valueInMillis = cacheLifespanSecs * this.ONE_SECOND_MILLIS;
        this.updateCacheLifespanSetting(valueInMillis);
      })
    );

  public constructor() {
    this.updateCacheLifetime$.pipe(takeUntilDestroyed()).subscribe();

    effect(() => {
      this.cacheLifespanCtrl.setValue(this.cacheLifespanSecs(), {
        emitEvent: false,
      });
      this.cacheLifespanCtrl.markAsPristine();
    });
  }

  private updateCacheLifespanSetting(targetLifespanMillis: number): void {
    this.devToolsService.overrideCacheLifespan(targetLifespanMillis);
  }

  protected resetToDefaults(): void {
    this.devToolsService.resetSettingsToDefaults();
  }

  protected clearCache(): void {
    this.devToolsService.clearCache();
  }
}
