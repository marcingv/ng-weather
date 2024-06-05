import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastMessage } from '../../models/toast-message';

@Component({
  selector: 'app-toast-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-list-item.component.html',
  styleUrl: './toast-list-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastListItemComponent {
  @Input({ required: true }) public toast!: ToastMessage;
  protected readonly toString = toString;
}
