import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsIconComponent } from '@ui/icons/settings-icon';
import { DevToolsHeaderComponent } from '@testing/dev-tools/components/dev-tools-header/dev-tools-header.component';
import { DevToolsContentComponent } from '@testing/dev-tools/components/dev-tools-content/dev-tools-content.component';
import { DevToolsSettingsService } from '@testing/dev-tools/services/dev-tools-settings.service';

/**
 * This component is here only to make it easier to test whole application during verification by the Angular Training Team.
 */
@Component({
  selector: 'app-dev-tools',
  standalone: true,
  imports: [
    CommonModule,
    SettingsIconComponent,
    DevToolsHeaderComponent,
    DevToolsContentComponent,
  ],
  templateUrl: './dev-tools.component.html',
  styleUrl: './dev-tools.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsComponent {
  protected devToolsService = inject(DevToolsSettingsService);
  protected uiOpened = this.devToolsService.opened;
}
