import {
  Directive,
  HostBinding,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { CacheEntry } from '@core/cache/types';
import { LocalStorageCacheService } from '@core/cache/services';

@Directive({
  selector: '[appCacheEntryFreshIndicator]',
  standalone: true,
})
export class CacheEntryFreshIndicatorDirective
  implements OnInit, OnChanges, OnDestroy
{
  private readonly UPDATE_INTERVAL_MS: number = 1000;

  private cacheService = inject(LocalStorageCacheService);

  @Input({ required: true })
  public appCacheEntryFreshIndicator!: CacheEntry<unknown>;

  private isFresh?: WritableSignal<boolean>;

  @HostBinding('class') get cssClass(): string {
    if (!this.isFresh) {
      return '';
    }

    const css: string = 'cursor-pointer text-white rounded';
    if (this.isFresh()) {
      return `${css} bg-green-500`;
    } else {
      return `${css} bg-red-500`;
    }
  }

  @HostBinding('title') get title(): string {
    if (!this.isFresh) {
      return '';
    }

    return this.isFresh() ? 'Fresh entry' : 'Stale entry';
  }

  private updateTimeout?: ReturnType<typeof setInterval>;

  public ngOnInit(): void {
    this.isFresh = signal<boolean>(this.isEntryFresh());

    this.updateTimeout = setInterval((): void => {
      this.isFresh?.set(this.isEntryFresh());
    }, this.UPDATE_INTERVAL_MS);
  }

  public ngOnChanges(): void {
    this.isFresh?.set(this.isEntryFresh());
  }

  public ngOnDestroy(): void {
    if (this.updateTimeout) {
      clearInterval(this.updateTimeout);
    }
  }

  private isEntryFresh(): boolean {
    return this.cacheService.isEntryFresh(this.appCacheEntryFreshIndicator);
  }
}
