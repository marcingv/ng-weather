import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  signal,
} from '@angular/core';
import { DevToolsService } from '@testing/dev-tools/services';
import { LocalStorageCacheService } from '@core/cache/services';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  distinctUntilChanged,
  interval,
  map,
  merge,
  Observable,
  Subscription,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { tadaAnimation } from 'angular-animations';

@Component({
  selector: 'app-dev-tools-cache-items-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dev-tools-cache-items-counter.component.html',
  styleUrl: './dev-tools-cache-items-counter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    tadaAnimation({
      direction: '=>',
      duration: 700,
    }),
  ],
})
export class DevToolsCacheItemsCounterComponent
  implements OnChanges, OnDestroy
{
  private readonly INTERVAL_MS: number = 1000;

  private readonly devToolsService: DevToolsService = inject(DevToolsService);
  private readonly cacheService: LocalStorageCacheService = inject(
    LocalStorageCacheService
  );

  private readonly interval$: Observable<number> = interval(this.INTERVAL_MS);

  public readonly allItemsCount$: Observable<number> = toObservable(
    this.devToolsService.cachedItemsCount
  );

  public readonly freshItemsCount$: Observable<number> = merge(
    this.allItemsCount$,
    this.interval$
  ).pipe(
    map(() => this.cacheService.freshEntriesCount()),
    distinctUntilChanged()
  );

  public readonly staleItemsCount$: Observable<number> = merge(
    this.allItemsCount$,
    this.interval$
  ).pipe(
    map(() => this.cacheService.staleEntriesCount()),
    distinctUntilChanged()
  );

  private animationSubscription?: Subscription;

  protected readonly animateCacheCounter = signal<boolean>(false);
  protected readonly isAnimatingCounter = signal<boolean>(false);

  @Input({ required: true }) public type!: 'all' | 'fresh' | 'stale';

  public ngOnChanges(): void {
    this.setUpCounterAnimations();
  }

  public ngOnDestroy(): void {
    this.destroyAnimations();
  }

  private destroyAnimations(): void {
    if (this.animationSubscription) {
      this.animationSubscription.unsubscribe();
    }
  }

  private setUpCounterAnimations(): void {
    this.destroyAnimations();

    let counter$: Observable<number>;
    switch (this.type) {
      case 'fresh':
        counter$ = this.freshItemsCount$;
        break;
      case 'stale':
        counter$ = this.staleItemsCount$;
        break;
      default:
        counter$ = this.allItemsCount$;
    }

    this.animationSubscription = counter$
      .pipe(
        distinctUntilChanged(),
        tap(() => this.animateCacheCounter.set(true))
      )
      .subscribe();
  }

  protected onCounterAnimationStart(): void {
    this.isAnimatingCounter.set(true);
  }

  protected onCounterAnimationDone(): void {
    this.animateCacheCounter.set(false);
    this.isAnimatingCounter.set(false);
  }
}
