import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsIconComponent } from '@ui/icons/settings-icon';
import { ChevronDownComponent } from '@ui/icons/chevron-down';
import { ChevronUpComponent } from '@ui/icons/chevron-up';
import { ButtonDirective } from '@ui/buttons/directives';
import { DevToolsService } from '@testing/dev-tools/services/dev-tools.service';
import { TimeSpanPipe } from '@ui/pipes';
import { DevToolsCacheItemsCounterComponent } from '@testing/dev-tools/components/dev-tools-cache-items-counter/dev-tools-cache-items-counter.component';

@Component({
  selector: 'app-dev-tools-header',
  standalone: true,
  imports: [
    CommonModule,
    SettingsIconComponent,
    ChevronDownComponent,
    ChevronUpComponent,
    ButtonDirective,
    TimeSpanPipe,
    DevToolsCacheItemsCounterComponent,
  ],
  templateUrl: './dev-tools-header.component.html',
  styleUrl: './dev-tools-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsHeaderComponent {
  private devToolsService: DevToolsService = inject(DevToolsService);

  public readonly cacheLifespan = this.devToolsService.cacheLifespan;
  public readonly open = model<boolean>(false);

  protected toggleOpen(): void {
    this.open.update((isOpened: boolean) => !isOpened);
  }
}
