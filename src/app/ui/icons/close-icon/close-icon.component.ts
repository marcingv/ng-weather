import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-close-icon',
  standalone: true,
  imports: [],
  templateUrl: './close-icon.component.html',
  styleUrl: './close-icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseIconComponent {
  @Input() public cssClass: string = 'inline-block size-4';
}
