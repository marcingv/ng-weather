import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DevToolsHttpCachePreviewComponent } from '@testing/dev-tools/components/dev-tools-http-cache-preview';
import { DevToolsHttpCacheSettingsComponent } from '@testing/dev-tools/components/dev-tools-http-cache-settings';

@Component({
  selector: 'app-dev-tools-content',
  standalone: true,
  imports: [
    DevToolsHttpCachePreviewComponent,
    DevToolsHttpCacheSettingsComponent,
  ],
  templateUrl: './dev-tools-content.component.html',
  styleUrl: './dev-tools-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsContentComponent {}
