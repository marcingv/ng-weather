import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastMessage } from '../../models/toast-message';
import { ToastListItemComponent } from '../toast-list-item/toast-list-item.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toasts-list',
  standalone: true,
  imports: [CommonModule, ToastListItemComponent],
  templateUrl: './toasts-list.component.html',
  styleUrl: './toasts-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toastInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate('300ms ease-in', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, height: 0 })),
      ]),
    ]),
  ],
})
export class ToastsListComponent {
  @Input({ required: true }) public messages: ToastMessage[] = [];
}
