import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import { LocalStorageCacheService } from '@core/cache/services';
import { CacheEntry } from '@core/cache/types';
import { HttpResponse } from '@angular/common/http';
import { EmptyCollectionPlaceholderComponent } from '@ui/placeholders/empty-collection-placeholder';
import { DatePipe } from '@angular/common';

function isHttpResponseEvent<T>(object: unknown): object is HttpResponse<T> {
  return (
    !!object &&
    (object as HttpResponse<T>).url !== undefined &&
    (object as HttpResponse<T>).status !== undefined
  );
}

@Component({
  selector: 'app-dev-tools-http-cache-preview',
  standalone: true,
  imports: [EmptyCollectionPlaceholderComponent, DatePipe],
  templateUrl: './dev-tools-http-cache-preview.component.html',
  styleUrl: './dev-tools-http-cache-preview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsHttpCachePreviewComponent {
  private cacheService = inject(LocalStorageCacheService);

  protected httpCacheEntries: Signal<CacheEntry<HttpResponse<unknown>>[]> =
    computed(() => {
      const allEntries = this.cacheService.cacheEntries();

      return allEntries
        .filter(this.filterHttpRequestCacheEntries)
        .sort(this.sortCacheEntriesByDateDesc) as CacheEntry<
        HttpResponse<unknown>
      >[];
    });

  private filterHttpRequestCacheEntries(
    oneEntry: CacheEntry<unknown>
  ): boolean {
    return isHttpResponseEvent(oneEntry.data);
  }

  private sortCacheEntriesByDateDesc(
    a: CacheEntry<unknown>,
    b: CacheEntry<unknown>
  ): number {
    if (a.timestamp === b.timestamp) {
      return 0;
    }

    return a.timestamp > b.timestamp ? -1 : 1;
  }
}
