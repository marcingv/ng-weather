import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { LocalStorageCacheService } from '@core/cache/services';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { SettingsIconComponent } from '@ui/icons/settings-icon';

/**
 * This component is here only to make it easier to test whole application during verification by the Angular Training Team.
 */
@Component({
  selector: 'app-dev-tools',
  standalone: true,
  imports: [CommonModule, SettingsIconComponent],
  templateUrl: './dev-tools.component.html',
  styleUrl: './dev-tools.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsComponent {
  private cacheService = inject(LocalStorageCacheService);

  public readonly cacheLifespan = signal<number>(
    this.cacheService.cacheEntryLifespan()
  );

  public readonly cacheLifespanInSeconds = computed(
    () => this.cacheLifespan() / 1000
  );

  public readonly cachedItemsCount = toSignal(this.cacheService.count());
}
