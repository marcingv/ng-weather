import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  ModelSignal,
  signal,
} from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { SettingsIconComponent } from '@ui/icons/settings-icon';
import { LocalStorageCacheService } from '@core/cache/services';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChevronDownComponent } from '@ui/icons/chevron-down';
import { ChevronUpComponent } from '@ui/icons/chevron-up';
import { ButtonDirective } from '@ui/buttons/directives';

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
  ],
  templateUrl: './dev-tools-header.component.html',
  styleUrl: './dev-tools-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsHeaderComponent {
  private cacheService = inject(LocalStorageCacheService);

  public readonly cacheLifespan = signal<number>(
    this.cacheService.cacheEntryLifespan()
  );

  public readonly cacheLifespanInSeconds = computed(
    () => this.cacheLifespan() / 1000
  );

  public readonly cachedItemsCount = toSignal(this.cacheService.count());

  public open: ModelSignal<boolean> = model<boolean>(false);

  protected toggleOpen(): void {
    this.open.update((isOpened: boolean) => !isOpened);
  }
}
