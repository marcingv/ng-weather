import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EmptyCollectionPlaceholderComponent } from '@ui/placeholders/empty-collection-placeholder';
import { DatePipe } from '@angular/common';
import { DevToolsService } from '@testing/dev-tools/services/dev-tools.service';
import { CacheEntryFreshIndicatorDirective } from '@testing/dev-tools/directives/cache-entry-fresh-indicator.directive';

@Component({
  selector: 'app-dev-tools-http-cache-preview',
  standalone: true,
  imports: [
    EmptyCollectionPlaceholderComponent,
    DatePipe,
    CacheEntryFreshIndicatorDirective,
  ],
  templateUrl: './dev-tools-http-cache-preview.component.html',
  styleUrl: './dev-tools-http-cache-preview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsHttpCachePreviewComponent {
  private devToolsService = inject(DevToolsService);

  protected httpCacheEntries = this.devToolsService.httpCacheEntries;
}
