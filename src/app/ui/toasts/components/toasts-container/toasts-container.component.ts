import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastsService } from '../../services/toasts.service';
import { ToastsListComponent } from '../toasts-list/toasts-list.component';

@Component({
  selector: 'app-toasts-container',
  standalone: true,
  imports: [CommonModule, ToastsListComponent],
  templateUrl: './toasts-container.component.html',
  styleUrl: './toasts-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastsContainerComponent {
  protected toastsService = inject(ToastsService);
  protected cd = inject(ChangeDetectorRef);

  public constructor() {
    effect(() => {
      if (this.toastsService.messages()) {
        this.cd.markForCheck();
      }
    });
  }
}
