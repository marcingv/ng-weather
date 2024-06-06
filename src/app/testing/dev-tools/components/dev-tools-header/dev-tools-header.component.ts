import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  ModelSignal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsIconComponent } from '@ui/icons/settings-icon';
import { ChevronDownComponent } from '@ui/icons/chevron-down';
import { ChevronUpComponent } from '@ui/icons/chevron-up';
import { ButtonDirective } from '@ui/buttons/directives';
import { DevToolsService } from '@testing/dev-tools/services/dev-tools.service';
import { tadaAnimation } from 'angular-animations';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, tap } from 'rxjs';

@Component({
  selector: 'app-dev-tools-header',
  standalone: true,
  imports: [
    CommonModule,
    SettingsIconComponent,
    ChevronDownComponent,
    ChevronUpComponent,
    ButtonDirective,
  ],
  templateUrl: './dev-tools-header.component.html',
  styleUrl: './dev-tools-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    tadaAnimation({
      direction: '=>',
      duration: 700,
    }),
  ],
})
export class DevToolsHeaderComponent {
  private readonly ONE_SECOND_MILLIS: number = 1000;

  private devToolsService = inject(DevToolsService);

  public readonly cachedItemsCount = this.devToolsService.cachedItemsCount;
  public readonly cacheLifespan = this.devToolsService.cacheLifespan;
  public readonly cacheLifespanInSeconds = computed(
    () => this.cacheLifespan() / this.ONE_SECOND_MILLIS
  );
  public readonly open: ModelSignal<boolean> = model<boolean>(false);

  protected readonly animateCacheCounter = signal<boolean>(false);
  protected readonly isAnimatingCounter = signal<boolean>(false);

  protected toggleOpen(): void {
    this.open.update((isOpened: boolean) => !isOpened);
  }

  public constructor() {
    this.setUpCounterAnimations();
  }

  private setUpCounterAnimations(): void {
    toObservable(this.cachedItemsCount)
      .pipe(
        distinctUntilChanged(),
        tap(() => this.animateCacheCounter.set(true)),
        takeUntilDestroyed()
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
