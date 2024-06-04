import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  model,
  Signal,
  viewChild,
} from '@angular/core';
import { FormControlDirective } from '@ui/forms';
import { LocalStorageCacheService } from '@core/cache/services';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-dev-tools-http-cache-settings',
  standalone: true,
  imports: [FormControlDirective, FormsModule],
  templateUrl: './dev-tools-http-cache-settings.component.html',
  styleUrl: './dev-tools-http-cache-settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsHttpCacheSettingsComponent {
  private cacheService = inject(LocalStorageCacheService);

  public cacheLifespan = model<number>(this.cacheService.cacheEntryLifespan());

  private cacheLifespanCtrl: Signal<NgModel | undefined> =
    viewChild<NgModel>('cacheLifespanCtrl');

  public constructor() {
    effect((): void => {
      const targetLifespanMillis = this.cacheLifespan();
      const formControl = this.cacheLifespanCtrl();

      if (
        targetLifespanMillis &&
        !!formControl &&
        formControl.valid &&
        formControl.dirty
      ) {
        this.updateCacheLifespanSetting(targetLifespanMillis);
      }
    });
  }

  private updateCacheLifespanSetting(targetLifespanMillis: number): void {
    // TODO: Update lifespan
    console.warn('new lifespan', targetLifespanMillis);
  }
}
