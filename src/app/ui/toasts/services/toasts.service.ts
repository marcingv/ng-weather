import { inject, Injectable, NgZone, Signal } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { ToastMessage } from '../models/toast-message';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ToastsService {
  private readonly DEFAULT_TIMEOUT_MS = 5 * 1000;
  private readonly zone: NgZone = inject(NgZone);
  private readonly messages$ = new BehaviorSubject<ToastMessage[]>([]);

  public readonly messages: Signal<ToastMessage[]> = toSignal(
    this.messages$.pipe(
      map((messages: ToastMessage[]) => messages.slice().reverse())
    ),
    {
      initialValue: [],
    }
  );

  public show(message: ToastMessage): void {
    const updatedMessages: ToastMessage[] = this.messages$.value.slice();
    updatedMessages.push(message);

    this.messages$.next(updatedMessages);

    this.hideAfterTimeout(message);
  }

  public showWithDelay(message: ToastMessage, delayMs: number = 300): void {
    this.zone.runOutsideAngular((): void => {
      setTimeout((): void => {
        this.show(message);
      }, delayMs);
    });
  }

  private remove(message: ToastMessage): void {
    const updatedMessages: ToastMessage[] = this.messages$.value.slice();
    const idx = updatedMessages.indexOf(message);

    if (idx >= 0) {
      updatedMessages.splice(idx, 1);

      this.messages$.next(updatedMessages);
    }
  }

  private hideAfterTimeout(message: ToastMessage): void {
    this.zone.runOutsideAngular((): void => {
      setTimeout(
        () => this.remove(message),
        message.timeoutMs ?? this.DEFAULT_TIMEOUT_MS
      );
    });
  }
}
