import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EmptyCollectionPlaceholderComponent } from '@ui/placeholders/empty-collection-placeholder';
import { DatePipe } from '@angular/common';
import { DevToolsSettingsService } from '@testing/dev-tools/services/dev-tools-settings.service';

@Component({
  selector: 'app-dev-tools-http-cache-preview',
  standalone: true,
  imports: [EmptyCollectionPlaceholderComponent, DatePipe],
  templateUrl: './dev-tools-http-cache-preview.component.html',
  styleUrl: './dev-tools-http-cache-preview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsHttpCachePreviewComponent {
  private devToolsService = inject(DevToolsSettingsService);

  protected httpCacheEntries = this.devToolsService.httpCacheEntries;
}
