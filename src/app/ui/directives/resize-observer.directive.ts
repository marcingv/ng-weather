import {
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  map,
  Observable,
  Subscription,
  tap,
} from 'rxjs';

interface Size {
  width: number | null;
  height: number | null;
}

@Directive({
  selector: '[appResizeObserver]',
  standalone: true,
  exportAs: 'resizeObserver',
})
export class ResizeObserverDirective implements OnChanges, OnDestroy {
  private readonly DEFAULT_DEBOUNCE_TIME_MS: number = 500;

  @Input({ required: true }) public appResizeObserver: boolean = true;
  @Input() public emitDebounceTimeMs?: number;

  @Output() public sizeChange = new EventEmitter<Size>();

  private _size$ = new BehaviorSubject<Size>({
    width: null,
    height: null,
  });

  public size$ = this._size$.asObservable();

  public width$: Observable<number | null> = this.size$.pipe(
    map(size => size.width)
  );

  public height$: Observable<number | null> = this.size$.pipe(
    map(size => size.height)
  );

  private host: ElementRef<HTMLElement> = inject(ElementRef);
  private observer?: ResizeObserver;
  private sizeEmittersSubscription?: Subscription;

  private configureObserver(): void {
    this.destroyObserver();

    const isEnabled: boolean = this.appResizeObserver ?? true;
    if (!isEnabled) {
      return;
    }

    this.createObserver();
  }

  public ngOnChanges(): void {
    this.configureObserver();
  }

  public ngOnDestroy(): void {
    this.destroyObserver();

    this._size$.complete();
  }

  private createObserver(): void {
    this.observer = new ResizeObserver(
      (entries: ResizeObserverEntry[]): void => {
        if (!entries.length) {
          return;
        }

        const width: number = entries[0].contentRect.width;
        const height: number = entries[0].contentRect.height;

        this._size$.next({ width: width, height: height });
      }
    );

    this.observer.observe(this.host.nativeElement);

    // Setup output emitter:
    this.sizeEmittersSubscription = this._size$
      .pipe(
        debounceTime(this.emitDebounceTimeMs ?? this.DEFAULT_DEBOUNCE_TIME_MS),
        tap((size: Size): void => {
          this.sizeChange.next(size);
        })
      )
      .subscribe();
  }

  private destroyObserver(): void {
    if (this.observer) {
      this.observer.unobserve(this.host.nativeElement);
      this.observer = undefined;
    }
    if (this.sizeEmittersSubscription) {
      this.sizeEmittersSubscription.unsubscribe();
      this.sizeEmittersSubscription = undefined;
    }
  }
}
