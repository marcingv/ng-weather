import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  ModelSignal,
} from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { SettingsIconComponent } from '@ui/icons/settings-icon';
import { LocalStorageCacheService } from '@core/cache/services';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChevronDownComponent } from '@ui/icons/chevron-down';
import { ChevronUpComponent } from '@ui/icons/chevron-up';
import { ButtonDirective } from '@ui/buttons/directives';
import { DevToolsSettingsService } from '@testing/dev-tools/services/dev-tools-settings.service';

@Component({
  selector: 'app-dev-tools-header',
  standalone: true,
  imports: [
    DecimalPipe,
    SettingsIconComponent,
    ChevronDownComponent,
    ChevronUpComponent,
    ButtonDirective,
    NgClass,
    DatePipe,
  ],
  templateUrl: './dev-tools-header.component.html',
  styleUrl: './dev-tools-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsHeaderComponent {
  private readonly ONE_SECOND_MILLIS: number = 1000;

  private cacheService = inject(LocalStorageCacheService);
  private devToolsService = inject(DevToolsSettingsService);

  public readonly cacheLifespan = this.devToolsService.cacheLifespan;

  public readonly cacheLifespanInSeconds = computed(
    () => this.cacheLifespan() / this.ONE_SECOND_MILLIS
  );

  public readonly cachedItemsCount = toSignal(this.cacheService.count());

  public open: ModelSignal<boolean> = model<boolean>(false);

  protected toggleOpen(): void {
    this.open.update((isOpened: boolean) => !isOpened);
  }
}
